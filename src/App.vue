<template>
  <div id="app" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
    <!-- Login Page -->
    <template v-if="$route.path === '/login'">
      <router-view />
    </template>

    <!-- Main Dashboard Layout -->
    <template v-else>
      <!-- Sidebar -->
      <aside :class="[
        'fixed left-0 top-0 h-screen z-50 transition-all duration-300 ease-in-out',
        'bg-gradient-to-b from-[var(--bg-sidebar)] to-[var(--bg-light-secondary)]',
        'border-r border-[var(--border-color)] shadow-lg',
        'flex flex-col',
        sidebarCollapsed ? 'w-12' : 'w-[var(--sidebar-width)]'
      ]" :style="{ width: sidebarCollapsed ? '3rem' : 'var(--sidebar-width)' }">
        <div
          class="flex items-center justify-center py-0 px-5 h-[var(--header-height)] border-b border-[var(--border-color)] bg-gradient-to-r from-transparent via-[rgba(2,132,199,0.05)] to-transparent">
          <div class="w-16 h-16 text-[var(--accent-cyan)] flex items-center">
            <svg viewBox="0 0 80 80" fill="none">
              <defs>
                <linearGradient id="logo-grad" x1="10" y1="10" x2="70" y2="70" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#22d3ee" />
                  <stop offset="1" stop-color="#c4b5fd" />
                </linearGradient>
              </defs>
              <polygon points="40,16 58,26 58,46 40,56 22,46 22,26" stroke="url(#logo-grad)" stroke-width="2.5"
                fill="none" />
              <path d="M40 28 L40 44" stroke="#22d3ee" stroke-width="3" stroke-linecap="round" />
              <path d="M33 38 L40 46 L47 38" stroke="#22d3ee" stroke-width="3" stroke-linecap="round"
                stroke-linejoin="round" />
              <circle cx="14" cy="40" r="3" fill="#a78bfa" opacity="0.5" />
              <circle cx="66" cy="40" r="3" fill="#22d3ee" opacity="0.5" />
              <circle cx="40" cy="8" r="2.5" fill="#a78bfa" opacity="0.4" />
              <circle cx="40" cy="72" r="2.5" fill="#22d3ee" opacity="0.4" />
              <line x1="17" y1="40" x2="22" y2="38" stroke="#a78bfa" stroke-width="1" opacity="0.3" />
              <line x1="58" y1="34" x2="63" y2="40" stroke="#22d3ee" stroke-width="1" opacity="0.3" />
            </svg>
          </div>
          <span v-if="!sidebarCollapsed" class="logo-text">QB-WebUI</span>
        </div>

        <div class="flex-1 flex flex-col">
          <nav class="py-5 px-2.5 overflow-y-auto flex-1">
            <!-- Torrents Section -->
            <div class="mb-6">
              <div v-if="!sidebarCollapsed"
                class="text-xs text-[var(--text-muted)] tracking-[1.5px] mb-2.5 pl-3.5 text-uppercase font-medium">任务列表
              </div>
              <router-link to="/torrents/all"
                class="flex items-center py-3 px-3.5 text-[var(--text-secondary)] no-underline rounded-[var(--border-radius)] mb-1 text-sm font-normal transition-all duration-200 relative group"
                active-class="nav-item-active">
                <div class="w-5 h-5 mr-3 flex-shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
                    <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                    <line x1="6" y1="6" x2="6.01" y2="6"></line>
                    <line x1="6" y1="18" x2="6.01" y2="18"></line>
                  </svg>
                </div>
                <span v-if="!sidebarCollapsed">全部</span>
              </router-link>
              <router-link to="/torrents/downloading"
                class="flex items-center py-3 px-3.5 text-[var(--text-secondary)] no-underline rounded-[var(--border-radius)] mb-1 text-sm font-normal transition-all duration-200 relative group"
                active-class="nav-item-active">
                <div class="w-5 h-5 mr-3 flex-shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                </div>
                <span v-if="!sidebarCollapsed">下载中</span>
              </router-link>
              <router-link to="/torrents/completed"
                class="flex items-center py-3 px-3.5 text-[var(--text-secondary)] no-underline rounded-[var(--border-radius)] mb-1 text-sm font-normal transition-all duration-200 relative group"
                active-class="nav-item-active">
                <div class="w-5 h-5 mr-3 flex-shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <span v-if="!sidebarCollapsed">已完成</span>
              </router-link>
              <router-link to="/torrents/seeding"
                class="flex items-center py-3 px-3.5 text-[var(--text-secondary)] no-underline rounded-[var(--border-radius)] mb-1 text-sm font-normal transition-all duration-200 relative group"
                active-class="nav-item-active">
                <div class="w-5 h-5 mr-3 flex-shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2v20M2 12h20"></path>
                  </svg>
                </div>
                <span v-if="!sidebarCollapsed">做种中</span>
              </router-link>
              <router-link to="/torrents/paused"
                class="flex items-center py-3 px-3.5 text-[var(--text-secondary)] no-underline rounded-[var(--border-radius)] mb-1 text-sm font-normal transition-all duration-200 relative group"
                active-class="nav-item-active">
                <div class="w-5 h-5 mr-3 flex-shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="6" y="4" width="4" height="16"></rect>
                    <rect x="14" y="4" width="4" height="16"></rect>
                  </svg>
                </div>
                <span v-if="!sidebarCollapsed">暂停</span>
              </router-link>
            </div>

            <!-- Categories Section -->
            <SidebarCategoryManager v-if="!sidebarCollapsed" />

            <!-- Tags Section -->
            <SidebarTagManager v-if="!sidebarCollapsed" />
          </nav>

          <!-- Settings Section - Fixed to Bottom -->
          <div
            class="pt-3 border-t border-[var(--border-color)] flex items-center justify-between bg-gradient-to-r from-transparent via-[rgba(2,132,199,0.03)] to-transparent">
            <router-link to="/settings"
              class="flex items-center py-3 px-3.5 text-[var(--text-secondary)] no-underline rounded-[var(--border-radius)] text-sm font-normal transition-all duration-200 relative group"
              active-class="nav-item-active">
              <div class="w-5 h-5 mr-3 flex-shrink-0">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path
                    d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z">
                  </path>
                </svg>
              </div>
              <span v-if="!sidebarCollapsed">设置</span>
            </router-link>
            <button @click="toggleSidebar"
              class="bg-none border-none text-[var(--text-muted)] cursor-pointer p-2 rounded-md transition-colors duration-200 hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                :class="{ 'rotate-180': sidebarCollapsed }">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
          </div>
        </div>

      </aside>

      <!-- Main Content -->
      <main
        class="ml-[var(--sidebar-width)] flex flex-col min-h-screen transition-all duration-300 ease-in-out bg-gradient-to-b from-[var(--bg-light)] to-[var(--bg-light-secondary)] relative overflow-hidden">
        <!-- Header -->
        <header
          class="h-[var(--header-height)] flex items-center justify-between px-6 border-b border-[var(--border-color)] bg-gradient-to-b from-[var(--bg-light-secondary)] to-[var(--bg-panel)] z-10 shadow-sm">

          <div class="flex items-center gap-3.5 flex-1 w-1/5">
            <h1 class="font-display text-[var(--text-lg)] font-medium tracking-[1px] text-[var(--text-primary)]">{{
              currentPageTitle }}</h1>
            <div class="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
              <span class="w-1.5 h-1.5 bg-[#67c23a] rounded-full shadow-[0_0_6px_rgba(103,194,58,0.5)]"></span>
              <span>已连接</span>
            </div>
          </div>

          <div class="flex items-center gap-5 w-4/5 justify-end">
            <!-- Global Stats in Header -->
            <div class="flex items-center px-4 flex-wrap" :style="{ gap: dynamicGap + 'px' }">
              <div class="text-center py-0 px-2" :style="{ minWidth: dynamicMinWidth + 'px' }">
                <p class="text-[var(--text-xs)] text-[var(--text-muted)] font-medium mb-1">下载</p>
                <p class="text-[var(--text-base)] font-mono font-bold text-[var(--accent-cyan)]">{{
                  formatSpeed(globalStats.downloadSpeed) }}</p>
              </div>
              <div class="text-center py-0 px-2" :style="{ minWidth: dynamicMinWidth + 'px' }">
                <p class="text-[var(--text-xs)] text-[var(--text-muted)] font-medium mb-1">上传</p>
                <p class="text-[var(--text-base)] font-mono font-bold text-[var(--speed-upload)]">{{
                  formatSpeed(globalStats.uploadSpeed) }}</p>
              </div>
              <div class="text-center py-0 px-2" :style="{ minWidth: dynamicMinWidth + 'px' }">
                <p class="text-[var(--text-xs)] text-[var(--text-muted)] font-medium mb-1">下载限速</p>
                <p class="text-[var(--text-base)] font-mono font-bold text-[var(--status-warning)]">{{
                  globalStats.downloadLimit ? formatSpeed(globalStats.downloadLimit) : '∞' }}</p>
              </div>
              <div class="text-center py-0 px-2" :style="{ minWidth: dynamicMinWidth + 'px' }">
                <p class="text-[var(--text-xs)] text-[var(--text-muted)] font-medium mb-1">上传限速</p>
                <p class="text-[var(--text-base)] font-mono font-bold text-[var(--status-success)]">{{
                  globalStats.uploadLimit ? formatSpeed(globalStats.uploadLimit) : '∞' }}</p>
              </div>
              <div class="text-center py-0 px-2" :style="{ minWidth: dynamicMinWidth + 'px' }">
                <p class="text-[var(--text-xs)] text-[var(--text-muted)] font-medium mb-1">下载量</p>
                <p class="text-[var(--text-base)] font-mono font-bold text-[var(--text-secondary)]">{{
                  formatSize(globalStats.totalDownloaded) }}</p>
              </div>
              <div class="text-center py-0 px-2" :style="{ minWidth: dynamicMinWidth + 'px' }">
                <p class="text-[var(--text-xs)] text-[var(--text-muted)] font-medium mb-1">上传量</p>
                <p class="text-[var(--text-base)] font-mono font-bold text-[var(--text-secondary)]">{{
                  formatSize(globalStats.totalUploaded) }}</p>
              </div>
              <div class="text-center py-0 px-2" :style="{ minWidth: dynamicMinWidth + 'px' }">
                <p class="text-[var(--text-xs)] text-[var(--text-muted)] font-medium mb-1">DHT节点</p>
                <p class="text-[var(--text-base)] font-mono font-bold text-[var(--status-info)]">{{ globalStats.dhtNodes
                  }}</p>
              </div>
            </div>

            <div class="flex items-center gap-2.5 w-48">
              <button
                class="flex items-center gap-2 py-3 px-5 border-none rounded-lg font-mono text-[var(--text-base)] cursor-pointer transition-all duration-200 font-bold bg-gradient-to-r from-[#0ea5e9] via-[#3b82f6] to-[#8b5cf6] text-white shadow-[0_6px_18px_rgba(56,189,248,0.4),0_4px_12px_rgba(139,92,246,0.5)] hover:opacity-90 hover:shadow-[0_8px_25px_rgba(56,189,248,0.6),0_6px_20px_rgba(139,92,246,0.6)] hover:transform hover:-translate-y-0.5 active:translate-y-0 transform-gpu"
                @click="showAddTaskDialog = true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" class="w-5 h-5">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                <span>添加任务</span>
              </button>
              <button
                class="flex items-center gap-1.5 py-2 px-3.5 border border-[var(--border-color)] bg-transparent text-[var(--text-secondary)] cursor-pointer transition-all duration-200 font-medium rounded-md font-mono text-[var(--text-sm)] hover:border-[var(--accent-magenta)] hover:text-[var(--accent-magenta)]"
                @click="handleLogout">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
              </button>
            </div>
          </div>
        </header>

        <!-- View Router -->
        <div
          class="flex-1 overflow-y-auto p-5 bg-gradient-to-b from-[var(--bg-light)] to-[var(--bg-light-secondary)] relative">
          <div
            class="absolute top-0 left-0 right-0 bottom-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(2,132,199,0.03)_0%,_transparent_50%)] pointer-events-none">
          </div>
          <router-view />
        </div>
      </main>
    </template>

    <!-- Category Selector Dialog -->
    <CategorySelector v-model="selectedCategory" :visible="showCategoryManager"
      @update:visible="showCategoryManager = $event" @confirm="handleCategoryManagerConfirm"
      @cancel="showCategoryManager = false" />

    <!-- Tag Manager Dialog -->
    <TagManager :visible="showTagManager" @update:visible="showTagManager = $event" @close="showTagManager = false" />

    <!-- Add Task Dialog -->
    <AddTaskDialog :visible="showAddTaskDialog" @update:visible="showAddTaskDialog = $event"
      @close="showAddTaskDialog = false" />

    <!-- Task Details Drawer -->
    <TaskDetailsDrawer :visible="showTaskDetailsDrawer" :torrent="selectedTorrentForDetails"
      @update:visible="showTaskDetailsDrawer = $event" @close="showTaskDetailsDrawer = false" />

    <!-- Notification Container -->
    <NotificationContainer />
  </div>
</template>

<script setup>
import qbittorrentAPI from '@/api/qbittorrent'
import AddTaskDialog from '@/components/AddTaskDialog.vue'
import CategorySelector from '@/components/CategorySelector.vue'
import SidebarCategoryManager from '@/components/SidebarCategoryManager.vue'
import SidebarTagManager from '@/components/SidebarTagManager.vue'
import TagManager from '@/components/TagManager.vue'
import TaskDetailsDrawer from '@/components/TaskDetailsDrawer.vue'
import { useTorrentStore } from '@/store/torrent'
import { ElMessage } from 'element-plus'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const torrentStore = useTorrentStore()
const sidebarCollapsed = ref(false)

// Dynamic spacing and dimension calculation
const dynamicGap = ref(4);
const dynamicMinWidth = ref(75);

// Update dynamic spacing method
const updateDynamicSizes = () => {
  // Get current page zoom factor
  const zoomFactor = window.devicePixelRatio || 1;
  
  // Calculate scaled gap based on zoom
  const baseGap = 4;
  const adjustedGap = Math.max(2, Math.min(10, baseGap / zoomFactor));
  dynamicGap.value = adjustedGap;

  // Adjust minimum width based on window width
  const baseMinWidth = 70;
  const widthAdjustment = Math.min(window.innerWidth / 120, 25);
  dynamicMinWidth.value = baseMinWidth + widthAdjustment;
};

// Page resize or scale change event handler
const handleResize = () => {
  updateDynamicSizes();
};

// Manager dialogs
const showCategoryManager = ref(false)
const showTagManager = ref(false)
const showAddTaskDialog = ref(false)
const selectedCategory = ref('')

// Task details drawer
const showTaskDetailsDrawer = ref(false)
const selectedTorrentForDetails = ref(null)

// Fetch data on component mount and set up dynamic sizing
onMounted(async () => {
  await torrentStore.fetchCategories()
  await torrentStore.fetchTags()
  await torrentStore.fetchPreferences() // 获取全局偏好设置，包括限速信息

  // Initialize dynamic spacing
  updateDynamicSizes();

  // Listen for window resize events
  window.addEventListener('resize', handleResize);

  // Additionally, listen for potential zoom changes
  window.addEventListener('load', updateDynamicSizes);
  
  // On browsers that support it, use ResizeObserver to detect zoom changes
  if (window.ResizeObserver) {
    const scaleDetector = document.createElement('div');
    scaleDetector.style.cssText = `
      position: fixed;
      left: -100%;
      top: -100%;
      width: 100vw;
      height: 100vh;
      visibility: hidden;
      pointer-events: none;
    `;
    document.body.appendChild(scaleDetector);
    
    const resizeObserver = new ResizeObserver(() => {
      updateDynamicSizes();
    });
    
    resizeObserver.observe(scaleDetector);
    
    // Store reference for cleanup
    window.scaleDetector = scaleDetector;
    window.scaleResizeObserver = resizeObserver;
  }
})

// Clean up event listeners when component is unmounted
onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  
  // Clean up resize observer if it exists
  if (window.scaleResizeObserver) {
    window.scaleResizeObserver.disconnect();
    if (window.scaleDetector) {
      document.body.removeChild(window.scaleDetector);
    }
    window.scaleDetector = null;
    window.scaleResizeObserver = null;
  }
})

// Computed property for current filter
const currentFilter = computed(() => {
  const query = route.query
  return query.category || query.tag || null
})

// Filter handling functions
const filterByCategory = (category) => {
  router.push(`/torrents/all?category=${encodeURIComponent(category)}`)
}

const filterByTag = (tag) => {
  router.push(`/torrents/all?tag=${encodeURIComponent(tag)}`)
}

// Category manager confirm handler
const handleCategoryManagerConfirm = async ({ category, isNew }) => {
  try {
    if (isNew) {
      const created = await torrentStore.addCategory(category)
      if (!created) {
        ElMessage.error('无法创建新分类')
        return
      }
    }
    ElMessage.success('分类设置成功')
    showCategoryManager.value = false
  } catch (error) {
    console.error('Failed to manage category:', error)
    ElMessage.error('分类设置失败：' + error.message)
  }
}

const currentPageTitle = computed(() => {
  const path = route.path
  if (path.includes('torrents')) return '任务列表'
  if (path.includes('categories')) return '分类管理'
  if (path.includes('settings')) return '系统设置'
  return '仪表盘'
})

// Global stats for header
const globalStats = computed(() => ({
  downloadSpeed: torrentStore.totalDownloadSpeed,
  uploadSpeed: torrentStore.totalUploadSpeed,
  totalDownloaded: torrentStore.totalDownloaded,
  totalUploaded: torrentStore.totalUploaded,
  dhtNodes: torrentStore.serverState?.dht_nodes || 0,
  downloadLimit: torrentStore.serverState?.dl_rate_limit || torrentStore.preferences?.dl_limit || 0,
  uploadLimit: torrentStore.serverState?.up_rate_limit || torrentStore.preferences?.up_limit || 0
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
  showAddTaskDialog.value = true
}

const handleLogout = async () => {
  try {
    await qbittorrentAPI.logout()
    ElMessage.success('已退出登录')
    router.push('/login')
  } catch (error) {
    console.error('Logout failed:', error)
    ElMessage.error('退出登录失败')
  }
}
</script>

<style scoped>
/* Add the nav-item-active class for active navigation items */
:deep(.nav-item-active) {
  @apply bg-gradient-to-r from-[var(--bg-active)] to-transparent text-[var(--accent-cyan)];
  border-left: 3px solid var(--accent-cyan);
  box-shadow: inset 0 0 20px rgba(2, 132, 199, 0.1);
}

/* Navigation hover effect */
:deep(.group:hover) {
  @apply bg-[var(--bg-sidebar-hover)] text-[var(--text-primary)];
  transform: translateX(4px);
}
</style>
