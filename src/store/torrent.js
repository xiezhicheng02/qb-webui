import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import qbittorrentAPI from '@/api/qbittorrent'
import { useNotificationStore } from './notification'

export const useTorrentStore = defineStore('torrent', () => {
  const notificationStore = useNotificationStore()
  // 状态
  const torrents = ref([])
  const transferInfo = ref({})
  const serverState = ref({})
  const categories = ref([])
  const tags = ref([])
  const preferences = ref({})
  const isLoading = ref(false)
  const error = ref(null)
  const lastUpdate = ref(null)
  const isConnected = ref(false)

  // Getters
  const totalTorrents = computed(() => torrents.value.length)
  const downloadingCount = computed(() =>
    torrents.value.filter(t => t.state === 'downloading').length
  )
  const uploadingCount = computed(() =>
    torrents.value.filter(t => t.state === 'uploading').length
  )
  const completedCount = computed(() =>
    torrents.value.filter(t => t.progress === 100).length
  )
  const pausedCount = computed(() =>
    torrents.value.filter(t => t.state === 'pausedUP' || t.state === 'pausedDL').length
  )
  const errorCount = computed(() =>
    torrents.value.filter(t => t.state === 'error' || t.state === 'stalledUP' || t.state === 'stalledDL').length
  )
  const totalDownloadSpeed = computed(() =>
    torrents.value.reduce((sum, t) => sum + (t.dlspeed || 0), 0)
  )
  const totalUploadSpeed = computed(() =>
    torrents.value.reduce((sum, t) => sum + (t.upspeed || 0), 0)
  )
  const totalDownloaded = computed(() =>
    torrents.value.reduce((sum, t) => sum + (t.downloaded || 0), 0)
  )
  const totalUploaded = computed(() =>
    torrents.value.reduce((sum, t) => sum + (t.uploaded || 0), 0)
  )

  const torrentsMap = computed(() => {
    const map = {}
    torrents.value.forEach(t => {
      map[t.hash] = t
    })
    return map
  })

  // Actions
  async function fetchTorrents() {
    isLoading.value = true
    error.value = null
    try {
      const data = await qbittorrentAPI.getTorrents()
      torrents.value = data
      lastUpdate.value = new Date()
    } catch (err) {
      error.value = err.message
      console.error('Failed to fetch torrents:', err)
    } finally {
      isLoading.value = false
    }
  }

  async function fetchTransferInfo() {
    try {
      transferInfo.value = await qbittorrentAPI.getTransferInfo()
    } catch (err) {
      console.error('Failed to fetch transfer info:', err)
    }
  }
  function refreshServerState(server) {
    if (!server) {
      console.warn('refreshServerState: Invalid server object')
      return
    }

    // List of all possible server state fields from qBittorrent API
    const serverStateFields = [
      'dl_info_speed', 'dl_info_data', 'up_info_speed', 'up_info_data',
      'dl_rate_limit', 'up_rate_limit', 'dht_nodes', 'connection_status',
      'queueing', 'use_alt_speed_limits', 'refresh_interval'
    ]

    // Only update fields that exist in the input server object
    const updatedState = { ...serverState.value }
    serverStateFields.forEach(field => {
      if (field in server) {
        updatedState[field] = server[field]
      }
    })

    serverState.value = updatedState
  }
  async function fetchServerState() {
    try {
      serverState.value = await qbittorrentAPI.getServerState()
      isConnected.value = serverState.value.connected
    } catch (err) {
      console.error('Failed to fetch server state:', err)
      isConnected.value = false
    }
  }

  async function fetchCategories() {
    try {
      categories.value = await qbittorrentAPI.getCategories()
    } catch (err) {
      console.error('Failed to fetch categories:', err)
    }
  }
  function deleteCategory(category) {
    categories.value = categories.value.filter(c => c.name !== category.name)
  }


  function refreshCategories(category) {
    const index = categories.value.findIndex(c => c.name === category.name)
    if (index !== -1) {
      categories.value[index] = category
    } else {
      categories.value.push(category)
    }
  }



  async function fetchTags() {
    try {
      tags.value = await qbittorrentAPI.getTags()
    } catch (err) {
      console.error('Failed to fetch tags:', err)
    }
  }

  async function fetchPreferences() {
    try {
      preferences.value = await qbittorrentAPI.getPreferences()
    } catch (err) {
      console.error('Failed to fetch preferences:', err)
    }
  }

  async function addTorrent(url, options = {}) {
    try {
      const success = await qbittorrentAPI.addTorrent(url, options)
      if (success) {
        await fetchTorrents()
        notificationStore.success('添加成功', '种子已添加到下载队列')
      } else {
        notificationStore.error('添加失败', '无法添加种子，请检查URL')
      }
      return success
    } catch (err) {
      console.error('Failed to add torrent:', err)
      notificationStore.error('添加失败', err.message || '添加种子时发生错误')
      return false
    }
  }

  async function pauseTorrent(hash) {
    try {
      const success = await qbittorrentAPI.pauseTorrent(hash)
      if (success) {
        await fetchTorrents()
        notificationStore.success('已暂停', '种子已暂停下载')
      } else {
        notificationStore.error('暂停失败', '无法暂停种子')
      }
      return success
    } catch (err) {
      console.error('Failed to pause torrent:', err)
      notificationStore.error('暂停失败', err.message || '暂停种子时发生错误')
      return false
    }
  }

  async function resumeTorrent(hash) {
    try {
      const success = await qbittorrentAPI.resumeTorrent(hash)
      if (success) {
        await fetchTorrents()
        notificationStore.success('已恢复', '种子已恢复下载')
      } else {
        notificationStore.error('恢复失败', '无法恢复种子')
      }
      return success
    } catch (err) {
      console.error('Failed to resume torrent:', err)
      notificationStore.error('恢复失败', err.message || '恢复种子时发生错误')
      return false
    }
  }

  async function deleteTorrent(hash, deleteFiles = false) {
    try {
      const success = await qbittorrentAPI.deleteTorrent(hash, deleteFiles)
      if (success) {
        await fetchTorrents()
        notificationStore.success('已删除', deleteFiles ? '种子及文件已删除' : '种子已删除')
      } else {
        notificationStore.error('删除失败', '无法删除种子')
      }
      return success
    } catch (err) {
      console.error('Failed to delete torrent:', err)
      notificationStore.error('删除失败', err.message || '删除种子时发生错误')
      return false
    }
  }

  function removeTorrent(hash) {
    const index = torrents.value.findIndex(t => t.hash === hash)
    if (index !== -1) {
      torrents.value.splice(index, 1)
    }
  }



  async function setGlobalSpeedLimits(limits) {
    try {
      const success = await qbittorrentAPI.setGlobalSpeedLimits(limits)
      if (success) {
        await fetchTransferInfo()
        notificationStore.success('速度限制已更新', '全局速度限制已应用')
      } else {
        notificationStore.error('更新失败', '无法更新速度限制')
      }
      return success
    } catch (err) {
      console.error('Failed to set speed limits:', err)
      notificationStore.error('更新失败', err.message || '设置速度限制时发生错误')
      return false
    }
  }

  async function updatePreferences(newPrefs) {
    try {
      const success = await qbittorrentAPI.setPreferences(newPrefs)
      if (success) {
        await fetchPreferences()
        notificationStore.success('设置已保存', '偏好设置已更新')
      } else {
        notificationStore.error('保存失败', '无法保存设置')
      }
      return success
    } catch (err) {
      console.error('Failed to update preferences:', err)
      notificationStore.error('保存失败', err.message || '保存设置时发生错误')
      return false
    }
  }

  function setTorrents(torrentsArray) {
    torrents.value = torrentsArray
  }

  function refreshTorrent(torrent) {
    if (!torrent || !torrent.hash) {
      console.warn('refreshTorrent: Invalid torrent object or missing hash')
      return
    }

    const index = torrents.value.findIndex(t => t.infohash_v1 === torrent.hash)

    if (index !== -1) {
      // Update existing torrent - only update fields that are present in the input
      const existingTorrent = torrents.value[index]
      const updatedTorrent = { ...existingTorrent }

      // List of all possible torrent fields from qBittorrent API
      const torrentFields = [
        'added_on', 'amount_left', 'auto_tmm', 'availability', 'category',
        'completed', 'completion_on', 'content_path', 'dl_limit', 'dlspeed',
        'downloaded', 'downloaded_session', 'eta', 'f_l_piece_prio', 'force_start',
        'last_activity', 'magnet_uri', 'max_ratio', 'max_seeding_time', 'name',
        'num_complete', 'num_incomplete', 'num_leechs', 'num_seeds', 'priority',
        'progress', 'ratio', 'ratio_limit', 'reannounce', 'save_path',
        'seeding_time', 'seeding_time_limit', 'seen_complete', 'seq_dl', 'size',
        'state', 'super_seeding', 'tags', 'time_active', 'total_size', 'tracker',
        'up_limit', 'uploaded', 'uploaded_session', 'upspeed', 'isPrivate'
      ]

      // Only update fields that exist in the input torrent object
      torrentFields.forEach(field => {
        if (field in torrent) {
          updatedTorrent[field] = torrent[field]
        }
      })

      torrents.value[index] = updatedTorrent
    } else {
      // Add new torrent if it doesn't exist
      torrents.value.push(torrent)
    }
  }

  function setServerState(state) {
    serverState.value = { ...serverState.value, ...state }
  }

  return {
    // State
    torrents,
    transferInfo,
    serverState,
    categories,
    tags,
    preferences,
    isLoading,
    error,
    lastUpdate,
    isConnected,
    // Getters
    totalTorrents,
    downloadingCount,
    uploadingCount,
    completedCount,
    pausedCount,
    errorCount,
    totalDownloadSpeed,
    totalUploadSpeed,
    totalDownloaded,
    totalUploaded,
    torrentsMap,
    // Actions
    fetchTorrents,
    fetchTransferInfo,
    fetchServerState,
    fetchCategories,
    fetchTags,
    fetchPreferences,
    addTorrent,
    pauseTorrent,
    resumeTorrent,
    deleteTorrent,
    removeTorrent,
    setGlobalSpeedLimits,
    updatePreferences,
    setTorrents,
    setServerState,
    refreshTorrent,
    refreshServerState,
    refreshCategories,
    deleteCategory
  }
})
