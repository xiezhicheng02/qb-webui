<template>
  <Teleport to="body">
    <Transition name="menu-fade">
      <div 
        v-if="visible" 
        ref="contextMenuRef"
        class="fixed z-[9999] min-w-[180px] bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-[12px] p-1.5 animate-menuEnter"
        :style="{ left: x + 'px', top: y + 'px' }"
        @click.stop
      >
        <div class="flex flex-col gap-0.5">
          <!-- 开始/暂停 -->
          <div 
            v-if="torrent"
            class="flex items-center gap-2.5 px-2.5 py-2 rounded-md cursor-pointer transition-all duration-150 ease-in-out text-[13px] text-[var(--text-primary)] hover:bg-[var(--bg-hover)] hover:text-[var(--accent-cyan)]" 
            @click="handleAction(torrent.state === 'pausedUP' || torrent.state === 'pausedDL' ? 'resume' : 'pause')"
          >
            <svg class="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon v-if="torrent.state === 'pausedUP' || torrent.state === 'pausedDL'" points="5 3 19 12 5 21 5 3"></polygon>
              <template v-else>
                <rect x="6" y="4" width="4" height="16"></rect>
                <rect x="14" y="4" width="4" height="16"></rect>
              </template>
            </svg>
            <span>{{ torrent.state === 'pausedUP' || torrent.state === 'pausedDL' ? '开始' : '暂停' }}</span>
          </div>

          <!-- 设置下载限速 -->
          <div class="flex items-center gap-2.5 px-2.5 py-2 rounded-md cursor-pointer transition-all duration-150 ease-in-out text-[13px] text-[var(--text-primary)] hover:bg-[var(--bg-hover)] hover:text-[var(--accent-cyan)]" @click="handleAction('setDownloadLimit')">
            <svg class="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2v20m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            <span>设置下载限速</span>
          </div>

          <!-- 设置上传限速 -->
          <div class="flex items-center gap-2.5 px-2.5 py-2 rounded-md cursor-pointer transition-all duration-150 ease-in-out text-[13px] text-[var(--text-primary)] hover:bg-[var(--bg-hover)] hover:text-[var(--accent-cyan)]" @click="handleAction('setUploadLimit')">
            <svg class="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22V2m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            <span>设置上传限速</span>
          </div>

          <!-- 设置优先级 -->
          <div class="flex items-center gap-2.5 px-2.5 py-2 rounded-md cursor-pointer transition-all duration-150 ease-in-out text-[13px] text-[var(--text-primary)] hover:bg-[var(--bg-hover)] hover:text-[var(--accent-cyan)]" @click="handleAction('priority')">
            <svg class="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            <span>设置优先级</span>
          </div>

          <div class="h-px bg-[var(--border-color)] my-1"></div>

          <!-- 打开目录 -->
          <div class="flex items-center gap-2.5 px-2.5 py-2 rounded-md cursor-pointer transition-all duration-150 ease-in-out text-[13px] text-[var(--text-primary)] hover:bg-[var(--bg-hover)] hover:text-[var(--accent-cyan)]" @click="handleAction('openFolder')">
            <svg class="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
            </svg>
            <span>打开目录</span>
            <span class="ml-auto text-[11px] text-[var(--text-muted)]">复制路径</span>
          </div>

          <!-- 设置分类 -->
          <div class="relative flex items-center gap-2.5 px-2.5 py-2 rounded-md cursor-pointer transition-all duration-150 ease-in-out text-[13px] text-[var(--text-primary)] hover:bg-[var(--bg-hover)] hover:text-[var(--accent-cyan)]" @click="showCategorySubmenu = true">
            <svg class="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
              <line x1="12" y1="11" x2="12" y2="17"></line>
              <line x1="9" y1="14" x2="15" y2="14"></line>
            </svg>
            <span>设置分类</span>
            <svg class="w-3 h-3 absolute right-2.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M9 5l7 7-7 7"></path>
            </svg>
          </div>

          <!-- 分类选择弹窗 -->
          <CategorySelector
            v-model="selectedCategory"
            :visible="showCategorySubmenu"
            @update:visible="showCategorySubmenu = $event"
            @confirm="handleCategoryConfirm"
            @cancel="hideCategorySubmenu"
          />

          <!-- 标签选择弹窗 -->
          <TagSelector
            :visible="showTagSubmenu"
            :selected-torrents-count="selectedTorrentsCount"
            @update:visible="showTagSubmenu = $event"
            @confirm="handleTagSelection"
            @close="hideTagSubmenu"
          />

          <!-- 设置标签 -->
          <div class="flex items-center gap-2.5 px-2.5 py-2 rounded-md cursor-pointer transition-all duration-150 ease-in-out text-[13px] text-[var(--text-primary)] hover:bg-[var(--bg-hover)] hover:text-[var(--accent-cyan)]" @click="handleAction('manageTags')">
            <svg class="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
              <line x1="7" y1="7" x2="7.01" y2="7"></line>
            </svg>
            <span v-if="selectedTorrentsCount > 1">设置标签 ({{ selectedTorrentsCount }} 个种子)</span>
            <span v-else>设置标签</span>
          </div>

          <!-- 删除 -->
          <div class="flex items-center gap-2.5 px-2.5 py-2 rounded-md cursor-pointer transition-all duration-150 ease-in-out text-[13px] text-[var(--text-primary)] hover:bg-[rgba(248,113,113,0.1)] hover:text-[var(--status-error)]" @click="handleAction('delete')">
            <svg class="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            <span>删除</span>
          </div>

          <!-- 删除 + 文件 -->
          <div class="flex items-center gap-2.5 px-2.5 py-2 rounded-md cursor-pointer transition-all duration-150 ease-in-out text-[13px] text-[var(--text-primary)] hover:bg-[rgba(248,113,113,0.1)] hover:text-[var(--status-error)]" @click="handleAction('deleteWithFiles')">
            <svg class="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
            <span>删除 + 文件</span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useTorrentStore } from '@/store/torrent'
import CategorySelector from '@/components/CategorySelector.vue'
import TagSelector from '@/components/TagSelector.vue'

const props = defineProps({
  visible: Boolean,
  x: Number,
  y: Number,
  torrent: Object,
  selectedTorrents: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'action', 'tags-updated'])

const torrentStore = useTorrentStore()

const selectedTorrentsCount = computed(() => {
  return (props.selectedTorrents && props.selectedTorrents.length > 0) 
    ? props.selectedTorrents.length 
    : props.torrent ? 1 : 0
})

// 菜单状态
const close = () => {
  emit('close')
  hideCategorySubmenu()
}

const handleAction = (action) => {
  if (action === 'manageTags') {
    // For manageTags, we open the tag selector instead of emitting an action
    showTagSubmenu.value = true
  } else {
    emit('action', action, props.torrent)
    close()
  }
}

// 分类选择相关
const showCategorySubmenu = ref(false)
const selectedCategory = ref('')

const categories = computed(() => torrentStore.categories)

const hideCategorySubmenu = () => {
  showCategorySubmenu.value = false
  selectedCategory.value = ''
}

// 标签选择相关
const showTagSubmenu = ref(false)

const hideTagSubmenu = () => {
  showTagSubmenu.value = false
}

// 分类确认处理
const handleCategoryConfirm = async ({ category, isNew }) => {
  try {
    // 确定操作的种子哈希 - 使用 infohash_v1 字段
    const targetHashes = props.torrent ? [props.torrent.infohash_v1 || props.torrent.hash] : []
    
    if (targetHashes.length === 0) {
      ElMessage.warning('没有选中的种子')
      return
    }

    // 设置分类到种子（新分类已在 CategorySelector 组件中创建）
    const success = await torrentStore.setTorrentsCategory(targetHashes, category)
    if (success) {
      ElMessage.success('分类设置成功')
    }
    
    hideCategorySubmenu()
  } catch (error) {
    console.error('Failed to apply category:', error)
    ElMessage.error('分类设置失败：' + error.message)
  }
}

// 标签选择确认处理
const handleTagSelection = async (payload) => {
  try {
    // payload should be an object like { tags: [tag1, tag2, ...] }
    const selectedTags = payload.tags || []
    
    // Determine target hashes based on whether we're dealing with multiple torrents
    const targetHashes = props.selectedTorrents && props.selectedTorrents.length > 0 
      ? props.selectedTorrents 
      : props.torrent ? [props.torrent.infohash_v1 || props.torrent.hash] : []
    
    if (targetHashes.length === 0) {
      ElMessage.warning('没有选中的种子')
      return
    }

    if (selectedTags.length === 0) {
      ElMessage.warning('未选择任何标签')
      return
    }

    // Apply tags to torrents
    const success = await torrentStore.batchAddTags(targetHashes, selectedTags.join(','))
    if (success) {
      ElMessage.success(`标签设置成功，已为 ${targetHashes.length} 个种子添加 ${selectedTags.length} 个标签`)
      
      // 发出标签已更新事件，以便父组件刷新UI
      emit('tags-updated', { targetHashes, selectedTags })
    }
    
    hideTagSubmenu()
  } catch (error) {
    console.error('Failed to apply tags:', error)
    ElMessage.error('标签设置失败：' + error.message)
  }
}

// Click outside functionality
const contextMenuRef = ref(null)

const handleClickOutside = (event) => {
  if (contextMenuRef.value && !contextMenuRef.value.contains(event.target)) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
@keyframes menuEnter {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-menuEnter {
  animation: menuEnter 0.15s ease-out;
}

.menu-fade-enter-active,
.menu-fade-leave-active {
  transition: opacity 0.15s ease;
}

.menu-fade-enter-from,
.menu-fade-leave-to {
  opacity: 0;
}
</style>
