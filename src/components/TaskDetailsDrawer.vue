<template>
  <Teleport to="body">
    <Transition name="drawer-fade">
      <div v-if="visible" class="fixed inset-0 z-[1000] overflow-hidden" @click="closeDrawer">
        <div class="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
        <div 
          class="absolute top-0 right-0 h-full w-[700px] bg-[var(--bg-card)] border-l border-[var(--border-color)] shadow-2xl z-10 overflow-y-auto"
          @click.stop
        >
          <!-- Header -->
          <div class="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-[var(--border-color)] bg-gradient-to-b from-[var(--bg-card)] to-[var(--bg-base)]">
            <h3 class="text-lg font-semibold text-[var(--text-primary)] m-0">任务详情</h3>
            <button 
              class="bg-[var(--bg-base)] border border-[var(--border-color)] text-[var(--text-muted)] cursor-pointer p-1.5 rounded-lg w-8 h-8 flex items-center justify-center transition-all duration-200 flex-shrink-0 hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] hover:border-[var(--accent-cyan-light)]"
              @click="closeDrawer"
            >
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <!-- Tabs -->
          <div class="flex border-b border-[var(--border-color)] bg-[var(--bg-base)] sticky top-[66px] z-10">
            <button
              v-for="tab in tabs"
              :key="tab.key"
              :class="[
                'px-4 py-3 font-medium text-sm transition-colors duration-200 whitespace-nowrap',
                activeTab === tab.key 
                  ? 'text-[var(--accent-cyan)] border-b-2 border-[var(--accent-cyan)] bg-[var(--bg-card)]' 
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              ]"
              @click="activeTab = tab.key"
            >
              {{ tab.title }}
            </button>
          </div>

          <!-- Tab Content -->
          <div class="p-6 overflow-y-auto max-h-[calc(100vh-132px)]">
            <!-- Task Details Tab -->
            <div v-if="activeTab === 'details'" class="space-y-6">
              <div v-if="torrent" class="space-y-4">
                <div class="border-b border-[var(--border-color)] pb-4 mb-4">
                  <h4 class="text-base font-semibold text-[var(--text-primary)] mb-3 flex items-center">
                    <span class="w-1 h-5 bg-[var(--accent-cyan)] rounded-r mr-2"></span>
                    基本信息
                  </h4>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-xs text-[var(--text-muted)] mb-1">名称</label>
                      <p class="text-[var(--text-sm)] text-[var(--text-primary)] break-all">{{ torrent.name }}</p>
                    </div>
                    <div>
                      <label class="block text-xs text-[var(--text-muted)] mb-1">状态</label>
                      <span 
                        class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                        :class="getStatusBadgeClass(currentTorrent.state || torrent.state || torrent.status)"
                      >
                        {{ getStatusText(currentTorrent.state || torrent.state || torrent.status) }}
                      </span>
                    </div>
                    <div>
                      <label class="block text-xs text-[var(--text-muted)] mb-1">大小</label>
                      <p class="text-[var(--text-sm)] text-[var(--text-primary)]">{{ formatSize(currentTorrent.size || torrent.size) }}</p>
                    </div>
                    <div>
                      <label class="block text-xs text-[var(--text-muted)] mb-1">进度</label>
                      <p class="text-[var(--text-sm)] text-[var(--text-primary)]">{{ Math.round((currentTorrent.progress || torrent.progress || 0) * 100) }}%</p>
                    </div>
                    <div>
                      <label class="block text-xs text-[var(--text-muted)] mb-1">分类</label>
                      <div v-if="currentTorrent.category || torrent.category" class="mt-1">
                        <span 
                          class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                          :style="getCategoryStyle(currentTorrent.category || torrent.category)"
                        >
                          {{ currentTorrent.category || torrent.category }}
                        </span>
                      </div>
                      <p v-else class="text-[var(--text-sm)] text-[var(--text-primary)]">未分类</p>
                    </div>
                    <div>
                      <label class="block text-xs text-[var(--text-muted)] mb-1">标签</label>
                      <div class="flex flex-wrap gap-1 mt-1">
                        <span 
                          v-for="tag in ((currentTorrent.tags || torrent.tags || '').split(',').filter(t => t.trim()))" 
                          :key="tag"
                          class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                          :style="getTagStyle(tag.trim())"
                        >
                          {{ tag.trim() }}
                        </span>
                        <span v-if="!((currentTorrent.tags || torrent.tags || '').split(',').filter(t => t.trim()).length)" class="text-[var(--text-sm)] text-[var(--text-muted)]">无标签</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="border-b border-[var(--border-color)] pb-4 mb-4">
                  <h4 class="text-base font-semibold text-[var(--text-primary)] mb-3 flex items-center">
                    <span class="w-1 h-5 bg-[var(--speed-upload)] rounded-r mr-2"></span>
                    传输信息
                  </h4>
                  <div class="grid grid-cols-3 gap-4">
                    <div>
                      <label class="block text-xs text-[var(--text-muted)] mb-1">下载速度</label>
                      <p class="text-[var(--text-sm)] text-[var(--status-success)] font-mono">{{ formatSpeed(currentTorrent.dlspeed || torrent.dlspeed) }}</p>
                    </div>
                    <div>
                      <label class="block text-xs text-[var(--text-muted)] mb-1">上传速度</label>
                      <p class="text-[var(--text-sm)] text-[var(--speed-upload)] font-mono">{{ formatSpeed(currentTorrent.upspeed || torrent.upspeed) }}</p>
                    </div>
                    <div>
                      <label class="block text-xs text-[var(--text-muted)] mb-1">分享率</label>
                      <p class="text-[var(--text-sm)] text-[var(--text-primary)] font-mono">{{ ((currentTorrent.ratio || torrent.ratio || 0)).toFixed(2) }}</p>
                    </div>
                    <div>
                      <label class="block text-xs text-[var(--text-muted)] mb-1">种子数</label>
                      <p class="text-[var(--text-sm)] text-[var(--text-primary)]">{{ currentTorrent.num_seeds || torrent.num_seeds || 0 }}</p>
                    </div>
                    <div>
                      <label class="block text-xs text-[var(--text-muted)] mb-1">下载者</label>
                      <p class="text-[var(--text-sm)] text-[var(--text-primary)]">{{ currentTorrent.num_leechs || torrent.num_leechs || 0 }}</p>
                    </div>
                    <div>
                      <label class="block text-xs text-[var(--text-muted)] mb-1">ETA</label>
                      <p class="text-[var(--text-sm)] text-[var(--text-primary)] font-mono">{{ calculateETA(currentTorrent || torrent) }}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-base font-semibold text-[var(--text-primary)] mb-3 flex items-center">
                    <span class="w-1 h-5 bg-[var(--status-success)] rounded-r mr-2"></span>
                    路径信息
                  </h4>
                  <div class="space-y-2">
                    <div>
                      <label class="block text-xs text-[var(--text-muted)] mb-1">保存路径</label>
                      <p class="text-[var(--text-sm)] text-[var(--text-primary)] break-all font-mono text-sm bg-[var(--bg-base)] p-2 rounded">{{ currentTorrent.save_path || torrent.save_path || '默认路径' }}</p>
                    </div>
                    <div>
                      <label class="block text-xs text-[var(--text-muted)] mb-1">内容路径</label>
                      <p class="text-[var(--text-sm)] text-[var(--text-primary)] break-all font-mono text-sm bg-[var(--bg-base)] p-2 rounded">{{ currentTorrent.content_path || torrent.content_path || 'N/A' }}</p>
                    </div>
                    <div>
                      <label class="block text-xs text-[var(--text-muted)] mb-1">根目录</label>
                      <p class="text-[var(--text-sm)] text-[var(--text-primary)] break-all font-mono text-sm bg-[var(--bg-base)] p-2 rounded">{{ currentTorrent.root_path || torrent.root_path || 'N/A' }}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-10 text-[var(--text-muted)]">
                <p>暂无任务信息</p>
              </div>
            </div>

            <!-- Files Directory Tab -->
            <div v-if="activeTab === 'files'" class="space-y-4">
              <div v-if="isLoadingFiles" class="text-center py-10 text-[var(--text-muted)]">
                <p>加载文件信息...</p>
              </div>
              <div v-else-if="torrentFiles.length > 0">
                <div class="grid grid-cols-12 gap-2 text-xs text-[var(--text-secondary)] font-medium border-b border-[var(--border-color)] pb-2">
                  <div class="col-span-6">文件名</div>
                  <div class="col-span-2 text-right">大小</div>
                  <div class="col-span-2 text-right">进度</div>
                  <div class="col-span-2 text-right">优先级</div>
                </div>
                <div 
                  v-for="file in torrentFiles" 
                  :key="file.index"
                  class="grid grid-cols-12 gap-2 py-2 border-b border-[var(--border-color)] last:border-0 items-center text-sm"
                >
                  <div class="col-span-6 truncate" :title="file.name">
                    <span class="mr-2">📄</span>
                    {{ file.name }}
                  </div>
                  <div class="col-span-2 text-right text-[var(--text-primary)] font-mono text-xs">
                    {{ formatSize(file.size) }}
                  </div>
                  <div class="col-span-2 text-right">
                    <div class="w-full bg-[var(--bg-base)] rounded-full h-1.5">
                      <div 
                        class="h-1.5 rounded-full" 
                        :style="{ width: (file.progress || 0) * 100 + '%', backgroundColor: 'var(--accent-cyan)' }"
                      ></div>
                    </div>
                    <div class="text-xs text-[var(--text-muted)] text-right mt-1">{{ Math.round((file.progress || 0) * 100) }}%</div>
                  </div>
                  <div class="col-span-2 text-right">
                    <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium" :class="getPriorityClass(file.priority)">
                      {{ getPriorityLabel(file.priority) }}
                    </span>
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-10 text-[var(--text-muted)]">
                <p>暂无文件信息</p>
              </div>
            </div>

            <!-- Peers List Tab -->
            <div v-if="activeTab === 'peers'" class="space-y-4">
              <div v-if="isLoadingPeers" class="text-center py-10 text-[var(--text-muted)]">
                <p>加载对等节点信息...</p>
              </div>
              <div v-else-if="peers.length > 0">
                <div class="flex justify-between items-center mb-3">
                  <span class="text-[var(--text-sm)] text-[var(--text-secondary)]">共 {{ peers.length }} 个对等节点</span>
                </div>
                <div class="grid grid-cols-12 gap-2 text-xs text-[var(--text-secondary)] font-medium border-b border-[var(--border-color)] pb-2">
                  <div class="col-span-4">IP 地址</div>
                  <div class="col-span-2">客户端</div>
                  <div class="col-span-1">标志</div>
                  <div class="col-span-2 text-right">下载速度</div>
                  <div class="col-span-2 text-right">上传速度</div>
                  <div class="col-span-1 text-right">进度</div>
                </div>
                <div 
                  v-for="peer in peers" 
                  :key="`${peer.ip}:${peer.port}`"
                  class="grid grid-cols-12 gap-2 py-2 border-b border-[var(--border-color)] last:border-0 items-center text-sm"
                >
                  <div class="col-span-4">
                    <span class="font-mono">{{ peer.ip }}:{{ peer.port }}</span>
                    <span v-if="peer.country" class="ml-1 text-[var(--text-xs)] text-[var(--text-muted)]">{{ peer.country }}</span>
                  </div>
                  <div class="col-span-2 text-[var(--text-primary)] truncate" :title="peer.client">
                    {{ peer.client }}
                  </div>
                  <div class="col-span-1 text-center">
                    <span 
                      :class="[
                        'inline-flex items-center justify-center w-6 h-6 rounded-full text-[9px]',
                        peer.flags.includes('O') ? 'bg-[var(--status-warning)] text-white' : 
                        peer.flags.includes('U') ? 'bg-[var(--status-success)] text-white' : 
                        peer.flags.includes('I') ? 'bg-[var(--accent-cyan)] text-white' : 
                        'bg-[var(--bg-hover)] text-[var(--text-muted)]'
                      ]"
                      :title="getFlagTooltip(peer.flags)"
                    >
                      {{ peer.flags.replace(' ', '').substring(0, 2) }}
                    </span>
                  </div>
                  <div class="col-span-2 text-right text-[var(--status-success)] font-mono text-xs">
                    {{ formatSpeed(peer.dl_speed) }}
                  </div>
                  <div class="col-span-2 text-right text-[var(--speed-upload)] font-mono text-xs">
                    {{ formatSpeed(peer.up_speed) }}
                  </div>
                  <div class="col-span-1 text-right text-[var(--text-primary)] text-xs">
                    {{ Math.round((peer.progress || peer.completed || 0) * 100) }}%
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-10 text-[var(--text-muted)]">
                <p>暂无对等节点信息</p>
              </div>
            </div>

            <!-- Trackers List Tab -->
            <div v-if="activeTab === 'trackers'" class="space-y-4">
              <div v-if="trackers.length > 0">
                <div class="grid grid-cols-12 gap-2 text-xs text-[var(--text-secondary)] font-medium border-b border-[var(--border-color)] pb-2">
                  <div class="col-span-5">URL</div>
                  <div class="col-span-2">状态</div>
                  <div class="col-span-2">消息</div>
                  <div class="col-span-1">种子数</div>
                  <div class="col-span-2">上次更新</div>
                </div>
                <div 
                  v-for="tracker in trackers" 
                  :key="tracker.url"
                  class="grid grid-cols-12 gap-2 py-2 border-b border-[var(--border-color)] last:border-0 items-center text-sm"
                >
                  <div class="col-span-5 truncate" :title="tracker.url">
                    <span class="font-mono text-xs">{{ tracker.url }}</span>
                  </div>
                  <div class="col-span-2">
                    <span 
                      class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                      :class="getTrackerStatusClass(tracker.status)"
                    >
                      {{ getTrackerStatusText(tracker.status) }}
                    </span>
                  </div>
                  <div class="col-span-2 truncate" :title="tracker.msg">
                    <span v-if="tracker.msg" class="text-xs text-[var(--text-secondary)]">{{ tracker.msg }}</span>
                    <span v-else class="text-xs text-[var(--text-muted)]">-</span>
                  </div>
                  <div class="col-span-1 text-right text-[var(--text-primary)]">
                    {{ tracker.num_seeds || '-' }}
                  </div>
                  <div class="col-span-2 text-right text-[var(--text-muted)] text-xs">
                    {{ tracker.last_announce || '-' }}
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-10 text-[var(--text-muted)]">
                <p>暂无追踪器信息</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue';
import { useTorrentStore } from '@/store/torrent';
import { ElMessage } from 'element-plus';

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  torrent: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['update:visible', 'close']);

const torrentStore = useTorrentStore();
const activeTab = ref('details');
const currentTorrent = ref({});
const isLoadingFiles = ref(false);

// Tabs configuration
const tabs = [
  { key: 'details', title: '任务详情' },
  { key: 'files', title: '文件目录' },
  { key: 'peers', title: '对等节点' },
  { key: 'trackers', title: '追踪器' }
];

// Fetch real file data from API
const torrentFiles = ref([]);

// Default tracker data
const defaultTrackers = [
  { url: 'http://bttracker.debian.org:6969/announce', status: 2, num_seeds: 156, msg: '', last_announce: '2023-01-01 12:00:00' },
  { url: 'udp://explodie.org:6969', status: 2, num_seeds: 89, msg: '', last_announce: '2023-01-01 11:55:00' },
  { url: 'udp://tracker.coppersurfer.tk:6969', status: 1, num_seeds: 0, msg: '正在连接...', last_announce: 'N/A' }
];

const trackers = ref(defaultTrackers);

// Peers data
const peersData = ref({ peers: {} });
const peersRid = ref(0);
const isLoadingPeers = ref(false);

// Peers polling interval - declare before use
const peersPollingIntervalRef = ref(null);

// Fetch peers data from API
const fetchPeersData = async () => {
  if (!props.torrent?.hash) return;
  
  isLoadingPeers.value = true;
  try {
    const data = await torrentStore.api.getTorrentPeers(props.torrent.hash, peersRid.value);
    if (data) {
      if (data.full_update) {
        peersData.value = data;
      } else {
        // Incremental update
        if (data.peers) {
          Object.keys(data.peers).forEach(peerId => {
            if (data.peers[peerId] === null) {
              delete peersData.value.peers[peerId];
            } else {
              peersData.value.peers[peerId] = {
                ...peersData.value.peers[peerId],
                ...data.peers[peerId]
              };
            }
          });
        }
      }
      if (data.rid !== undefined) {
        peersRid.value = data.rid;
      }
    }
  } catch (error) {
    console.error('Failed to fetch peers data:', error);
  } finally {
    isLoadingPeers.value = false;
  }
};

const peers = computed(() => {
  if (!peersData.value.peers) return [];
  
  // Convert peers object to array
  return Object.values(peersData.value.peers).map(peer => ({
    ip: peer.ip || '',
    port: peer.port || 0,
    client: peer.client || '',
    flags: peer.flags || '',
    dl_speed: peer.dl_speed || 0,
    up_speed: peer.up_speed || 0,
    progress: peer.progress || 0,
    completed: peer.completed || 0,
    country: peer.country || '',
    relevance: peer.relevance || 0
  }));
});

// Function to fetch detailed data for the current torrent
const fetchTorrentDetails = async () => {
  if (props.torrent?.hash) {
    isLoadingFiles.value = true;
    try {
      // Fetch all detailed information for the torrent
      const [filesData, trackersData, webSeedsData] = await Promise.all([
        torrentStore.api.getTorrentFiles(props.torrent.hash),
        torrentStore.api.getTorrentTrackers(props.torrent.hash),
        torrentStore.api.getTorrentWebSeeds(props.torrent.hash)
      ]);
      
      torrentFiles.value = filesData || [];
      trackers.value = trackersData || [];
      // Note: webSeeds could also be stored if needed
      
      // Update properties in currentTorrent as well
      const properties = await torrentStore.api.getTorrentProperties(props.torrent.hash);
      currentTorrent.value = { 
        ...props.torrent, 
        ...properties,
        state: props.torrent.state || props.torrent.status // Preserve state from original torrent
      };
    } catch (error) {
      console.error('Failed to fetch torrent details:', error);
      // Fallback to empty arrays if API calls fail
      torrentFiles.value = [];
      trackers.value = [];
    } finally {
      isLoadingFiles.value = false;
    }
  } else {
    torrentFiles.value = [];
    trackers.value = [];
  }
};

// Watch for changes in the torrent property to fetch new file data
watch(() => props.torrent?.hash, () => {
  fetchTorrentDetails();
}, { immediate: true });

// Watch for torrent data changes in store to update currentTorrent in real-time
watch(() => torrentStore.torrents, () => {
  if (props.torrent?.hash && props.visible) {
    const updatedTorrent = torrentStore.torrents.find(
      t => (t.infohash_v1 || t.hash) === props.torrent.hash
    );
    if (updatedTorrent) {
      currentTorrent.value = {
        ...currentTorrent.value,
        ...updatedTorrent,
        state: updatedTorrent.state || props.torrent.state || props.torrent.status
      };
    }
  }
}, { deep: true });

// Watch for tab changes to update files and peers when switching tabs
watch(() => activeTab.value, (newTab) => {
  if (newTab === 'files' && props.torrent?.hash) {
    setTimeout(() => {
      if (props.visible && activeTab.value === 'files') { // 确保抽屉可见且仍是当前标签
        fetchTorrentDetails();
      }
    }, 100);
  }
  if (newTab === 'peers' && props.torrent?.hash) {
    setTimeout(() => {
      if (props.visible && activeTab.value === 'peers') { // 确保抽屉可见且仍是当前标签
        fetchPeersData();
      }
    }, 100);
  }
});

// Watch for visibility changes to initialize torrent data and reset peers
watch(() => props.visible, (newVisible) => {
  if (newVisible && props.torrent) {
    // Initialize with current data and fetch detailed info
    currentTorrent.value = { ...props.torrent };
    // 延迟执行 fetchDetailedTorrentInfo 以确保组件完全渲染后再获取数据
    setTimeout(() => {
      if (props.visible) { // 确保抽屉仍然可见
        fetchDetailedTorrentInfo(); // Fetch detailed info when drawer opens
      }
    }, 100);
    // Reset active tab
    activeTab.value = 'details';
  } else {
    // Clear peers polling when closing
    if (peersPollingIntervalRef.value) {
      clearInterval(peersPollingIntervalRef.value);
      peersPollingIntervalRef.value = null;
    }
    // Reset peers data when closing
    peersRid.value = 0;
    peersData.value = { peers: {} };
  }
}, { immediate: true });

// Poll peers data when peers tab is active
watch(() => [props.visible, activeTab.value, props.torrent?.hash], ([isVisible, tab, hash]) => {
  // Clear existing polling
  if (peersPollingIntervalRef.value) {
    clearInterval(peersPollingIntervalRef.value);
    peersPollingIntervalRef.value = null;
  }
  
  // Start polling if visible, peers tab is active, and we have a torrent hash
  if (isVisible && tab === 'peers' && hash) {
    // 使用延迟执行，确保组件处于正确的状态
    setTimeout(() => {
      if (props.visible && activeTab.value === 'peers' && props.torrent?.hash) {
        // Fetch immediately
        fetchPeersData();
        // Then poll every 2 seconds
        peersPollingIntervalRef.value = setInterval(fetchPeersData, 2000);
      }
    }, 100);
  }
}, { immediate: true });

// Close the drawer
const closeDrawer = () => {
  // Clear peers polling interval
  if (peersPollingIntervalRef.value) {
    clearInterval(peersPollingIntervalRef.value);
    peersPollingIntervalRef.value = null;
  }
  emit('update:visible', false);
  emit('close');
};

// Cleanup on component unmount
onUnmounted(() => {
  // Clear peers polling interval
  if (peersPollingIntervalRef.value) {
    clearInterval(peersPollingIntervalRef.value);
  }
  // Also clear on unmount to prevent memory leaks
  if (peersPollingIntervalRef.value) {
    clearInterval(peersPollingIntervalRef.value);
    peersPollingIntervalRef.value = null;
  }
});

// Helper functions
const formatSize = (bytes) => {
  if (bytes === undefined || bytes === null) return 'N/A';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
};

const formatSpeed = (bytes) => {
  if (bytes === 0) return '0 B/s';
  if (bytes === undefined || bytes === null) return '0 B/s';
  if (bytes < 1024) return bytes + ' B/s';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB/s';
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB/s';
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB/s';
};

const calculateETA = (torrent) => {
  if (!torrent || !torrent.progress || torrent.progress >= 1) return '完成';
  if (!torrent.dlspeed || torrent.dlspeed <= 0) return '∞';
  
  const remainingSize = torrent.size * (1 - torrent.progress);
  const etaSeconds = remainingSize / torrent.dlspeed;
  
  if (etaSeconds < 0) return '∞';
  if (etaSeconds < 60) return '< 1分钟';
  if (etaSeconds < 3600) return `${Math.floor(etaSeconds / 60)}分钟`;
  if (etaSeconds < 86400) return `${Math.floor(etaSeconds / 3600)}小时`;
  
  return `${Math.floor(etaSeconds / 86400)}天`;
};

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
    'metaDL': '获取元备数据',
    'error': '错误',
    'missingFiles': '文件丢失',
    'moving': '移动中',
    'unknown': '未知'
  };
  return statusMap[state] || state;
};

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'downloading':
    case 'Downloading':
    case '正在下载':
      return 'bg-[rgba(2,132,199,0.15)] text-[var(--accent-cyan)] border border-[rgba(2,132,199,0.3)]';
    case 'seeding':
    case 'Seeding':
    case '做种中':
      return 'bg-[rgba(16,185,129,0.15)] text-[var(--status-success)] border border-[rgba(16,185,129,0.3)]';
    case 'completed':
    case 'Completed':
    case '已完成':
      return 'bg-[rgba(16,185,129,0.15)] text-[var(--status-success)] border border-[rgba(16,185,129,0.3)]';
    case 'paused':
    case 'Paused':
    case '已暂停':
      return 'bg-[rgba(148,163,184,0.15)] text-[var(--text-secondary)] border border-[rgba(148,163,184,0.3)]';
    case 'error':
    case 'Error':
    case '错误':
      return 'bg-[rgba(239,68,68,0.15)] text-[var(--status-error)] border border-[rgba(239,68,68,0.3)]';
    case 'queued':
    case 'Queued':
    case '排队中':
      return 'bg-[rgba(245,158,11,0.15)] text-[var(--status-warning)] border border-[rgba(245,158,11,0.3)]';
    case 'checking':
    case 'Checking':
    case '检查中':
      return 'bg-[rgba(139,92,246,0.15)] text-[var(--accent-purple)] border border-[rgba(139,92,246,0.3)]';
    default:
      return 'bg-[rgba(59,130,246,0.15)] text-[var(--status-info)] border border-[rgba(59,130,246,0.3)]';
  }
};

const getPriorityClass = (priority) => {
  switch (priority) {
    case 7: // Maximal
      return 'bg-[var(--status-success)] text-white';
    case 6: // High
      return 'bg-[var(--status-warning)] text-[var(--text-primary)]';
    case 1: // Normal
      return 'bg-[var(--bg-hover)] text-[var(--text-primary)]';
    case 0: // Disabled
      return 'bg-[var(--text-muted)] text-white';
    default:
      return 'bg-[var(--bg-hover)] text-[var(--text-primary)]';
  }
};

const getPriorityLabel = (priority) => {
  switch (priority) {
    case 7: return '最高';
    case 6: return '高';
    case 1: return '普通';
    case 0: return '不下载';
    default: return '普通';
  }
};

const getTrackerStatusClass = (status) => {
  switch (status) {
    case 2: // Working
      return 'bg-[var(--status-success)] text-white';
    case 1: // Updating
      return 'bg-[var(--status-warning)] text-[var(--text-primary)]';
    case 0: // Disabled
      return 'bg-[var(--text-muted)] text-white';
    case 4: // Not working
      return 'bg-[var(--status-error)] text-white';
    default:
      return 'bg-[var(--bg-hover)] text-[var(--text-primary)]';
  }
};

const getTrackerStatusText = (status) => {
  switch (status) {
    case 2: return '正常';
    case 1: return '更新中';
    case 0: return '禁用';
    case 4: return '异常';
    default: return '未知';
  }
};

const getFlagTooltip = (flags) => {
  const meanings = {
    'H': 'Handshaking',
    'U': 'Uploading',
    'D': 'Downloading',
    'O': 'Choked',
    'I': 'Interested',
    'K': 'Kick Initiated',
    'E': 'UTP connection',
    '?': 'Unknown',
    'X': 'Peer snubbed',
    '!': 'Unwanted'
  };
  return flags.split('').map(f => meanings[f] || f).join(', ');
};

const getCategoryStyle = (categoryName) => {
  // Generate consistent color based on category name
  const colors = [
    [34, 211, 238],   // Cyan
    [167, 139, 250],  // Purple
    [52, 211, 153],   // Green
    [251, 191, 36],   // Yellow
    [248, 113, 113],  // Red
    [96, 165, 250],   // Blue
  ];

  let hash = 0;
  for (let i = 0; i < categoryName.length; i++) {
    hash = categoryName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const [r, g, b] = colors[Math.abs(hash) % colors.length];

  return {
    backgroundColor: `rgba(${r}, ${g}, ${b}, 0.15)`,
    borderColor: `rgba(${r}, ${g}, ${b}, 0.3)`,
    color: `rgb(${r}, ${g}, ${b})`,
    border: '1px solid',
    borderRadius: '9999px',
    padding: '0.125rem 0.5rem',
    fontSize: '0.75rem',
    fontWeight: 500
  };
};

const getTagStyle = (tagName) => {
  // Generate consistent color based on tag name
  const colors = [
    [34, 211, 238],   // Cyan
    [167, 139, 250],  // Purple
    [52, 211, 153],   // Green
    [251, 191, 36],   // Yellow
    [248, 113, 113],  // Red
    [96, 165, 250],   // Blue
  ];

  let hash = 0;
  for (let i = 0; i < tagName.length; i++) {
    hash = tagName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const [r, g, b] = colors[Math.abs(hash) % colors.length];

  return {
    backgroundColor: `rgba(${r}, ${g}, ${b}, 0.15)`,
    borderColor: `rgba(${r}, ${g}, ${b}, 0.3)`,
    color: `rgb(${r}, ${g}, ${b})`,
    border: '1px solid',
    borderRadius: '9999px',
    padding: '0.125rem 0.5rem',
    fontSize: '0.75rem',
    fontWeight: 500
  };
};
</script>

<style scoped>
.drawer-fade-enter-active,
.drawer-fade-leave-active {
  transition: opacity 0.2s ease;
}

.drawer-fade-enter-from,
.drawer-fade-leave-to {
  opacity: 0;
}
</style>