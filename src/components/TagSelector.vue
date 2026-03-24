<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div 
        v-if="visible" 
        class="tag-selector-overlay" 
        @click="handleOverlayClick"
      >
        <div 
          class="tag-selector-modal" 
          @click.stop 
          @keydown="handleKeyDown" 
          tabindex="0"
          ref="modalRef"
        >
          <!-- Header -->
          <div class="modal-header">
            <div class="modal-title">
              <svg class="modal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                <line x1="7" y1="7" x2="7.01" y2="7"></line>
              </svg>
              <h3>添加标签</h3>
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
            <!-- Existing Tags with Checkboxes -->
            <div v-if="tags.length > 0" class="tags-section">
              <div class="tags-section-header">
                <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9 11 12 14 22 4"></polyline>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                </svg>
                <span>选择标签 (已选 {{ selectedTags.length }})</span>
              </div>
              <div class="selected-torrents-info" v-if="props.selectedTorrentsCount > 1">
                <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span>将为 {{ props.selectedTorrentsCount }} 个种子应用所选标签</span>
              </div>
              <div class="tags-checkbox-grid">
                <label 
                  v-for="tag in tags" 
                  :key="tag"
                  class="tag-checkbox-item"
                >
                  <input
                    type="checkbox"
                    :value="tag"
                    v-model="selectedTags"
                    class="tag-checkbox"
                  />
                  <span class="checkbox-label">{{ tag }}</span>
                  <svg class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </label>
              </div>
            </div>
            
            <!-- Add New Tag Section -->
            <div class="add-new-section">
              <div class="section-label">
                <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                <span>添加新标签</span>
              </div>
              <div class="input-wrapper">
                <input
                  v-model="newTag"
                  @keydown.enter="addNewTag"
                  placeholder="输入标签名称，按回车添加"
                  class="tag-input"
                  ref="inputRef"
                />
                <button 
                  @click="addNewTag" 
                  :disabled="!newTag.trim() || isLoading"
                  class="add-btn"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  <span>添加</span>
                </button>
              </div>
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
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                <line x1="7" y1="7" x2="7.01" y2="7"></line>
              </svg>
              <span>暂无标签，请在上方添加</span>
            </div>
          </div>
          
          <!-- Footer -->
          <div class="modal-footer">
            <el-button @click="close" class="btn btn-secondary">取消</el-button>
            <el-button 
              @click="confirmSelection" 
              class="btn btn-primary"
              :disabled="selectedTags.length === 0"
            >
              <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span v-if="props.selectedTorrentsCount > 1">批量确定 ({{ selectedTags.length }})</span>
              <span v-else>确定 ({{ selectedTags.length }})</span>
            </el-button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { useTorrentStore } from '@/store/torrent'

// Props
const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  visible: {
    type: Boolean,
    required: true
  },
  selectedTorrentsCount: {
    type: Number,
    default: 1
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'update:visible', 'confirm'])

// Store
const torrentStore = useTorrentStore()

// State
const selectedTags = ref([...props.modelValue])
const newTag = ref('')
const isLoading = ref(false)
const loadingText = ref('')
const modalRef = ref(null)
const inputRef = ref(null)

// Computed
const tags = computed(() => torrentStore.tags)

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
    selectedTags.value = []
    newTag.value = ''
  }
})

// Watch for modelValue changes
watch(() => props.modelValue, (newVal) => {
  selectedTags.value = [...newVal]
}, { immediate: true })

// Methods
const fetchTags = async () => {
  try {
    await torrentStore.fetchTags()
  } catch (err) {
    console.error('Failed to fetch tags:', err)
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

const confirmSelection = () => {
  emit('confirm', {
    tags: selectedTags.value
  })
  emit('update:visible', false)
  ElMessage.success(`已添加 ${selectedTags.value.length} 个标签`)
}

const handleOverlayClick = () => {
  if (!isLoading.value) {
    close()
  }
}

const close = () => {
  if (!isLoading.value) {
    emit('cancel')
    emit('update:visible', false)
  }
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
</script>

<style scoped>
/* Modal Overlay */
.tag-selector-overlay {
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
.tag-selector-modal {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  width: 520px;
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

/* Tags Section */
.tags-section {
  background: var(--bg-base);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 12px;
}

.tags-section-header {
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

.tags-checkbox-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 8px;
  max-height: 250px;
  overflow-y: auto;
  padding-right: 4px;
}

.tag-checkbox-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 8px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.tag-checkbox-item:hover {
  background: var(--bg-hover);
  border-color: var(--accent-magenta-light);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(236, 72, 153, 0.1);
}

.tag-checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: var(--accent-magenta);
  flex-shrink: 0;
}

.checkbox-label {
  flex: 1;
  font-size: var(--text-sm);
  color: var(--text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.check-icon {
  width: 16px;
  height: 16px;
  color: var(--accent-magenta);
  opacity: 0;
  transition: opacity 0.2s ease;
  flex-shrink: 0;
}

.tag-checkbox:checked + .checkbox-label + .check-icon {
  opacity: 1;
}

.tag-checkbox:checked + .checkbox-label {
  color: var(--accent-magenta);
  font-weight: 600;
}

/* Add New Section */
.add-new-section {
  background: var(--bg-base);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 12px;
}

.section-label {
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

.input-wrapper {
  display: flex;
  gap: 10px;
}

.tag-input {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background: var(--bg-card);
  color: var(--text-primary);
  font-size: var(--text-sm);
  outline: none;
  transition: all 0.2s ease;
}

.tag-input:focus {
  border-color: var(--accent-magenta);
  box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.2);
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

/* Selected Torrents Info */
.selected-torrents-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--bg-info);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  margin-top: 8px;
  font-size: var(--text-xs);
  color: var(--text-info);
}

.selected-torrents-info .info-icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

/* Selected Torrents Info */
.selected-torrents-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(59, 130, 246, 0.1); /* blue-500 with opacity */
  border: 1px solid var(--border-color);
  border-radius: 8px;
  margin-top: 8px;
  font-size: var(--text-xs);
  color: #3b82f6; /* blue-500 */
}

.selected-torrents-info .info-icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  color: #3b82f6; /* blue-500 */
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

.btn-primary {
  background: linear-gradient(135deg, var(--accent-magenta) 0%, var(--accent-magenta-dark) 100%) !important;
  color: white !important;
  border: none !important;
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3) !important;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.3) !important;
}

/* 确保按钮内的span和svg元素也使用正确的颜色 */
.btn-primary span,
.btn-primary svg {
  color: white !important;
  fill: white !important;
  stroke: white !important;
}

.btn-primary:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(236, 72, 153, 0.4);
}

.btn-icon {
  width: 16px;
  height: 16px;
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
html.dark .tag-selector-modal {
  background: var(--bg-panel);
}

html.dark .tags-section {
  background: var(--bg-base);
}

html.dark .tag-checkbox-item {
  background: var(--bg-card);
}
</style>
