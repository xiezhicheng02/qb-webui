<template>
  <div id="app" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
    <!-- Login Page -->
    <template v-if="$route.path === '/login'">
      <router-view />
    </template>

    <!-- Main Dashboard Layout -->
    <template v-else>
      <!-- Sidebar -->
      <aside class="sidebar" :style="{ width: sidebarCollapsed ? '60px' : 'var(--sidebar-width)' }">
        <div class="sidebar-header">
          <div class="logo-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
          </div>
          <span v-if="!sidebarCollapsed" class="logo-text">QB-WebUI</span>
        </div>

        <nav class="sidebar-nav">
          <!-- Torrents Section -->
          <div class="nav-section">
            <div v-if="!sidebarCollapsed" class="nav-label">任务列表</div>
            <router-link to="/torrents/all" class="nav-item" active-class="active">
              <div class="nav-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>
              </div>
              <span v-if="!sidebarCollapsed">全部</span>
            </router-link>
            <router-link to="/torrents/downloading" class="nav-item" active-class="active">
              <div class="nav-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              </div>
              <span v-if="!sidebarCollapsed">下载中</span>
            </router-link>
            <router-link to="/torrents/completed" class="nav-item" active-class="active">
              <div class="nav-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              <span v-if="!sidebarCollapsed">已完成</span>
            </router-link>
            <router-link to="/torrents/paused" class="nav-item" active-class="active">
              <div class="nav-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
              </div>
              <span v-if="!sidebarCollapsed">暂停</span>
            </router-link>
            <router-link to="/torrents/seeding" class="nav-item" active-class="active">
              <div class="nav-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M2 12h20"></path></svg>
              </div>
              <span v-if="!sidebarCollapsed">做种</span>
            </router-link>
          </div>

          <!-- Categories Section -->
          <div class="nav-section" v-if="!sidebarCollapsed">
            <div class="nav-label">分类</div>
            <div class="category-tags">
              <router-link to="/categories/movie" class="tag-item">电影</router-link>
              <router-link to="/categories/tv" class="tag-item">电视剧</router-link>
              <router-link to="/categories/anime" class="tag-item">动漫</router-link>
              <router-link to="/categories/music" class="tag-item">音乐</router-link>
              <router-link to="/categories/software" class="tag-item">软件</router-link>
              <router-link to="/categories/document" class="tag-item">文档</router-link>
            </div>
          </div>

          <!-- Tags Section -->
          <div class="nav-section" v-if="!sidebarCollapsed">
            <div class="nav-label">标签</div>
            <div class="category-tags">
              <router-link to="/tags/all" class="tag-item">全部</router-link>
              <router-link to="/tags/high-def" class="tag-item">高清</router-link>
              <router-link to="/tags/4k" class="tag-item">4K</router-link>
              <router-link to="/tags/chinese" class="tag-item">国语</router-link>
              <router-link to="/tags/subtitle" class="tag-item">中字</router-link>
              <router-link to="/tags/lossless" class="tag-item">无损</router-link>
              <router-link to="/tags/favorite" class="tag-item">收藏</router-link>
            </div>
          </div>
        </nav>

        <div class="sidebar-footer">
          <router-link to="/settings" class="nav-item" active-class="active">
            <div class="nav-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
            </div>
            <span v-if="!sidebarCollapsed">设置</span>
          </router-link>
          <button @click="toggleSidebar" class="toggle-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" :style="{ transform: sidebarCollapsed ? 'rotate(180deg)' : 'none' }">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <!-- Header -->
        <header class="header">
          <div class="header-left">
            <h1 class="page-title">{{ currentPageTitle }}</h1>
            <div class="status-indicator">
              <span class="dot"></span>
              <span>已连接</span>
            </div>
          </div>

          <div class="header-right">
            <!-- Global Stats in Header -->
            <div class="header-stats">
              <div class="stat-item">
                <span class="stat-label">下载</span>
                <span class="stat-value download">{{ formatSpeed(globalStats.downloadSpeed) }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">上传</span>
                <span class="stat-value upload">{{ formatSpeed(globalStats.uploadSpeed) }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">总下载</span>
                <span class="stat-value">{{ formatSize(globalStats.totalDownloaded) }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">总上传</span>
                <span class="stat-value">{{ formatSize(globalStats.totalUploaded) }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">DHT</span>
                <span class="stat-value">{{ globalStats.dhtNodes }}</span>
              </div>
            </div>
            <div class="header-actions">
              <button class="action-btn primary" @click="addTorrent">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                <span>添加任务</span>
              </button>
              <button class="action-btn logout" @click="handleLogout">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              </button>
            </div>
          </div>
        </header>

        <!-- View Router -->
        <div class="view-container">
          <router-view />
        </div>
      </main>
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import qbittorrentAPI from '@/api/qbittorrent'
import { ElMessage } from 'element-plus'
import { useTorrentStore } from '@/store/torrent'

const router = useRouter()
const route = useRoute()
const torrentStore = useTorrentStore()
const sidebarCollapsed = ref(false)

const currentPageTitle = computed(() => {
  const path = route.path
  if (path.includes('torrents')) return 'Torrents'
  if (path.includes('categories')) return 'Categories'
  if (path.includes('settings')) return 'Settings'
  return 'Dashboard'
})

// Global stats for header
const globalStats = computed(() => ({
  downloadSpeed: torrentStore.totalDownloadSpeed,
  uploadSpeed: torrentStore.totalUploadSpeed,
  totalDownloaded: torrentStore.totalDownloaded,
  totalUploaded: torrentStore.totalUploaded,
  dhtNodes: torrentStore.serverState?.dht_nodes || 0
}))

const formatSpeed = (bytes) => {
  if (bytes === 0) return '0 B/s'
  if (bytes < 1024) return bytes + ' B/s'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB/s'
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB/s'
  return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB/s'
}

const formatSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB'
}

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

const addTorrent = () => {
  // TODO: Implement add torrent functionality
}

const handleLogout = () => {
  qbittorrentAPI.logout()
  ElMessage.success('Logged out')
  router.push('/login')
}
</script>

<style scoped>
#app {
  display: flex;
  height: 100vh;
  width: 100vw;
  background-color: var(--bg-light);
  overflow: hidden;
}

/* Sidebar Styles */
.sidebar {
  background: linear-gradient(180deg, var(--bg-sidebar) 0%, var(--bg-light-secondary) 100%);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 100;
  position: relative;
  box-shadow: var(--shadow-md);
}

.sidebar::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 1px;
  height: 100%;
  background: linear-gradient(180deg, transparent, var(--accent-cyan), transparent);
  opacity: 0.3;
  pointer-events: none;
}

.sidebar-header {
  height: var(--header-height);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  border-bottom: 1px solid var(--border-color);
  gap: 10px;
  background: linear-gradient(90deg, transparent, rgba(2, 132, 199, 0.05), transparent);
}

.logo-icon {
  width: 32px;
  height: 32px;
  color: var(--accent-cyan);
}

.logo-text {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: var(--text-lg);
  letter-spacing: 2px;
  background: var(--accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.sidebar-nav {
  flex: 1;
  padding: 20px 10px;
  overflow-y: auto;
}

.nav-section {
  margin-bottom: 25px;
}

.nav-label {
  font-size: var(--text-xs);
  color: var(--text-muted);
  letter-spacing: 1.5px;
  margin-bottom: 10px;
  padding-left: 15px;
  text-transform: uppercase;
  font-weight: 500;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  color: var(--text-secondary);
  text-decoration: none;
  border-radius: var(--border-radius);
  margin-bottom: 4px;
  font-size: var(--text-sm);
  font-weight: 400;
  transition: all 0.2s ease;
  position: relative;
}

.nav-item:hover {
  background: var(--bg-sidebar-hover);
  color: var(--text-primary);
  transform: translateX(4px);
}

.nav-item.active {
  background: linear-gradient(90deg, var(--bg-active) 0%, transparent 100%);
  color: var(--accent-cyan);
  border-left: 3px solid var(--accent-cyan);
  box-shadow: inset 0 0 20px rgba(2, 132, 199, 0.1);
}

.nav-icon {
  width: 20px;
  height: 20px;
  margin-right: 12px;
  flex-shrink: 0;
}

.category-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 0 15px;
}

.tag-item {
  font-size: var(--text-xs);
  padding: 4px 8px;
  background: var(--bg-light);
  border: 1px solid var(--border-color);
  border-radius: 3px;
  color: var(--text-secondary);
  text-decoration: none;
  transition: all 0.2s;
  font-weight: 400;
}

.tag-item:hover {
  border-color: var(--accent-cyan);
  color: var(--accent-cyan);
  background: rgba(2, 132, 199, 0.1);
}

.sidebar-footer {
  padding: 15px;
  border-top: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(90deg, transparent, rgba(2, 132, 199, 0.03), transparent);
}

.toggle-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: color 0.2s;
}

.toggle-btn:hover {
  color: var(--text-primary);
  background: var(--bg-hover);
}

/* Main Content */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, var(--bg-light) 0%, var(--bg-light-secondary) 100%);
  position: relative;
  overflow: hidden;
}

/* Header */
.header {
  height: var(--header-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 25px;
  border-bottom: 1px solid var(--border-color);
  background: linear-gradient(180deg, var(--bg-light-secondary) 0%, var(--bg-panel) 100%);
  z-index: 50;
  box-shadow: var(--shadow-sm);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 15px;
  flex: 1;
}

.page-title {
  font-family: var(--font-display);
  font-size: var(--text-md);
  font-weight: 500;
  letter-spacing: 1px;
  color: var(--text-primary);
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: var(--text-xs);
  color: var(--text-muted);
}

.dot {
  width: 6px;
  height: 6px;
  background: #67c23a;
  border-radius: 50%;
  box-shadow: 0 0 6px rgba(103, 194, 58, 0.5);
}

/* Header Stats */
.header-stats {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 16px;
  border-left: 1px solid var(--border-color);
  border-right: 1px solid var(--border-color);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1px;
}

.stat-label {
  font-size: var(--text-xs);
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  line-height: 1;
}

.stat-value {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--text-primary);
  line-height: 1.2;
}

.stat-value.download {
  color: var(--speed-download);
}

.stat-value.upload {
  color: var(--speed-upload);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border: none;
  border-radius: 4px;
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
}

.action-btn svg {
  width: 16px;
  height: 16px;
}

.action-btn.primary {
  background: var(--accent-gradient);
  color: #fff;
  font-weight: 600;
  box-shadow: var(--accent-glow);
}

.action-btn.primary:hover {
  opacity: 0.95;
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(56, 189, 248, 0.4);
}

.action-btn.logout {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
}

.action-btn.logout:hover {
  border-color: var(--accent-magenta);
  color: var(--accent-magenta);
}

/* View Container */
.view-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: linear-gradient(180deg, var(--bg-light) 0%, var(--bg-light-secondary) 100%);
  position: relative;
}

.view-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(ellipse at top right, rgba(2, 132, 199, 0.03) 0%, transparent 50%);
  pointer-events: none;
}
</style>
