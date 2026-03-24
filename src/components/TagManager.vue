<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div 
        v-if="visible" 
        class="tag-modal-overlay" 
        @click="handleOverlayClick"
      >
        <div 
          class="tag-modal" 
          @click.stop 
          @keydown="handleKeyDown" 
          tabindex="0"
          ref="modalRef"
        >
          <!-- Header -->
          <div class="modal-header">
            <div class="modal-title">
              <svg class="modal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M13.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7.5L13.5 2z"></path>
                <polyline points="11 2 15.5 6.5 20 2"></polyline>
              </svg>
              <h3>管理标签</h3>
            </div>
            <button @click="close" class="close-btn" aria-label="关闭">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <!-- Body -->
          <div class="modal-body">
            <!-- Tag Selection -->
            <div class="tag-selection">
              <div class="section-header">
                <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                  <line x1="7" y1="7" x2="7.01" y2="7"></line>
                </svg>
                <span>选择现有标签</span>
              </div>
              <el-checkbox-group v-model="selectedTags" class="tag-checkbox-group">
                <el-checkbox 
                  v-for="tag in availableTags" 
                  :key="tag"
                  :label="tag"
                  class="tag-checkbox-item"
                >
                  <span class="tag-name">{{ tag }}</span>
                </el-checkbox>
              </el-checkbox-group>
            </div>
            
            <!-- Create New Tag -->
            <div class="new-tag-section">
              <div class="section-header">
                <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="16"></line>
                  <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
                <span>创建新标签</span>
              </div>
              <div class="input-wrapper">
                <input
                  v-model="newTag"
                  @keydown.enter="addNewTag"
                  placeholder="输入新标签名称"
                  class="tag-input"
                  ref="inputRef"
                />
                <button 
                  v-if="newTag" 
                  @click="clearInput" 
                  class="clear-btn"
                  aria-label="清空输入"
                >
                  ×
                </button>
              </div>
              <button 
                @click="addNewTag" 
                :disabled="!newTag.trim() || isLoading"
                class="add-btn"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                <span>添加新标签</span>
              </button>
            </div>
            
            <!-- Loading State -->
            <div v-if="isLoading" class="loading-state">
              <svg class="loading-spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
                <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
              </svg>
              <span>{{ loadingText }}</span>
            </div>
            
            <!-- Empty State -->
            <div v-if="tags.length === 0 && !isLoading" class="empty-state">
              <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M13.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7.5L13.5 2z"></path>
                <polyline points="11 2 15.5 6.5 20 2"></polyline>
              </svg>
              <span>暂无标签，添加第一个标签吧</span>
            </div>
          </div>
          
          <!-- Footer -->
          <div class="modal-footer">
            <el-button @click="close" class="btn btn-secondary">关闭</el-button>
            <el-button 
              @click="applySelectedTags"
              class="btn btn-primary"
              :disabled="selectedTags.length === 0"
            >
              <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>应用标签 ({{ selectedTags.length }})</span>
            </el-button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useTorrentStore } from '@/store/torrent'

// Props
const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  }
})

// Emits
const emit = defineEmits(['update:visible', 'close'])

// Store
const torrentStore = useTorrentStore()

// State
const newTag = ref('')
const isLoading = ref(false)
const loadingText = ref('')
const modalRef = ref(null)
const inputRef = ref(null)
const selectedTags = ref([])

// Computed
const availableTags = computed(() => torrentStore.tags)

// Watch for visibility changes
watch(() => props.visible, (newVal) => {
  if (newVal) {
    nextTick(() => {
      if (inputRef.value) {
        inputRef.value.focus()
      }
    })
    fetchTags()
  } else {
    newTag.value = ''
    error.value = null
  }
})

// Methods
const fetchTags = async () => {
  try {
    await torrentStore.fetchTags()
  } catch (err) {
    console.error('Failed to fetch tags:', err)
  }
}

const clearInput = () => {
  newTag.value = ''
  if (inputRef.value) {
    inputRef.value.focus()
  }
}

const addNewTag = async () => {
  if (!newTag.value || !newTag.value.trim()) {
    ElMessage.warning('请输入标签名称')
    return
  }

  const tagName = newTag.value.trim()
  
  // Check if tag already exists
  if (tags.value.includes(tagName)) {
    ElMessage.warning('该标签已存在')
    return
  }

  try {
    isLoading.value = true
    loadingText.value = '正在创建标签...'
    
    const success = await torrentStore.addTag(tagName)
    if (success) {
      ElMessage.success('标签创建成功')
      newTag.value = ''
      await fetchTags()
    } else {
      ElMessage.error('标签创建失败')
    }
  } catch (error) {
    console.error('Failed to add tag:', error)
    ElMessage.error('标签创建失败：' + error.message)
  } finally {
    isLoading.value = false
    loadingText.value = ''
  }
}

const deleteTag = async (tag) => {
  try {
    isLoading.value = true
    loadingText.value = '正在删除标签...'
    
    const success = await torrentStore.removeTag(tag)
    if (success) {
      ElMessage.success('标签删除成功')
      await fetchTags()
    } else {
      ElMessage.error('标签删除失败')
    }
  } catch (error) {
    console.error('Failed to delete tag:', error)
    ElMessage.error('标签删除失败：' + error.message)
  } finally {
    isLoading.value = false
    loadingText.value = ''
  }
}

const handleOverlayClick = () => {
  if (!isLoading.value) {
    close()
  }
}

const close = () => {
  if (!isLoading.value) {
    emit('update:visible', false)
    emit('close')
  }
}

const applySelectedTags = () => {
  if (selectedTags.value.length === 0) {
    ElMessage.warning('请至少选择一个标签')
    return
  }
  
  // Emit the selected tags to the parent component (this is for multi-selection usage)
  emit('apply-tags', selectedTags.value)
  ElMessage.success(`已选择 ${selectedTags.value.length} 个标签`)
  close()
}

const handleKeyDown = (event) => {
  if (!props.visible) return
  
  switch (event.key) {
    case 'Escape':
      event.preventDefault()
      close()
      break
  }
}

onMounted(() => {
  if (props.visible) {
    fetchTags()
  }
})
</script>

<style scoped>
/* Modal Overlay */
.tag-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.4) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  backdrop-filter: blur(4px);
}

/* Modal Container */
.tag-modal {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  width: 480px;
  max-width: 90vw;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  animation: modalSlideUp 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transform-origin: bottom center;
}

@keyframes modalSlideUp {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Header */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px 16px;
  border-bottom: 1px solid var(--border-color);
  background: linear-gradient(135deg, var(--bg-card) 0%, var(--bg-base) 100%);
  border-radius: 16px 16px 0 0;
}

.modal-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: var(--text-lg);
  color: var(--text-primary);
  font-weight: 600;
}

.modal-icon {
  width: 20px;
  height: 20px;
  color: var(--accent-magenta);
}

.close-btn {
  background: var(--bg-base);
  border: 1px solid var(--border-color);
  color: var(--text-muted);
  cursor: pointer;
  padding: 6px;
  border-radius: 8px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.close-btn:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
  border-color: var(--accent-magenta-light);
  transform: rotate(90deg);
}

/* Body */
.modal-body {
  padding: 20px 24px;
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Tag Selection */
.tag-selection {
  background: var(--bg-base);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 12px;
  transition: all 0.2s ease;
}

.tag-selection:hover {
  border-color: var(--accent-magenta);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: var(--text-sm);
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
  font-weight: 600;
}

.section-icon {
  width: 14px;
  height: 14px;
  color: var(--accent-magenta);
}

.tag-checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.tag-checkbox-item {
  width: 100%;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid transparent;
  background: var(--bg-card);
  transition: all 0.15s ease;
  margin-bottom: 0;
}

.tag-checkbox-item:hover {
  background: var(--bg-hover);
  border-color: var(--accent-magenta-light);
  color: var(--accent-magenta);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(236, 72, 153, 0.1);
}

.tag-checkbox-item.is-checked {
  background: var(--accent-magenta-light);
  border-color: var(--accent-magenta);
  color: var(--accent-magenta-dark);
  font-weight: 500;
}

/* New Tag Section */
.new-tag-section {
  background: var(--bg-base);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 12px;
  margin-top: 12px;
  transition: all 0.2s ease;
}

.new-tag-section:hover {
  border-color: var(--accent-purple);
}

.input-wrapper {
  flex: 1;
  position: relative;
  margin-bottom: 10px;
}

.tag-input {
  width: 100%;
  padding: 10px 40px 10px 14px;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background: var(--bg-base);
  color: var(--text-primary);
  font-size: var(--text-sm);
  outline: none;
  transition: all 0.2s ease;
}

.tag-input:focus {
  border-color: var(--accent-magenta);
  box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.2);
}

.clear-btn {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
  font-size: 18px;
  line-height: 1;
}

.clear-btn:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  background: linear-gradient(135deg, var(--accent-magenta) 0%, var(--accent-magenta-dark) 100%);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 500;
  font-size: var(--text-sm);
  transition: all 0.2s ease;
  white-space: nowrap;
  width: 100%;
}

.add-btn:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
}

.add-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Loading State */
.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 20px;
  color: var(--text-secondary);
  font-size: var(--text-sm);
}

.loading-spinner {
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
  color: var(--accent-magenta);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 40px 20px;
  color: var(--text-muted);
}

.empty-icon {
  width: 48px;
  height: 48px;
  opacity: 0.5;
}

/* Footer */
.modal-footer {
  padding: 20px 24px;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  background: linear-gradient(135deg, var(--bg-base) 0%, var(--bg-card) 100%);
  border-radius: 0 0 16px 16px;
  margin-top: auto;
}

.btn {
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  border: 1px solid var(--border-color);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
  font-size: var(--text-sm);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: var(--bg-base);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--bg-hover);
  border-color: var(--accent-magenta-light);
  color: var(--accent-magenta);
}

/* Modal Fade Transition */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* Dark Mode Support */
html.dark .tag-modal {
  background: var(--bg-panel);
}

html.dark .tags-section {
  background: var(--bg-base);
}

html.dark .tag-item {
  background: var(--bg-card);
}
</style>
