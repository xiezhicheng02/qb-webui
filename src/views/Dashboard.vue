<template>
  <div class="dashboard">
    <!-- 任务列表区域 -->
    <el-card class="torrent-section" shadow="never">
      <el-table :data="filteredTorrents" style="width: 100%" stripe height="100%">
        <el-table-column prop="name" label="名称" min-width="200">
          <template #default="scope">
            <div class="torrent-name">{{ scope.row.name }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="size" label="大小" width="100">
          <template #default="scope">
            {{ formatSize(scope.row.size) }}
          </template>
        </el-table-column>
        <el-table-column prop="progress" label="进度" width="120">
          <template #default="scope">
            <el-progress :percentage="scope.row.progress" :status="getProgressStatus(scope.row.progress)"
              :stroke-width="15" />
          </template>
        </el-table-column>
        <el-table-column prop="downloadSpeed" label="下载速度" width="100">
          <template #default="scope">
            {{ formatSpeed(scope.row.downloadSpeed) }}
          </template>
        </el-table-column>
        <el-table-column prop="uploadSpeed" label="上传速度" width="100">
          <template #default="scope">
            {{ formatSpeed(scope.row.uploadSpeed) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)" size="small">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="scope">
            <el-button-group size="small">
              <el-button v-if="scope.row.status === '下载中'" type="primary" icon="VideoPause"
                @click="pauseTorrent(scope.row)" />
              <el-button v-else-if="scope.row.status === '已暂停'" type="success" icon="VideoPlay"
                @click="resumeTorrent(scope.row)" />
              <el-button type="danger" icon="Delete" @click="deleteTorrent(scope.row)" />
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination v-model:current-page="currentPage" :page-size="pageSize" :total="torrents.length"
          layout="total, prev, pager, next" @current-change="handlePageChange" />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { useTorrentStore } from '@/store/torrent'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import qbittorrentAPI from '../api/qbittorrent'

const route = useRoute()
const torrentStore = useTorrentStore()

const filterType = ref('all')
const currentPage = ref(1)
const pageSize = ref(20)

// 监听路由变化，更新过滤类型
watch(() => route.params.filter, (newFilter) => {
  if (newFilter) {
    filterType.value = newFilter
  }
}, { immediate: true })

// Polling callback for main data updates
const handleMainData = (data) => {
  if (data.full_update) {
    // Full update - replace all data
    if (data.torrents) {
      torrentStore.setTorrents(Object.values(data.torrents))
    } else {
      torrentStore.setTorrents([])
    }
    if (data.server_state) {
      torrentStore.setServerState(data.server_state)
    }
  } else {
    // Partial update
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
      Object.keys(data.categories).forEach(name => {
        let category = data.categories[name]
        torrentStore.refreshCategories(category)
      })
    }

    if (data.categories_removed) {
      Object.keys(data.categories).forEach(name => {
        let category = data.categories[name]
        torrentStore.deleteCategory(category)
      })
    }

    if (data.server_state) {
      torrentStore.refreshServerState(data.server_state)
    }
  }
}


// 转换种子数据格式
const torrents = computed(() => {
  return torrentStore.torrents.map(t => ({
    id: t.hash,
    name: t.name,
    size: t.size,
    progress: Math.round(t.progress * 100),
    downloadSpeed: t.dlspeed,
    uploadSpeed: t.upspeed,
    status: getStatusText(t.state),
    hash: t.hash,
    category: t.category,
    tags: t.tags
  }))
})

const filteredTorrents = computed(() => {
  let result = torrents.value

  // 类型过滤
  if (filterType.value !== 'all') {
    if (filterType.value === 'downloading') {
      result = result.filter(t => t.status === '下载中')
    } else if (filterType.value === 'completed') {
      result = result.filter(t => t.status === '已完成')
    } else if (filterType.value === 'paused') {
      result = result.filter(t => t.status === '已暂停')
    } else if (filterType.value === 'seeding') {
      result = result.filter(t => t.status === '做种中' || t.status === '上传中')
    }
  }

  return result
})

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

const getProgressStatus = (progress) => {
  if (progress === 100) return 'success'
  if (progress > 0) return ''
  return 'exception'
}

const getStatusType = (status) => {
  const types = {
    '下载中': 'primary',
    '已完成': 'success',
    '已暂停': 'warning',
    '错误': 'danger'
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
    'uploading': '上传中',
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

const pauseTorrent = async (torrent) => {
  await torrentStore.pauseTorrent(torrent.hash)
}

const resumeTorrent = async (torrent) => {
  await torrentStore.resumeTorrent(torrent.hash)
}

const deleteTorrent = async (torrent) => {
  await torrentStore.deleteTorrent(torrent.hash)
}

const handlePageChange = (page) => {
  currentPage.value = page
}

onMounted(() => {
  // Start polling for main data updates
  qbittorrentAPI.startPolling(handleMainData, 5000)
})

onUnmounted(() => {
  // Stop polling when component unmounts
  qbittorrentAPI.stopPolling()
})
</script>

<style scoped>
.dashboard {
  padding: 12px;
  background: linear-gradient(180deg, var(--bg-light) 0%, var(--bg-light-secondary) 100%);
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.dashboard::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(ellipse at 30% 20%, rgba(2, 132, 199, 0.05) 0%, transparent 40%);
  pointer-events: none;
}

/* 任务列表样式 */
.torrent-section {
  margin-bottom: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  background: linear-gradient(180deg, var(--bg-task-list) 0%, var(--bg-task-row) 100%);
  border: 1px solid var(--border-color-subtle);
  position: relative;
  overflow: hidden;
}

.torrent-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--accent-cyan), transparent);
  opacity: 0.5;
}

.torrent-section :deep(.el-card__body) {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0;
  height: 100%;
}

.torrent-section :deep(.el-table) {
  flex: 1;
  height: 100%;
}

.torrent-section :deep(.el-table__header) {
  display: table-header-group;
}

.torrent-section :deep(.el-table__header th) {
  background-color: var(--bg-task-header);
  color: var(--text-secondary);
  font-weight: var(--font-weight-medium);
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid var(--border-color-subtle);
  padding: 12px 16px;
}

.torrent-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
}

/* 优化操作按钮组 */
.torrent-section :deep(.el-button-group .el-button) {
  background-color: var(--bg-task-row);
  border-color: var(--border-color);
  color: var(--text-secondary);
}

.torrent-section :deep(.el-button-group .el-button:hover) {
  background-color: var(--bg-task-row-hover);
  border-color: var(--accent-cyan);
  color: var(--accent-cyan);
}

.pagination {
  padding: 12px 16px;
  border-top: 1px solid var(--border-color-subtle);
  display: flex;
  justify-content: flex-end;
  background: var(--bg-task-list);
}

/* 优化分页器样式 */
.torrent-section :deep(.el-pagination) {
  --el-pagination-button-bg-color: var(--bg-task-row);
  --el-pagination-button-disabled-bg-color: var(--bg-task-header);
  --el-pagination-button-disabled-text-color: var(--text-dim);
  --el-pagination-button-color: var(--text-secondary);
  --el-pagination-hover-color: var(--accent-cyan);
}

.torrent-section :deep(.el-pager li) {
  background-color: var(--bg-task-row);
  color: var(--text-secondary);
}

.torrent-section :deep(.el-pager li:hover) {
  color: var(--accent-cyan);
}

.torrent-section :deep(.el-pager li.is-active) {
  background-color: var(--accent-cyan);
  color: #fff;
}

/* 优化表格样式 - 任务列表专用配色 */
.torrent-section :deep(.el-table th) {
  background-color: var(--bg-task-header);
  font-weight: var(--font-weight-medium);
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border-color-subtle);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.torrent-section :deep(.el-table td) {
  color: var(--text-primary);
  background-color: var(--bg-task-row);
  border-bottom: 1px solid rgba(56, 189, 248, 0.1);
  transition: background-color 0.2s ease;
}

.torrent-section :deep(.el-table tr:hover td) {
  background-color: var(--bg-task-row-hover);
}

.torrent-section :deep(.el-table__body-wrapper) {
  background: linear-gradient(180deg, var(--bg-task-list) 0%, var(--bg-task-row) 100%);
}

/* 优化进度条颜色 */
.torrent-section :deep(.el-progress__text) {
  color: var(--text-secondary);
}

/* 优化标签颜色 */
.torrent-section :deep(.el-tag) {
  background-color: rgba(56, 189, 248, 0.15);
  border-color: rgba(56, 189, 248, 0.3);
  color: var(--accent-cyan);
}

/* 优化按钮组样式 */
.el-button-group .el-button {
  border-radius: var(--border-radius-sm);
}
</style>
