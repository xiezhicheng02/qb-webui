<template>
  <div class="p-3 bg-gradient-to-b from-[var(--bg-light)] to-[var(--bg-light-secondary)] h-full flex flex-col gap-3 relative overflow-hidden">
    <!-- Radial background -->
    <div class="absolute top-0 left-0 right-0 bottom-0 bg-[radial-gradient(ellipse_at_30%_20%,_rgba(2,132,199,0.05)_0%,_transparent_40%)] pointer-events-none"></div>
    
   

    <!-- 任务卡片列表区域 -->
    <div class="flex flex-col gap-3 overflow-y-auto p-1">
      <div
        v-for="torrent in sortedAndFilteredTorrents"
        :key="torrent.hash"
        class="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[var(--border-radius-md)] p-3 transition-all duration-200 shadow-sm min-h-[110px] cursor-pointer"
        :class="{ 'border-[var(--accent-cyan)] bg-gradient-to-br from-[var(--bg-hover)] to-[var(--bg-card)] shadow-[0_4px_12px_rgba(2,132,199,0.15),_0_0_0_2px_var(--accent-cyan)]': isSelected(torrent.hash) }"
        @click="handleCardClick(torrent)"
        @contextmenu="handleCardContextMenu($event, torrent)"
      >
        <!-- 卡片主体 -->
        <div class="flex flex-col gap-1.5">
          <!-- 第一行：分类 + 名称 + 状态徽章 + 操作按钮 -->
          <div class="flex justify-between items-center flex-nowrap min-h-[18px]">
            <div v-if="torrent.category" class="py-0.5 px-2 rounded-full text-xs font-semibold bg-[rgba(167,139,250,0.15)] text-[var(--accent-purple)] border border-[rgba(167,139,250,0.3)] flex-shrink-0 text-uppercase tracking-[0.5px] align-center">
              {{ torrent.category }}
            </div>
            
            <div class="flex items-center gap-2 flex-1 min-w-0">
              <div class="font-medium text-[var(--text-primary)] text-sm whitespace-nowrap overflow-hidden text-ellipsis min-w-0" :title="torrent.name">{{ torrent.name }}</div>
              
              <!-- 任务状态徽章 - 只显示非排队状态 -->
              <div v-if="!isQueuedStatus(torrent.status)" 
                   :class="[
                     'py-0.5 px-2 rounded-full text-xs font-semibold flex-shrink-0',
                     getStatusType(torrent.status) === 'primary' ? 'bg-[rgba(2,132,199,0.15)] text-[var(--accent-cyan)] border border-[rgba(2,132,199,0.3)]' :
                     getStatusType(torrent.status) === 'success' ? 'bg-[rgba(16,185,129,0.15)] text-[var(--status-success)] border border-[rgba(16,185,129,0.3)]' :
                     getStatusType(torrent.status) === 'warning' ? 'bg-[rgba(245,158,11,0.15)] text-[var(--status-warning)] border border-[rgba(245,158,11,0.3)]' :
                     getStatusType(torrent.status) === 'danger' ? 'bg-[rgba(239,68,68,0.15)] text-[var(--status-error)] border border-[rgba(239,68,68,0.3)]' :
                     getStatusType(torrent.status) === 'info' ? 'bg-[rgba(59,130,246,0.15)] text-[var(--status-info)] border border-[rgba(59,130,246,0.3)]' : 
                     'bg-[rgba(59,130,246,0.15)] text-[var(--status-info)] border border-[rgba(59,130,246,0.3)]'
                   ]">
                {{ torrent.status }}
              </div>
              
              <!-- 排队状态标签（如排队中、检查中）- 只显示排队状态 -->
              <div v-if="isQueuedStatus(torrent.status)" class="py-0.5 px-2 rounded-full text-xs font-semibold bg-[rgba(245,158,11,0.15)] text-[var(--status-warning)] border border-[rgba(245,158,11,0.3)] flex-shrink-0 text-uppercase">
                {{ torrent.status }}
              </div>
            </div>
            

          </div>

          <!-- 第二行：信息 + 状态 -->
          <div class="flex flex-wrap items-center gap-2.5 min-h-[18px]">
            <div class="flex items-center gap-0.5 whitespace-nowrap">
              <span class="text-xs text-[var(--text-muted)] font-medium">大小:</span>
              <span class="text-xs text-[var(--text-secondary)] font-mono">{{ formatSize(torrent.size) }}</span>
            </div>
            <div class="flex items-center gap-0.5 whitespace-nowrap">
              <span class="text-xs text-[var(--text-muted)] font-medium">下载:</span>
              <span :class="['text-xs text-[var(--text-secondary)] font-mono', { 'text-[var(--speed-download)] font-semibold': torrent.downloadSpeed > 0 }]">
                {{ formatSpeed(torrent.downloadSpeed) }}
              </span>
            </div>
            <div class="flex items-center gap-0.5 whitespace-nowrap">
              <span class="text-xs text-[var(--text-muted)] font-medium">上传:</span>
              <span :class="['text-xs text-[var(--text-secondary)] font-mono', { 'text-[var(--speed-upload)] font-semibold': torrent.uploadSpeed > 0 }]">
                {{ formatSpeed(torrent.uploadSpeed) }}
              </span>
            </div>
            <div class="flex items-center gap-0.5 whitespace-nowrap">
              <span class="text-xs text-[var(--text-muted)] font-medium">加入:</span>
              <span class="text-xs text-[var(--text-secondary)] font-mono">{{ formatRelativeTime(torrent.added_on) }}</span>
            </div>
            
            <!-- 标签容器 -->
            <div class="flex flex-wrap gap-1 min-w-0" v-if="torrent.tags">
              <span 
                v-for="tag in torrent.tags.split(',').filter(t => t.trim())" 
                :key="tag"
                class="py-0.5 px-1.5 rounded-full text-[9px] font-medium text-center border cursor-pointer transition-all duration-150 whitespace-nowrap"
                :style="getTagStyle(tag.trim())"
                @click="filterByTag(tag.trim())">
                {{ tag.trim() }}
              </span>
            </div>
            
            <!-- 仅在下载中显示预估剩余时间 -->
            <div v-if="torrent.status === '下载中'" class="flex items-center gap-0.5 whitespace-nowrap">
              <span class="text-xs text-[var(--text-muted)] font-medium">剩余:</span>
              <span class="text-xs text-[var(--status-warning)] font-mono font-semibold">{{ calculateETA(torrent) }}</span>
            </div>
          </div>
          
          <!-- 第三行：进度条 -->
          <div class="flex items-center gap-2 flex-1">
        <div class="flex-1 h-2 bg-[var(--bg-hover)] rounded-[2px] overflow-hidden relative shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]">
          <div
            class="h-full transition-[width] duration-700 ease-out relative overflow-hidden"
            :class="getProgressClass(torrent.progress, torrent.status)"
            :style="{ width: (torrent.progress || 0) + '%' }"
          >
            <div 
              v-if="torrent.status !== '已完成'"
              class="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shine"
              :style="{ animationDelay: Math.random() * 2 + 's' }"
            ></div>
          </div>
        </div>
            <span class="font-mono text-xs text-[var(--text-secondary)] font-semibold min-w-[38px] text-right">{{ torrent.progress || 0 }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 右键菜单 -->
    <ContextMenu
      :visible="contextMenu.visible"
      :x="contextMenu.x"
      :y="contextMenu.y"
      :torrent="contextMenu.torrent"
      :selected-torrents="selectedTorrents"
      @close="closeContextMenu"
      @action="handleContextMenuAction"
      @tags-updated="handleTagsUpdated"
    />

    <!-- 任务详情抽屉 -->
    <TaskDetailsDrawer
      :visible="showTaskDetailsDrawer"
      :torrent="selectedTorrentForDetails"
      @update:visible="showTaskDetailsDrawer = $event"
      @close="showTaskDetailsDrawer = false"
    />

    <!-- 分类选择对话框 -->
    <CategorySelector
      v-model="selectedCategory"
      :visible="showCategoryDialog"
      @update:visible="showCategoryDialog = $event"
      @confirm="handleCategoryConfirm"
      @cancel="showCategoryDialog = false"
    />

    <!-- 标签添加对话框 -->
    <el-dialog v-model="showTagDialog" title="添加标签" width="400px">
      <el-input
        v-model="tagsInput"
        placeholder="输入标签，多个标签用逗号分隔"
        type="textarea"
        :rows="3"
      />
      <template #footer>
        <el-button @click="showTagDialog = false">取消</el-button>
        <el-button type="primary" @click="applyTags">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useTorrentStore } from '@/store/torrent'
import { ElMessage, ElMessageBox, ElInput, ElSlider, ElSelect, ElOption, ElDivider, ElDropdown, ElDropdownMenu, ElDropdownItem } from 'element-plus'
import ContextMenu from '@/components/ContextMenu.vue'
import CategorySelector from '@/components/CategorySelector.vue'
import TaskDetailsDrawer from '@/components/TaskDetailsDrawer.vue'
import qbittorrentAPI from '@/api/qbittorrent'

const route = useRoute()
const torrentStore = useTorrentStore()

// 状态
const filterType = ref('all')
const searchQuery = ref('')
const statusFilter = ref('all')
const categoryFilter = ref('all')
const tagFilter = ref('')

// 排序
const sortConfig = ref({ column: 'added_on', order: 'descending' })

// 右键菜单
const contextMenu = ref({
  visible: false,
  x: 0,
  y: 0,
  torrent: null
})

// 对话框
const showCategoryDialog = ref(false)
const showTagDialog = ref(false)
const selectedCategory = ref('')
const tagsInput = ref('')

// Task details drawer
const showTaskDetailsDrawer = ref(false)
const selectedTorrentForDetails = ref(null)

// 分类和标签
const categories = computed(() => torrentStore.categories)
const selectedTorrents = computed(() => torrentStore.selectedTorrents)

// 计算选中状态
const isSelected = (hash) => selectedTorrents.value.includes(hash)

// 处理复选框选择
const toggleSelection = (hash, checked) => {
  if (checked) {
    torrentStore.toggleSelectTorrent(hash)
  } else {
    // 手动移除选择
    const newSelection = selectedTorrents.value.filter(h => h !== hash)
    torrentStore.setSelectedTorrents(newSelection)
  }
}

// Polling callback
const handleMainData = (data) => {
  if (data.full_update) {
    if (data.torrents) {
      torrentStore.setTorrents(Object.values(data.torrents))
    } else {
      torrentStore.setTorrents([])
    }
    if (data.server_state) {
      torrentStore.setServerState(data.server_state)
    }
  } else {
    if (data.torrents) {
      Object.keys(data.torrents).forEach(hash => {
        let torrent = data.torrents[hash]
        torrent["hash"] = hash
        torrentStore.refreshTorrent(torrent)
      })
    }
    if (data.torrents_removed) {
      data.torrents_removed.forEach(hash => {
        torrentStore.removeTorrent(hash)
      })
    }
    if (data.categories) {
      // 同步分类数据
      const categoryList = []
      Object.keys(data.categories).forEach(name => {
        const category = data.categories[name]
        categoryList.push({ 
          name: name, 
          savePath: category.savePath || '' 
        })
      })
      torrentStore.setCategories(categoryList)
    }
    if (data.categories_removed) {
      data.categories_removed.forEach(name => {
        torrentStore.deleteCategory({ name })
      })
    }
    if (data.server_state) {
      torrentStore.refreshServerState(data.server_state)
    }
  }
}

// 转换种子数据格式
const torrents = computed(() => {
  return torrentStore.torrents.map(t => {
    // 使用 infohash_v1 作为主哈希，如果不存在则回退到 hash 字段
    const mainHash = t.infohash_v1 || t.hash
    const checked = selectedTorrents.value.includes(mainHash)
    // 确保 progress 是有效数字 (0-100 之间)
    let progress = 0
    if (t.progress !== undefined && t.progress !== null) {
      progress = Math.round(t.progress * 100)
      // 限制在 0-100 范围内
      progress = Math.max(0, Math.min(100, progress))
    }
    return {
      id: mainHash,
      name: t.name,
      size: t.size,
      progress: progress,
      downloadSpeed: t.dlspeed || 0,
      uploadSpeed: t.upspeed || 0,
      status: getStatusText(t.state),
      hash: mainHash,
      infohash_v1: t.infohash_v1,  // 保留原始 infohash_v1 字段
      original_hash: t.hash,       // 保留原始 hash 字段
      category: t.category || '',
      tags: t.tags || '',
      save_path: t.save_path || '',
      added_on: t.added_on || 0,
      checked: checked
    }
  })
})

// 排序和筛选后的种子列表
const sortedAndFilteredTorrents = computed(() => {
  let result = torrents.value

  // 路由过滤
  if (filterType.value !== 'all') {
    if (filterType.value === 'downloading') {
      result = result.filter(t => t.status === '下载中')
    } else if (filterType.value === 'completed') {
      result = result.filter(t => t.progress === 100)
    } else if (filterType.value === 'paused') {
      result = result.filter(t => t.status === '已暂停')
    } else if (filterType.value === 'seeding') {
      result = result.filter(t => t.status === '做种中' || t.status === '上传中')
    }
  }

  // 搜索过滤
  if (searchQuery.value) {
    result = result.filter(t => t.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
  }

  // 状态过滤
  if (statusFilter.value !== 'all') {
    if (statusFilter.value === 'downloading') {
      result = result.filter(t => t.status === '下载中')
    } else if (statusFilter.value === 'completed') {
      result = result.filter(t => t.progress === 100)
    } else if (statusFilter.value === 'paused') {
      result = result.filter(t => t.status === '已暂停')
    } else if (statusFilter.value === 'seeding') {
      result = result.filter(t => t.status === '做种中' || t.status === '上传中')
    }
  }

  // 分类过滤
  if (categoryFilter.value !== 'all' && categoryFilter.value) {
    result = result.filter(t => t.category === categoryFilter.value)
  }

  // 标签过滤
  if (tagFilter.value) {
    result = result.filter(t => t.tags && t.tags.split(',').map(t => t.trim()).includes(tagFilter.value))
  }

  // 排序
  const { column, order } = sortConfig.value
  if (column && order) {
    result = [...result].sort((a, b) => {
      let aVal = a[column]
      let bVal = b[column]
      
      // 特殊处理
      if (column === 'category') {
        aVal = aVal || ''
        bVal = bVal || ''
      }
      if (column === 'tags') {
        aVal = aVal || ''
        bVal = bVal || ''
      }
      if (column === 'save_path') {
        aVal = aVal || ''
        bVal = bVal || ''
      }
      
      if (order === 'ascending') {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })
  }

  return result
})

// 格式化函数
const formatSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB'
}

const formatSpeed = (bytes) => {
  if (bytes === 0) return '0 B/s'
  if (bytes < 1024) return bytes + ' B/s'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB/s'
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB/s'
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB/s'
}

const formatRelativeTime = (timestamp) => {
  if (!timestamp) return '—'
  const date = new Date(timestamp * 1000)
  const now = new Date()
  const diff = now - date
  const diffInSeconds = Math.floor(diff / 1000)
  const diffInMinutes = Math.floor(diff / (1000 * 60))
  const diffInHours = Math.floor(diff / (1000 * 60 * 60))
  const diffInDays = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (diffInMinutes < 1) {
    return '刚刚'
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}分钟前`
  } else if (diffInHours < 24) {
    return `${diffInHours}小时前`
  } else if (diffInDays < 7) {
    return `${diffInDays}天前`
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7)
    return `${weeks}周前`
  } else {
    return date.toLocaleDateString('zh-CN')
  }
}

const calculateETA = (torrent) => {
  if (torrent.status !== '下载中' || torrent.downloadSpeed <= 0) {
    return '∞'
  }
  
  const remainingBytes = torrent.size * (1 - torrent.progress / 100)
  const etaSeconds = remainingBytes / torrent.downloadSpeed
  
  if (etaSeconds < 0) return '∞'
  if (etaSeconds < 60) return '< 1分钟'
  if (etaSeconds < 3600) return Math.floor(etaSeconds / 60) + '分钟'
  if (etaSeconds < 86400) return Math.floor(etaSeconds / 3600) + '小时'
  
  return Math.floor(etaSeconds / 86400) + '天'
}

const isQueuedStatus = (status) => {
  return status === '排队中' || status === '检查中' || status === '强制上传' || status === '强制下载'
}

const getProgressClass = (progress, status) => {
  if (status === '已完成' || progress === 100) return 'bg-gradient-to-r from-[var(--status-success)] to-[#6ee7b7]'  // 浅绿色
  if (status === '下载中') return 'bg-gradient-to-r from-[#0ea5e9] to-[var(--speed-download)]'  // 深浅蓝色
  if (status === '做种中' || status === '上传中') return 'bg-gradient-to-r from-[var(--status-info)] to-[#7dd3fc]'  // 浅蓝色
  if (status === '已暂停') return 'bg-gradient-to-r from-[var(--text-muted)] to-[var(--text-secondary)]'  // 灰色
  if (status === '排队中') return 'bg-gradient-to-r from-[var(--status-warning)] to-[#fcd34d]'  // 浅黄色
  if (status === '检查中') return 'bg-gradient-to-r from-[#8b5cf6] to-[var(--accent-secondary)]'  // 紫色
  if (status === '错误') return 'bg-gradient-to-r from-[var(--status-error)] to-[#fca5a5]'  // 浅红色
  if (status === '强制下载') return 'bg-gradient-to-r from-[var(--status-warning)] to-[var(--speed-download)]'  // 黄蓝
  if (status === '强制上传') return 'bg-gradient-to-r from-[var(--status-warning)] to-[var(--status-info)]'  // 黄蓝
  return 'bg-gradient-to-r from-[var(--text-muted)] to-[var(--text-secondary)]'  // 默认灰色
}



// 添加操作按钮样式到CSS部分



const getProgressStyle = (progress) => {
  const gradient = getProgressGradient(progress)
  return {
    width: progress + '%',
    '--progress-start': gradient.start,
    '--progress-end': gradient.end
  }
}

const getProgressGradient = (progress) => {
  if (progress === 100) {
    return { start: '#10b981', end: '#34d399' } // 绿色 - 完成
  }
  if (progress > 75) {
    return { start: '#22c55e', end: '#4ade80' } // 浅绿 - 接近完成
  }
  if (progress > 50) {
    return { start: '#3b82f6', end: '#60a5fa' } // 蓝色 - 中等
  }
  if (progress > 25) {
    return { start: '#f59e0b', end: '#fbbf24' } // 橙色 - 进度中
  }
  return { start: '#ef4444', end: '#f87171' }   // 红色 - 初始
}

const getStatusType = (status) => {
  const types = {
    '下载中': 'primary',
    '已完成': 'success',
    '已暂停': 'warning',
    '错误': 'danger',
    '做种中': 'info',
    '上传中': 'info'
  }
  return types[status] || 'info'
}

const getStatusText = (state) => {
  const statusMap = {
    'downloading': '下载中',
    'uploading': '上传中',
    'pausedUP': '已暂停',
    'pausedDL': '已暂停',
    'queuedUP': '排队中',
    'queuedDL': '排队中',
    'stalledUP': '做种中',
    'stalledDL': '下载中',
    'checkingUP': '检查中',
    'checkingDL': '检查中',
    'forcedUP': '强制上传',
    'forcedDL': '强制下载',
    'allocating': '分配中',
    'metaDL': '获取元数据',
    'error': '错误',
    'missingFiles': '文件丢失',
    'moving': '移动中',
    'unknown': '未知'
  }
  return statusMap[state] || state
}

// 标签颜色生成（哈希算法）
const getTagColor = (tagName) => {
  const colors = [
    [34, 211, 238],   // 青色
    [167, 139, 250],  // 紫色
    [52, 211, 153],   // 绿色
    [251, 191, 36],   // 黄色
    [248, 113, 113],  // 红色
    [96, 165, 250],   // 蓝色
  ]
  
  let hash = 0
  for (let i = 0; i < tagName.length; i++) {
    hash = tagName.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

const getTagStyle = (tagName) => {
  const [r, g, b] = getTagColor(tagName)
  return {
    backgroundColor: `rgba(${r}, ${g}, ${b}, 0.15)`,
    borderColor: `rgba(${r}, ${g}, ${b}, 0.3)`,
    color: `rgb(${r}, ${g}, ${b})`
  }
}

// 路径截断
const truncatePath = (path) => {
  if (!path) return '—'
  if (path.length <= 40) return path
  const parts = path.split('/')
  if (parts.length <= 2) return path.substring(0, 37) + '...'
  return parts.slice(0, 2).join('/') + '/.../' + parts[parts.length - 1]
}

// 事件处理
const handleCardClick = (torrent) => {
  if (contextMenu.value.visible) {
    closeContextMenu()
    return
  }
  selectedTorrentForDetails.value = torrent;
  showTaskDetailsDrawer.value = true;
};

const handleCardContextMenu = (event, torrent) => {
  event.preventDefault()
  
  // Check if the clicked torrent is part of the selected torrents
  if (selectedTorrents.value.length > 1 && selectedTorrents.value.includes(torrent.hash)) {
    // If multiple torrents are selected and the clicked torrent is among them,
    // use the selected torrents list (already set in store)
    contextMenu.value = {
      visible: true,
      x: event.clientX,
      y: event.clientY,
      torrent: torrent  // Keep reference to clicked torrent for certain operations
    }
  } else {
    // If only one torrent is selected (or none selected), focus on just this torrent
    contextMenu.value = {
      visible: true,
      x: event.clientX,
      y: event.clientY,
      torrent: torrent
    }
  }
}

const closeContextMenu = () => {
  contextMenu.value.visible = false
}

const handleActionCommand = async (command, torrent) => {
  switch (command) {
    case 'pause':
      await torrentStore.pauseTorrent(torrent.hash)
      break
    case 'resume':
      await torrentStore.resumeTorrent(torrent.hash)
      break
    case 'setDownloadLimit':
      await setTorrentDownloadLimit(torrent)
      break
    case 'setUploadLimit':
      await setTorrentUploadLimit(torrent)
      break
    case 'setPriority':
      await setTorrentPriority(torrent)
      break
    case 'delete':
      await confirmDelete(torrent)
      break
    case 'deleteWithFiles':
      try {
        await ElMessageBox.confirm('确定要删除该任务及其所有文件吗？此操作不可恢复！', '确认删除', {
          type: 'warning'
        })
        await torrentStore.deleteTorrent(torrent.hash, true)
      } catch {
        // 取消删除
      }
      break
  }
}

const handleContextMenuAction = async (action, torrent) => {
  switch (action) {
    case 'pause':
      await torrentStore.pauseTorrent(torrent.hash)
      break
    case 'resume':
      await torrentStore.resumeTorrent(torrent.hash)
      break
    case 'openFolder':
      await navigator.clipboard.writeText(torrent.save_path)
      ElMessage.success('路径已复制到剪贴板')
      break
    case 'setCategory':
      // 保持原有弹窗方式作为备选
      selectedCategory.value = torrent.category
      contextMenu.value.torrent = torrent
      showCategoryDialog.value = true
      break
    case 'manageTags':
      // For tag management, consider if multiple torrents are selected
      if (selectedTorrents.value.length > 1) {
        // Using the ContextMenu with multiselect capability instead of dialog
        // Let the context menu handle multi-torrent tagging through its own dialog
        tagsInput.value = ''
      } else {
        tagsInput.value = torrent.tags
      }
      contextMenu.value.torrent = torrent
      showTagDialog.value = true
      break
    case 'delete':
      await confirmDelete(torrent)
      break
    case 'deleteWithFiles':
      try {
        await ElMessageBox.confirm('确定要删除该任务及其所有文件吗？此操作不可恢复！', '确认删除', {
          type: 'warning'
        })
        await torrentStore.deleteTorrent(torrent.hash, true)
      } catch {
        // 取消删除
      }
      break
  }
}

// 处理标签更新事件
const handleTagsUpdated = async ({ targetHashes, selectedTags }) => {
  try {
    // 更新store中的torrent数据
    await torrentStore.fetchTorrents()
    
    // 更新左侧边栏的标签列表
    await torrentStore.fetchTags()
    
    // 如果有选中的任务，也需要更新它们
    if (selectedTorrents.value.length > 0) {
      // 重新获取所有torrent映射以确保数据最新
      await torrentStore.fetchTorrents()
    }
  } catch (error) {
    console.error('Error refreshing torrent data after tag update:', error)
  }
}

// 设置单个任务的下载限速
const setTorrentDownloadLimit = async (torrent) => {
  try {
    const result = await ElMessageBox.prompt('请输入下载速度限制 (KB/s):\n(输入0表示无限制)', '设置下载限速', {
      inputValue: torrent.downloadSpeed > 0 ? Math.round(torrent.downloadSpeed / 1024) : 0,
      inputPattern: /^\d+$/,
      inputErrorMessage: '请输入有效的数字',
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
    
    const limit = parseInt(result.value) * 1024 // Convert to bytes
    await torrentStore.setTorrentDownloadLimit(torrent.hash, limit)
  } catch (error) {
    // 用户取消或其他错误
    if (error !== 'cancel' && error !== 'closed') {
      console.error('Error setting download limit:', error)
    }
  }
}

// 设置单个任务的上传限速
const setTorrentUploadLimit = async (torrent) => {
  try {
    const result = await ElMessageBox.prompt('请输入上传速度限制 (KB/s):\n(输入0表示无限制)', '设置上传限速', {
      inputValue: torrent.uploadSpeed > 0 ? Math.round(torrent.uploadSpeed / 1024) : 0,
      inputPattern: /^\d+$/,
      inputErrorMessage: '请输入有效的数字',
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
    
    const limit = parseInt(result.value) * 1024 // Convert to bytes
    await torrentStore.setTorrentUploadLimit(torrent.hash, limit)
  } catch (error) {
    // 用户取消或其他错误
    if (error !== 'cancel' && error !== 'closed') {
      console.error('Error setting upload limit:', error)
    }
  }
}

// 设置单个任务的优先级
// 设置单个任务的优先级
const setTorrentPriority = async (torrent) => {
  try {
    const result = await ElMessageBox.prompt(
      '输入优先级数字 (0=最大, 1=高, 2=普通, 3=低):',
      '设置优先级',
      {
        inputValue: '2',
        inputPattern: /^[0-3]$/,
        inputErrorMessage: '请输入 0-3 之间的数字',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }
    );
    
    if (result.value !== undefined) {
      const priority = parseInt(result.value);
      await torrentStore.setTorrentPriority(torrent.hash, priority);
    }
  } catch (error) {
    // 用户取消或其他错误
    if (error !== 'cancel' && error !== 'closed') {
      console.error('Error setting priority:', error);
    }
  }
}

// 批量操作
const batchPause = async () => {
  try {
    await ElMessageBox.confirm(`确定要暂停选中的 ${selectedTorrents.value.length} 个任务吗？`, '批量暂停', {
      type: 'warning'
    })
    await torrentStore.batchPauseTorrents(selectedTorrents.value)
  } catch {
    // 取消
  }
}

const batchResume = async () => {
  await torrentStore.batchResumeTorrents(selectedTorrents.value)
}

const batchDelete = async () => {
  try {
    await ElMessageBox.confirm(`确定要删除选中的 ${selectedTorrents.value.length} 个任务吗？`, '批量删除', {
      type: 'warning'
    })
    await torrentStore.batchDeleteTorrents(selectedTorrents.value, false)
  } catch {
    // 取消
  }
}

const clearSelection = () => {
  torrentStore.clearSelection()
}

const handleCategoryConfirm = async ({ category, isNew }) => {
  const targetTorrent = contextMenu.value.torrent 
    ? [contextMenu.value.torrent.hash] 
    : selectedTorrents.value
  
  if (targetTorrent.length === 0) {
    ElMessage.warning('请选择要设置分类的任务')
    return
  }
  
  // 如果是新分类，先创建
  if (isNew) {
    const created = await torrentStore.addCategory(category)
    if (!created) {
      ElMessage.error('无法创建新分类')
      return
    }
  }
  
  await torrentStore.batchSetCategory(targetTorrent, category)
  showCategoryDialog.value = false
  contextMenu.value.torrent = null
}

const applyTags = async () => {
  const targetTorrent = contextMenu.value.torrent 
    ? [contextMenu.value.torrent.hash] 
    : selectedTorrents.value
  
  if (targetTorrent.length === 0) {
    ElMessage.warning('请选择要添加标签的任务')
    return
  }
  
  if (!tagsInput.value.trim()) {
    ElMessage.warning('请输入标签')
    return
  }
  
  await torrentStore.batchAddTags(targetTorrent, tagsInput.value)
  showTagDialog.value = false
  contextMenu.value.torrent = null
  tagsInput.value = ''
}

// 筛选功能
const filterByCategory = (category) => {
  categoryFilter.value = category
  ElMessage.success(`已筛选分类：${category}`)
}

const filterByTag = (tag) => {
  tagFilter.value = tag
  ElMessage.success(`已筛选标签：${tag}`)
}

// 单个任务操作
const pauseTorrent = async (torrent) => {
  await torrentStore.pauseTorrent(torrent.hash)
}

const resumeTorrent = async (torrent) => {
  await torrentStore.resumeTorrent(torrent.hash)
}

const confirmDelete = async (torrent) => {
  try {
    await ElMessageBox.confirm('确定要删除该任务吗？', '确认删除', {
      type: 'warning'
    })
    await torrentStore.deleteTorrent(torrent.hash, false)
  } catch {
    // 取消删除
  }
}

// 监听路由和查询参数变化
import { watch } from 'vue'
watch(() => route.params.filter, (newFilter) => {
  if (newFilter) {
    filterType.value = newFilter
  }
}, { immediate: true })

// 监听查询参数变化 for category and tag filters
watch(() => route.query, (newQuery) => {
  if (newQuery.category) {
    categoryFilter.value = newQuery.category
  } else {
    categoryFilter.value = 'all'
  }
  
  if (newQuery.tag) {
    tagFilter.value = newQuery.tag
  } else {
    tagFilter.value = ''
  }
}, { immediate: true })

onMounted(async () => {
  // 先获取分类数据
  await torrentStore.fetchCategories()
  
  // 然后开始轮询
  qbittorrentAPI.startPolling(handleMainData, 5000)
})

onUnmounted(() => {
  qbittorrentAPI.stopPolling()
})
</script>

<style scoped>
/* Animation for progress bar shine effect */
@keyframes shine {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

.animate-shine {
  animation: shine 1.5s linear infinite;
}

/* Enhanced progress bar transitions */
:deep(.progress-container) {
  transition: all 0.3s ease;
}

/* Slide down transition */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.2s ease;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>