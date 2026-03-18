<template>
  <div class="torrents-view">
    <!-- Filter Bar -->
    <div class="filter-bar">
      <div class="filter-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          :class="['tab-btn', { active: filterType === tab.value }]"
          @click="filterType = tab.value"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- Torrent Table -->
    <div class="table-container glass-panel">
      <table class="torrent-table">
        <thead>
          <tr>
            <th class="col-name">Name</th>
            <th class="col-size">Size</th>
            <th class="col-progress">Progress</th>
            <th class="col-speed">Download</th>
            <th class="col-speed">Upload</th>
            <th class="col-status">Status</th>
            <th class="col-actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="torrent in filteredTorrents" :key="torrent.id" class="torrent-row">
            <td class="col-name">
              <div class="torrent-info">
                <div class="file-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                  </svg>
                </div>
                <div class="name-content">
                  <span class="name-text">{{ torrent.name }}</span>
                  <span class="name-meta">{{ formatSize(torrent.size) }}</span>
                </div>
              </div>
            </td>
            <td class="col-size">{{ formatSize(torrent.size) }}</td>
            <td class="col-progress">
              <div class="progress-container">
                <div class="progress-bar-bg">
                  <div
                    class="progress-bar-fill"
                    :style="{ width: torrent.progress + '%' }"
                    :class="getProgressClass(torrent.progress)"
                  ></div>
                </div>
                <span class="progress-text">{{ torrent.progress }}%</span>
              </div>
            </td>
            <td class="col-speed">
              <span :class="{ 'active-speed': torrent.downloadSpeed > 0 }">
                {{ formatSpeed(torrent.downloadSpeed) }}
              </span>
            </td>
            <td class="col-speed">
              <span :class="{ 'active-speed': torrent.uploadSpeed > 0 }">
                {{ formatSpeed(torrent.uploadSpeed) }}
              </span>
            </td>
            <td class="col-status">
              <span :class="['status-badge', getStatusClass(torrent.status)]">
                {{ torrent.status }}
              </span>
            </td>
            <td class="col-actions">
              <div class="action-group">
                <button
                  v-if="torrent.status === '下载中'"
                  class="action-icon pause"
                  @click="pauseTorrent(torrent)"
                  title="Pause"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
                </button>
                <button
                  v-else-if="torrent.status === '已暂停'"
                  class="action-icon resume"
                  @click="resumeTorrent(torrent)"
                  title="Resume"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                </button>
                <button
                  class="action-icon delete"
                  @click="deleteTorrent(torrent)"
                  title="Delete"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="pagination-container">
      <div class="pagination-info">
        Showing {{ (currentPage - 1) * pageSize + 1 }} - {{ Math.min(currentPage * pageSize, torrents.length) }} of {{ torrents.length }}
      </div>
      <div class="pagination-controls">
        <button class="page-btn" :disabled="currentPage === 1" @click="currentPage--">Prev</button>
        <span class="page-num">{{ currentPage }}</span>
        <button class="page-btn" :disabled="currentPage * pageSize >= torrents.length" @click="currentPage++">Next</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const searchQuery = ref('')
const filterType = ref('all')
const currentPage = ref(1)
const pageSize = ref(20)

const tabs = [
  { label: 'All', value: 'all' },
  { label: 'Downloading', value: 'downloading' },
  { label: 'Completed', value: 'completed' },
  { label: 'Paused', value: 'paused' }
]

const torrents = ref([
  {
    id: 1,
    name: 'Ubuntu 22.04 LTS Desktop (amd64)',
    size: 3.5 * 1024 * 1024 * 1024,
    progress: 85,
    downloadSpeed: 1024 * 1024 * 2.5,
    uploadSpeed: 1024 * 1024 * 0.5,
    status: '下载中'
  },
  {
    id: 2,
    name: 'The Big Buck Bunny (1080p)',
    size: 1.2 * 1024 * 1024 * 1024,
    progress: 100,
    downloadSpeed: 0,
    uploadSpeed: 1024 * 1024 * 0.2,
    status: '已完成'
  },
  {
    id: 3,
    name: 'Linux Kernel Source Code',
    size: 2.8 * 1024 * 1024 * 1024,
    progress: 45,
    downloadSpeed: 1024 * 1024 * 1.8,
    uploadSpeed: 1024 * 1024 * 0.3,
    status: '下载中'
  },
  {
    id: 4,
    name: 'Movie Collection 2024',
    size: 15.5 * 1024 * 1024 * 1024,
    progress: 0,
    downloadSpeed: 0,
    uploadSpeed: 0,
    status: '已暂停'
  }
])

const filteredTorrents = computed(() => {
  let result = torrents.value

  if (searchQuery.value) {
    result = result.filter(t => t.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
  }

  if (filterType.value !== 'all') {
    const statusMap = {
      'downloading': '下载中',
      'completed': '已完成',
      'paused': '已暂停'
    }
    if (statusMap[filterType.value]) {
      result = result.filter(t => t.status === statusMap[filterType.value])
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

const getProgressClass = (progress) => {
  if (progress === 100) return 'complete'
  if (progress > 0) return 'active'
  return 'pending'
}

const getStatusClass = (status) => {
  const classes = {
    '下载中': 'downloading',
    '已完成': 'completed',
    '已暂停': 'paused',
    '错误': 'error'
  }
  return classes[status] || 'default'
}

const pauseTorrent = (torrent) => {
  torrent.status = '已暂停'
  torrent.downloadSpeed = 0
}

const resumeTorrent = (torrent) => {
  torrent.status = '下载中'
  torrent.downloadSpeed = 1024 * 1024 * 1.5
}

const deleteTorrent = (torrent) => {
  // TODO: Implement delete torrent functionality
}
</script>

<style scoped>
.torrents-view {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* Filter Bar */
.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-tabs {
  display: flex;
  gap: 5px;
  background: var(--bg-card);
  padding: 4px;
  border-radius: 6px;
  border: 1px solid var(--border-color);
}

.tab-btn {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  padding: 10px 18px;
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
  font-weight: 500;
}

.tab-btn:hover {
  color: var(--text-primary);
}

.tab-btn.active {
  background: var(--bg-hover);
  color: var(--accent-cyan);
  box-shadow: 0 0 10px rgba(0, 243, 255, 0.1);
}

/* Table Container */
.table-container {
  flex: 1;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.torrent-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--text-sm);
}

.torrent-table th {
  text-align: left;
  padding: 14px 15px;
  background: var(--bg-panel);
  color: var(--text-muted);
  font-weight: 600;
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 1px solid var(--border-color);
}

.torrent-table td {
  padding: 14px 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
}

.torrent-row {
  transition: background 0.2s;
}

.torrent-row:hover {
  background: var(--bg-hover);
}

/* Columns */
.col-name {
  width: 35%;
}

.col-size {
  width: 10%;
  text-align: right;
}

.col-progress {
  width: 15%;
}

.col-speed {
  width: 10%;
  text-align: right;
  font-family: var(--font-mono);
  font-size: var(--text-sm);
}

.col-status {
  width: 10%;
}

.col-actions {
  width: 10%;
  text-align: center;
}

/* Torrent Info */
.torrent-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.file-icon {
  width: 24px;
  height: 24px;
  color: var(--accent-cyan);
  opacity: 0.8;
}

.name-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.name-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 300px;
}

.name-meta {
  font-size: var(--text-xs);
  color: var(--text-muted);
}

/* Progress Bar */
.progress-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress-bar-bg {
  flex: 1;
  height: 4px;
  background: var(--bg-card);
  border-radius: 2px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.3s ease;
}

.progress-bar-fill.active {
  background: var(--accent-gradient);
  box-shadow: 0 0 8px rgba(0, 243, 255, 0.4);
}

.progress-bar-fill.complete {
  background: #00ff88;
}

.progress-bar-fill.pending {
  background: var(--text-muted);
}

.progress-text {
  font-size: var(--text-xs);
  color: var(--text-secondary);
  min-width: 35px;
  text-align: right;
}

/* Status Badge */
.status-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 3px;
  font-size: var(--text-xs);
  font-weight: 600;
  text-transform: capitalize;
}

.status-badge.downloading {
  background: rgba(0, 243, 255, 0.15);
  color: var(--accent-cyan);
}

.status-badge.completed {
  background: rgba(0, 255, 136, 0.15);
  color: var(--status-success);
}

.status-badge.paused {
  background: rgba(255, 193, 7, 0.15);
  color: var(--status-warning);
}

.status-badge.error {
  background: rgba(255, 0, 85, 0.15);
  color: var(--accent-magenta);
}

/* Actions */
.action-group {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.action-icon {
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.2s;
}

.action-icon svg {
  width: 14px;
  height: 14px;
}

.action-icon:hover {
  border-color: var(--text-primary);
  color: var(--text-primary);
  background: var(--bg-card);
}

.action-icon.delete:hover {
  border-color: var(--accent-magenta);
  color: var(--accent-magenta);
}

.action-icon.resume:hover {
  border-color: var(--status-success);
  color: var(--status-success);
}

/* Pagination */
.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
}

.pagination-info {
  font-size: var(--text-xs);
  color: var(--text-muted);
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.page-btn {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  padding: 6px 12px;
  border-radius: 4px;
  font-size: var(--text-xs);
  cursor: pointer;
  transition: all 0.2s;
}

.page-btn:hover:not(:disabled) {
  border-color: var(--accent-cyan);
  color: var(--accent-cyan);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-num {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--text-primary);
  padding: 0 5px;
}

/* Active Speed Animation */
.active-speed {
  color: var(--accent-cyan);
  text-shadow: 0 0 5px rgba(0, 243, 255, 0.3);
}
</style>
