<template>
  <div class="dashboard">
    <!-- 顶部统计区域 -->
    <el-row :gutter="20" class="stats-section">
      <el-col :span="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <el-icon class="stat-icon" color="#409eff"><Download /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ stats.downloading }}</div>
              <div class="stat-label">下载中</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <el-icon class="stat-icon" color="#67c23a"><Upload /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ stats.uploading }}</div>
              <div class="stat-label">上传中</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <el-icon class="stat-icon" color="#e6a23c"><Finished /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ stats.completed }}</div>
              <div class="stat-label">已完成</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <el-icon class="stat-icon" color="#f56c6c"><Warning /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ stats.error }}</div>
              <div class="stat-label">错误</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 速度监控区域 -->
    <el-card class="speed-section" shadow="never">
      <template #header>
        <div class="card-header">
          <span><el-icon><Monitor /></el-icon> 速度监控</span>
        </div>
      </template>
      <div class="speed-info">
        <div class="speed-item">
          <span class="speed-label">下载速度:</span>
          <span class="speed-value download">{{ formatSpeed(stats.downloadSpeed) }}</span>
        </div>
        <div class="speed-item">
          <span class="speed-label">上传速度:</span>
          <span class="speed-value upload">{{ formatSpeed(stats.uploadSpeed) }}</span>
        </div>
        <div class="speed-item">
          <span class="speed-label">总下载:</span>
          <span class="speed-value">{{ formatSize(stats.totalDownloaded) }}</span>
        </div>
        <div class="speed-item">
          <span class="speed-label">总上传:</span>
          <span class="speed-value">{{ formatSize(stats.totalUploaded) }}</span>
        </div>
      </div>
    </el-card>

    <!-- 任务列表区域 -->
    <el-card class="torrent-section" shadow="never">
      <template #header>
        <div class="card-header">
          <span><el-icon><List /></el-icon> 任务列表</span>
          <div class="header-actions">
            <el-input
              v-model="searchQuery"
              placeholder="搜索任务..."
              prefix-icon="Search"
              size="small"
              style="width: 200px;"
            />
          </div>
        </div>
      </template>

      <el-table :data="filteredTorrents" style="width: 100%" stripe height="400">
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
            <el-progress
              :percentage="scope.row.progress"
              :status="getProgressStatus(scope.row.progress)"
              :stroke-width="15"
            />
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
              <el-button
                v-if="scope.row.status === '下载中'"
                type="primary"
                icon="VideoPause"
                @click="pauseTorrent(scope.row)"
              />
              <el-button
                v-else-if="scope.row.status === '已暂停'"
                type="success"
                icon="VideoPlay"
                @click="resumeTorrent(scope.row)"
              />
              <el-button
                type="danger"
                icon="Delete"
                @click="deleteTorrent(scope.row)"
              />
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :total="torrents.length"
          layout="total, prev, pager, next"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useTorrentStore } from '@/store/torrent'

const route = useRoute()
const torrentStore = useTorrentStore()

const searchQuery = ref('')
const filterType = ref('all')
const currentPage = ref(1)
const pageSize = ref(20)
let refreshInterval = null

// 监听路由变化，更新过滤类型
watch(() => route.params.filter, (newFilter) => {
  if (newFilter) {
    filterType.value = newFilter
  }
}, { immediate: true })

// 使用 store 数据
const stats = computed(() => ({
  downloading: torrentStore.downloadingCount,
  uploading: torrentStore.uploadingCount,
  completed: torrentStore.completedCount,
  error: torrentStore.errorCount,
  downloadSpeed: torrentStore.totalDownloadSpeed,
  uploadSpeed: torrentStore.totalUploadSpeed,
  totalDownloaded: torrentStore.totalDownloaded,
  totalUploaded: torrentStore.totalUploaded
}))

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

  // 搜索过滤
  if (searchQuery.value) {
    result = result.filter(t =>
      t.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

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
  const success = await torrentStore.pauseTorrent(torrent.hash)
  if (success) {
    console.log('暂停任务:', torrent.name)
  }
}

const resumeTorrent = async (torrent) => {
  const success = await torrentStore.resumeTorrent(torrent.hash)
  if (success) {
    console.log('恢复任务:', torrent.name)
  }
}

const deleteTorrent = async (torrent) => {
  const success = await torrentStore.deleteTorrent(torrent.hash)
  if (success) {
    console.log('删除任务:', torrent.name)
  }
}

const handlePageChange = (page) => {
  currentPage.value = page
}

const startAutoRefresh = () => {
  refreshInterval = setInterval(() => {
    torrentStore.fetchTorrents()
    torrentStore.fetchTransferInfo()
  }, 3000)
}

onMounted(() => {
  // 初始加载数据
  torrentStore.fetchTorrents()
  torrentStore.fetchTransferInfo()
  torrentStore.fetchServerState()

  // 启动自动刷新
  startAutoRefresh()
})

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
})
</script>

<style scoped>
.dashboard {
  padding: var(--spacing-md);
  background-color: var(--background-color);
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* 统计卡片样式 */
.stats-section {
  margin-bottom: var(--spacing-lg);
  flex-shrink: 0;
}

.stat-card {
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
  cursor: pointer;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.stat-content {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-lg);
}

.stat-icon {
  font-size: 40px;
  margin-right: var(--spacing-md);
}

.stat-info {
  text-align: center;
}

.stat-value {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
}

.stat-label {
  font-size: var(--font-size-sm);
  color: var(--text-tertiary);
  margin-top: var(--spacing-xs);
}

/* 速度监控样式 */
.speed-section {
  margin-bottom: var(--spacing-lg);
  flex-shrink: 0;
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
}

.card-header {
  display: flex;
  align-items: center;
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-md);
  color: var(--text-primary);
}

.card-header .el-icon {
  margin-right: var(--spacing-sm);
}

.speed-info {
  display: flex;
  justify-content: space-around;
  padding: var(--spacing-md) 0;
}

.speed-item {
  text-align: center;
  flex: 1;
}

.speed-label {
  display: block;
  font-size: var(--font-size-sm);
  color: var(--text-tertiary);
  margin-bottom: var(--spacing-sm);
}

.speed-value {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-bold);
}

.speed-value.download {
  color: var(--primary-color);
}

.speed-value.upload {
  color: #67c23a;
}

/* 任务列表样式 */
.torrent-section {
  margin-bottom: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
}

.torrent-section :deep(.el-card__body) {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0;
}

.torrent-section :deep(.el-table) {
  flex: 1;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md);
  border-bottom: 1px solid #e6e6e6;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.torrent-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: var(--font-weight-medium);
}

.pagination {
  padding: var(--spacing-md);
  border-top: 1px solid #ebeef5;
  display: flex;
  justify-content: flex-end;
}

/* 优化表格样式 */
.torrent-section :deep(.el-table th) {
  background-color: var(--background-color);
  font-weight: var(--font-weight-medium);
  color: var(--text-secondary);
}

.torrent-section :deep(.el-table td) {
  color: var(--text-primary);
}

/* 优化按钮组样式 */
.el-button-group .el-button {
  border-radius: var(--border-radius-sm);
}
</style>
