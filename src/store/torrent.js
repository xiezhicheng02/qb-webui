import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import qbittorrentAPI from '@/api/qbittorrent'
import { useNotificationStore } from './notification'

export const useTorrentStore = defineStore('torrent', () => {
  const notificationStore = useNotificationStore()
  // 导入 API 实例
  const api = qbittorrentAPI
  
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
  
  // 批量操作与 UI 状态
  const selectedTorrents = ref([])
  const sortConfig = ref({ column: 'added_on', order: 'descending' })
  const filterConfig = ref({
    search: '',
    status: 'all',
    category: 'all',
    tags: []
  })

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
      // 使用 infohash_v1 作为主键，如果不存在则使用 hash
      const key = t.infohash_v1 || t.hash
      map[key] = t
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
      const rawCategories = await qbittorrentAPI.getCategories()
      // 将原始对象转换为数组格式以便显示
      categories.value = Object.keys(rawCategories).map(name => ({
        name: name,
        savePath: rawCategories[name]?.savePath || ''
      }))
    } catch (err) {
      console.error('Failed to fetch categories:', err)
    }
  }

  // 添加分类
  async function addCategory(name, savePath = '') {
    try {
      const success = await qbittorrentAPI.addCategory(name, savePath)
      if (success) {
        await fetchCategories() // 重新获取分类列表
        notificationStore.success('分类创建成功', `已创建分类: ${name}`)
      } else {
        notificationStore.error('分类创建失败', '无法创建分类')
      }
      return success
    } catch (err) {
      console.error('Failed to add category:', err)
      notificationStore.error('分类创建失败', err.message || '创建分类时发生错误')
      return false
    }
  }

  // 设置分类到种子
  async function setTorrentsCategory(hashes, category) {
    try {
      const success = await qbittorrentAPI.setTorrentCategory(hashes, category)
      if (success) {
        await fetchTorrents() // 重新获取种子列表
        notificationStore.success('分类设置成功', `已为 ${hashes.length} 个种子设置分类`)
      } else {
        notificationStore.error('分类设置失败', '无法设置分类')
      }
      return success
    } catch (err) {
      console.error('Failed to set category:', err)
      notificationStore.error('分类设置失败', err.message || '设置分类时发生错误')
      return false
    }
  }

  // 删除分类
  async function removeCategoryByName(name) {
    try {
      const success = await qbittorrentAPI.removeCategory(name)
      if (success) {
        await fetchCategories() // 重新获取分类列表
        notificationStore.success('分类删除成功', `已删除分类: ${name}`)
      } else {
        notificationStore.error('分类删除失败', '无法删除分类')
      }
      return success
    } catch (err) {
      console.error('Failed to remove category:', err)
      notificationStore.error('分类删除失败', err.message || '删除分类时发生错误')
      return false
    }
  }

  // 编辑分类 (保存路径)
  async function editCategory(name, savePath = '') {
    try {
      const success = await qbittorrentAPI.editCategory(name, savePath)
      if (success) {
        await fetchCategories() // 重新获取分类列表
        notificationStore.success('分类编辑成功', `已编辑分类: ${name}`)
      } else {
        notificationStore.error('分类编辑失败', '无法编辑分类')
      }
      return success
    } catch (err) {
      console.error('Failed to edit category:', err)
      notificationStore.error('分类编辑失败', err.message || '编辑分类时发生错误')
      return false
    }
  }
  
  // 重命名分类 (通过删除旧分类并创建新分类实现)
  async function renameCategory(oldName, newName, savePath = '') {
    try {
      // 先删除旧分类
      const deleteSuccess = await qbittorrentAPI.removeCategory(oldName)
      if (!deleteSuccess) {
        throw new Error('无法删除旧分类')
      }
      
      // 再创建新分类
      const addSuccess = await qbittorrentAPI.addCategory(newName, savePath)
      if (!addSuccess) {
        // 如果创建失败，尝试恢复回原来的分类
        await qbittorrentAPI.addCategory(oldName, savePath)
        throw new Error('无法创建新分类')
      }
      
      await fetchCategories() // 重新获取分类列表
      notificationStore.success('分类重命名成功', `已将分类 "${oldName}" 重命名为 "${newName}"`)
      return true
    } catch (err) {
      console.error('Failed to rename category:', err)
      notificationStore.error('分类重命名失败', err.message || '重命名分类时发生错误')
      return false
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

  // 添加标签
  async function addTag(name) {
    try {
      const success = await qbittorrentAPI.addTag(name)
      if (success) {
        await fetchTags() // 重新获取标签列表
        notificationStore.success('标签创建成功', `已创建标签：${name}`)
      } else {
        notificationStore.error('标签创建失败', '无法创建标签')
      }
      return success
    } catch (err) {
      console.error('Failed to add tag:', err)
      notificationStore.error('标签创建失败', err.message || '创建标签时发生错误')
      return false
    }
  }

  // 删除标签
  async function removeTag(name) {
    try {
      const success = await qbittorrentAPI.removeTag(name)
      if (success) {
        await fetchTags() // 重新获取标签列表
        notificationStore.success('标签删除成功', `已删除标签：${name}`)
      } else {
        notificationStore.error('标签删除失败', '无法删除标签')
      }
      return success
    } catch (err) {
      console.error('Failed to remove tag:', err)
      notificationStore.error('标签删除失败', err.message || '删除标签时发生错误')
      return false
    }
  }

  // 批量删除种子标签
  async function batchRemoveTags(hashes, tags) {
    try {
      const success = await qbittorrentAPI.removeTags(hashes, tags)
      if (success) {
        await fetchTorrents() // 重新获取种子列表
        notificationStore.success('标签删除成功', `已为 ${hashes.length} 个种子删除标签`)
      } else {
        notificationStore.error('标签删除失败', '无法删除标签')
      }
      return success
    } catch (err) {
      console.error('Failed to batch remove tags:', err)
      notificationStore.error('标签删除失败', err.message || '删除标签时发生错误')
      return false
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

  async function addTorrentFromFile(file, options = {}) {
    try {
      const success = await qbittorrentAPI.addTorrentFromFile(file, options)
      if (success) {
        await fetchTorrents()
        notificationStore.success('添加成功', '种子已添加到下载队列')
      } else {
        notificationStore.error('添加失败', '无法添加种子文件')
      }
      return success
    } catch (err) {
      console.error('Failed to add torrent from file:', err)
      notificationStore.error('添加失败', err.message || '添加种子文件时发生错误')
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

    // 尝试使用 infohash_v1 或 hash 字段匹配
    const index = torrents.value.findIndex(t => 
      t.infohash_v1 === torrent.hash || 
      t.infohash_v1 === torrent.infohash_v1 ||
      t.hash === torrent.hash
    )

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
        'up_limit', 'uploaded', 'uploaded_session', 'upspeed', 'isPrivate',
        'infohash_v1', 'hash'
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

  function setCategories(categoryList) {
    categories.value = categoryList
  }

  // 批量操作 Actions
  async function batchPauseTorrents(hashes) {
    try {
      const success = await qbittorrentAPI.pauseTorrents(hashes)
      if (success) {
        await fetchTorrents()
        notificationStore.success('批量暂停成功', `已暂停 ${hashes.length} 个任务`)
      } else {
        notificationStore.error('批量暂停失败', '无法暂停选中的任务')
      }
      return success
    } catch (err) {
      console.error('Failed to batch pause torrents:', err)
      notificationStore.error('批量暂停失败', err.message)
      return false
    }
  }

  async function batchResumeTorrents(hashes) {
    try {
      const success = await qbittorrentAPI.resumeTorrents(hashes)
      if (success) {
        await fetchTorrents()
        notificationStore.success('批量恢复成功', `已恢复 ${hashes.length} 个任务`)
      } else {
        notificationStore.error('批量恢复失败', '无法恢复选中的任务')
      }
      return success
    } catch (err) {
      console.error('Failed to batch resume torrents:', err)
      notificationStore.error('批量恢复失败', err.message)
      return false
    }
  }

  async function batchDeleteTorrents(hashes, deleteFiles = false) {
    try {
      const success = await qbittorrentAPI.deleteTorrents(hashes, deleteFiles)
      if (success) {
        await fetchTorrents()
        selectedTorrents.value = []
        notificationStore.success('批量删除成功', `已删除 ${hashes.length} 个任务`)
      } else {
        notificationStore.error('批量删除失败', '无法删除选中的任务')
      }
      return success
    } catch (err) {
      console.error('Failed to batch delete torrents:', err)
      notificationStore.error('批量删除失败', err.message)
      return false
    }
  }

  async function batchSetCategory(hashes, category) {
    try {
      const success = await qbittorrentAPI.setCategory(hashes, category)
      if (success) {
        await fetchTorrents()
        notificationStore.success('分类设置成功', `已为 ${hashes.length} 个任务设置分类`)
      } else {
        notificationStore.error('分类设置失败', '无法设置分类')
      }
      return success
    } catch (err) {
      console.error('Failed to batch set category:', err)
      notificationStore.error('分类设置失败', err.message)
      return false
    }
  }

  async function batchAddTags(hashes, tags) {
    try {
      const success = await qbittorrentAPI.addTags(hashes, tags)
      if (success) {
        await fetchTorrents()
        notificationStore.success('标签添加成功', `已为 ${hashes.length} 个任务添加标签`)
      } else {
        notificationStore.error('标签添加失败', '无法添加标签')
      }
      return success
    } catch (err) {
      console.error('Failed to batch add tags:', err)
      notificationStore.error('标签添加失败', err.message)
      return false
    }
  }

  // 任务限速功能
  async function setTorrentDownloadLimit(hash, limit) {
    try {
      const success = await qbittorrentAPI.setTorrentDownloadLimit(hash, limit)
      if (success) {
        await fetchTorrents()
        notificationStore.success('下载限速设置成功', `限速已设置为 ${limit === -1 ? '无限制' : formatSpeed(limit)}/s`)
      } else {
        notificationStore.error('下载限速设置失败', '无法设置下载限速')
      }
      return success
    } catch (err) {
      console.error('Failed to set torrent download limit:', err)
      notificationStore.error('下载限速设置失败', err.message || '设置下载限速时发生错误')
      return false
    }
  }

  async function setTorrentUploadLimit(hash, limit) {
    try {
      const success = await qbittorrentAPI.setTorrentUploadLimit(hash, limit)
      if (success) {
        await fetchTorrents()
        notificationStore.success('上传限速设置成功', `限速已设置为 ${limit === -1 ? '无限制' : formatSpeed(limit)}/s`)
      } else {
        notificationStore.error('上传限速设置失败', '无法设置上传限速')
      }
      return success
    } catch (err) {
      console.error('Failed to set torrent upload limit:', err)
      notificationStore.error('上传限速设置失败', err.message || '设置上传限速时发生错误')
      return false
    }
  }

  async function getTorrentDownloadLimit(hash) {
    try {
      return await qbittorrentAPI.getTorrentDownloadLimit(hash)
    } catch (err) {
      console.error('Failed to get torrent download limit:', err)
      return -1
    }
  }

  async function getTorrentUploadLimit(hash) {
    try {
      return await qbittorrentAPI.getTorrentUploadLimit(hash)
    } catch (err) {
      console.error('Failed to get torrent upload limit:', err)
      return -1
    }
  }

  // 优先级设置功能
  async function setTorrentPriority(hash, priority) {
    try {
      const success = await qbittorrentAPI.setTorrentPriority(hash, priority)
      if (success) {
        await fetchTorrents()
        const priorityText = {
          0: '最大',
          1: '高',
          2: '普通',
          3: '低'
        }[priority] || '普通'
        
        notificationStore.success('优先级设置成功', `优先级已设为 ${priorityText}`)
      } else {
        notificationStore.error('优先级设置失败', '无法设置优先级')
      }
      return success
    } catch (err) {
      console.error('Failed to set priority:', err)
      notificationStore.error('优先级设置失败', err.message || '设置优先级时发生错误')
      return false
    }
  }

  // UI 状态管理
  function setSelectedTorrents(hashes) {
    selectedTorrents.value = hashes
  }

  function toggleSelectTorrent(hash) {
    const index = selectedTorrents.value.indexOf(hash)
    if (index === -1) {
      selectedTorrents.value.push(hash)
    } else {
      selectedTorrents.value.splice(index, 1)
    }
  }

  function clearSelection() {
    selectedTorrents.value = []
  }

  function setSortConfig(config) {
    sortConfig.value = config
  }

  function setFilterConfig(config) {
    filterConfig.value = { ...filterConfig.value, ...config }
  }

  function clearFilters() {
    filterConfig.value = {
      search: '',
      status: 'all',
      category: 'all',
      tags: []
    }
  }

  // Helper functions
  function formatSpeed(bytes) {
    if (bytes === -1) return '无限制'
    if (bytes === 0) return '0 B/s'
    if (bytes < 1024) return bytes + ' B/s'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB/s'
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB/s'
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB/s'
  }

     return {
  // API Instance
  api,
  // API Methods
  getTorrentProperties: (hash) => api.getTorrentProperties(hash),
  getTorrentTrackers: (hash) => api.getTorrentTrackers(hash),
  getTorrentWebSeeds: (hash) => api.getTorrentWebSeeds(hash),
  getTorrentPieceStates: (hash) => api.getTorrentPieceStates(hash),
  getTorrentPieces: (hash) => api.getTorrentPieces(hash),
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
    addTorrent,
    addTorrentFromFile,
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
    deleteCategory,
    // Category management
    addCategory,
    editCategory,
    removeCategoryByName,
    setTorrentsCategory,
    // Tag management
    addTag,
    removeTag,
    batchRemoveTags,
    // 限速功能
    setTorrentDownloadLimit,
    setTorrentUploadLimit,
    getTorrentDownloadLimit,
    getTorrentUploadLimit,
    // 优先级设置
    setTorrentPriority,
    // 批量操作
    batchPauseTorrents,
    batchResumeTorrents,
    batchDeleteTorrents,
    batchSetCategory,
    batchAddTags,
    // UI 状态
    selectedTorrents,
    sortConfig,
    filterConfig,
    setSelectedTorrents,
    toggleSelectTorrent,
    clearSelection,
    setSortConfig,
    setFilterConfig,
    clearFilters,
    // Preferences
    fetchPreferences,
    // Helper functions
    formatSpeed
  }
})
