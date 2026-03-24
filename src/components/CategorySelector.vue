<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div 
        v-if="visible" 
        class="category-modal-overlay" 
        @click="handleOverlayClick"
      >
        <div 
          class="category-modal" 
          @click.stop 
          @keydown="handleKeyDown" 
          tabindex="0"
          ref="modalRef"
        >
          <!-- Header -->
          <div class="modal-header">
            <div class="modal-title">
              <svg class="modal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                <line x1="12" y1="11" x2="12" y2="17"></line>
                <line x1="9" y1="14" x2="15" y2="14"></line>
              </svg>
              <h3>设置分类</h3>
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
<!-- Category Selection -->
            <div class="category-selection">
              <div class="selection-header">
                <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                  <line x1="12" y1="11" x2="12" y2="17"></line>
                  <line x1="9" y1="14" x2="15" y2="14"></line>
                </svg>
                <span>选择分类</span>
                <span class="category-count">({{ categories.length }})</span>
              </div>
              <div class="category-list">
                <div 
                  v-for="(category, index) in categories" 
                  :key="category.name"
                  class="category-option-wrapper">
                  <div v-if="editingCategory === category.name" class="category-option editing">
                    <!-- Editing view -->
                    <div class="edit-input-wrapper">
                      <div class="edit-input-row">
                        <input
                          v-model="editingName"
                          class="edit-input"
                          placeholder="分类名称"
                          @keyup.enter="saveEditedCategory"
                          @keyup.esc="cancelEdit"
                        />
                      </div>
                      <div class="edit-input-row">
                        <input
                          v-model="editingSavePath"
                          class="edit-input"
                          placeholder="保存路径（可选）"
                          @keyup.enter="saveEditedCategory"
                          @keyup.esc="cancelEdit"
                        />
                      </div>
                      <div class="edit-input-row" style="justify-content: flex-end; gap: 4px;">
                        <button 
                          @click="saveEditedCategory" 
                          class="action-btn"
                          title="保存">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </button>
                        <button 
                          @click="cancelEdit" 
                          class="action-btn"
                          title="取消">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div 
                    v-else
                    class="category-option"
                    :class="{ 'selected': selectedCategory === category.name }"
                    @click="selectCategory(category.name)"
                    @mouseenter="categoryIndex = index"
                    @mouseleave="categoryIndex = -1"
                    :tabindex="index"
                    role="option"
                    :aria-selected="selectedCategory === category.name"
                  >
                    <div class="radio-content">
                      <span class="category-name">{{ category.name }}</span>
                      <span v-if="category.savePath" class="category-path">→ {{ category.savePath }}</span>
                    </div>
                    <div class="category-actions">
                      <button 
                        @click.stop="editCategoryInline(category)"
                        class="action-btn edit-btn"
                        title="编辑分类">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                      <button 
                        @click.stop="deleteCategoryPrompt(category)"
                        class="action-btn delete-btn"
                        title="删除分类">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Create New Category -->
            <div class="new-category-section">
              <div class="section-header">
                <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="16"></line>
                  <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
                <span>创建新分类</span>
              </div>
              
              <!-- New Category Name Input -->
              <el-input
                v-model="newCategoryName"
                placeholder="输入新分类名称"
                class="new-category-input"
              />
              
              <!-- Save Path Input -->
              <el-input
                v-model="newCategorySavePath"
                placeholder="可选：输入分类保存路径"
                class="save-path-input"
              >
                <template #prepend>
                  <span>保存路径</span>
                </template>
              </el-input>
            </div>
            
            <!-- Loading State -->
            <div v-if="isLoading" class="loading-state">
              <svg class="loading-spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
                <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
              </svg>
              <span>正在创建分类...</span>
            </div>
            
            <!-- Error Message -->
            <div v-if="error" class="error-message">
              <svg class="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span>{{ error }}</span>
            </div>
          </div>
          
          <!-- Footer -->
          <div class="modal-footer">
            <el-button @click="close" class="btn btn-secondary">取消</el-button>
            <el-button 
              @click="applyCategory" 
              class="btn btn-primary" 
              :loading="isLoading"
              :disabled="!selectedCategory.trim() || isLoading"
            >
              <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>应用分类</span>
            </el-button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useTorrentStore } from '@/store/torrent'
import { ElAutocomplete } from 'element-plus'

// Props
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  visible: {
    type: Boolean,
    required: true
  },
  multiple: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'update:visible', 'confirm', 'cancel'])

// Store
const torrentStore = useTorrentStore()

// State
const selectedCategory = ref(props.modelValue)
const categoryIndex = ref(-1)
const isLoading = ref(false)
const error = ref(null)
const modalRef = ref(null)
const autocompleteRef = ref(null)
const newCategoryName = ref('')
const newCategorySavePath = ref('')
const editingCategory = ref(null)
const editingName = ref('')
const editingSavePath = ref('')

// Computed
const categories = computed(() => torrentStore.categories)

// Watch for modelValue changes
watch(() => props.modelValue, (newVal) => {
  selectedCategory.value = newVal
})

watch(() => props.visible, (newVal) => {
  if (newVal) {
    // Modal opened - focus input
    nextTick(() => {
      if (autocompleteRef.value) {
        autocompleteRef.value.focus()
      }
      categoryIndex.value = -1
    })
  } else {
    // Modal closed - reset state
    error.value = null
    categoryIndex.value = -1
  }
})

// Methods
const querySearch = (queryString, cb) => {
  const results = queryString 
    ? categories.value.filter(cat => cat.name.toLowerCase().includes(queryString.toLowerCase()))
    : categories.value
  cb(results)
}

const handleSelect = (item) => {
  selectedCategory.value = item.name
  categoryIndex.value = -1
}

const selectCategory = (categoryName) => {
  selectedCategory.value = categoryName
  categoryIndex.value = -1
}

// Edit category inline
const editCategoryInline = (category) => {
  editingCategory.value = category.name
  editingName.value = category.name
  editingSavePath.value = category.savePath || ''
}

// Save edited category
const saveEditedCategory = async () => {
  if (!editingName.value.trim()) {
    cancelEdit()
    return
  }
  
  try {
    isLoading.value = true
    
    // Check if name has changed (rename) or just save path changed (edit)
    if (editingName.value !== editingCategory.value) {
      // Name changed - use rename functionality
      const success = await torrentStore.renameCategory(
        editingCategory.value, 
        editingName.value.trim(), 
        editingSavePath.value.trim()
      )
      if (!success) {
        throw new Error('重命名分类失败')
      }
    } else {
      // Just save path changed - use edit functionality
      const success = await torrentStore.editCategory(
        editingName.value.trim(), 
        editingSavePath.value.trim()
      )
      if (!success) {
        throw new Error('编辑分类失败')
      }
    }
    
    // Select the saved category
    selectedCategory.value = editingName.value.trim()
    ElMessage.success('分类已保存')
  } catch (err) {
    console.error('Failed to save edited category:', err)
    error.value = err.message || '分类保存失败'
    ElMessage.error('分类保存失败：' + err.message)
  } finally {
    isLoading.value = false
    cancelEdit()
  }
}

// Cancel editing
const cancelEdit = () => {
  editingCategory.value = null
  editingName.value = ''
  editingSavePath.value = ''
}

// Delete category with confirmation
const deleteCategoryPrompt = async (category) => {
  try {
    const result = await ElMessageBox.confirm(
      `确定要删除分类 "${category.name}" 吗？此操作不可撤销。`,
      '删除分类',
      {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    const success = await torrentStore.removeCategoryByName(category.name)
    if (success) {
      ElMessage.success('分类删除成功')
      // If the deleted category was selected, clear selection
      if (selectedCategory.value === category.name) {
        selectedCategory.value = ''
      }
    }
  } catch (error) {
    // User cancelled or error occurred
    if (error !== 'cancel' && error?.type !== 'cancel') {
      console.error('Failed to delete category:', error)
      ElMessage.error('分类删除失败')
    }
  }
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

const applyCategory = async () => {
  let categoryName = selectedCategory.value.trim()
  let isNewCategory = false
  
  // If no existing category is selected, use new category name
  if (!categoryName && newCategoryName.value.trim()) {
    categoryName = newCategoryName.value.trim()
    isNewCategory = true
  } else if (categoryName && newCategoryName.value.trim()) {
    // If both are provided, prefer the new category
    categoryName = newCategoryName.value.trim()
    isNewCategory = true
  } else if (!categoryName && !newCategoryName.value.trim()) {
    ElMessage.warning('请选择或输入分类名称')
    return
  }
  
  // Check if selected existing category exists
  if (!isNewCategory) {
    const allCategoryNames = categories.value.map(cat => cat.name)
    if (!allCategoryNames.includes(categoryName)) {
      isNewCategory = true
    }
  }
  
  try {
    isLoading.value = true
    error.value = null

    if (isNewCategory) {
      // Create new category with save path if provided
      const savePath = newCategorySavePath.value.trim()
      const created = await torrentStore.addCategory(categoryName, savePath)
      if (!created) {
        throw new Error('无法创建新分类')
      }
    }

    // Emit success
    emit('confirm', { 
      category: categoryName, 
      isNew: isNewCategory,
      savePath: newCategorySavePath.value.trim()
    })
    emit('update:visible', false)
    
    ElMessage.success('分类设置成功')
  } catch (err) {
    console.error('Failed to apply category:', err)
    error.value = err.message || '分类设置失败'
    ElMessage.error('分类设置失败：' + err.message)
    // Keep the dialog open if there's an error so user can retry
  } finally {
    isLoading.value = false
  }
}

// Keyboard navigation
const handleKeyDown = (event) => {
  if (!props.visible) return
  
  const options = Array.from(document.querySelectorAll('.category-option'))
  const totalOptions = options.length
  
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      categoryIndex.value = categoryIndex.value < totalOptions - 1 ? categoryIndex.value + 1 : 0
      if (options[categoryIndex.value]) {
        options[categoryIndex.value].focus()
      }
      break
    case 'ArrowUp':
      event.preventDefault()
      categoryIndex.value = categoryIndex.value > 0 ? categoryIndex.value - 1 : totalOptions - 1
      if (options[categoryIndex.value]) {
        options[categoryIndex.value].focus()
      }
      break
    case 'Enter':
      event.preventDefault()
      if (categoryIndex.value >= 0 && options[categoryIndex.value]) {
        const categoryName = options[categoryIndex.value].dataset.category
        if (categoryName) {
          selectCategory(categoryName)
        }
      } else {
        applyCategory()
      }
      break
    case 'Escape':
      event.preventDefault()
      close()
      break
  }
}

// Click outside handler
const handleClickOutside = (event) => {
  if (modalRef.value && !modalRef.value.contains(event.target)) {
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
/* Modal Overlay */
.category-modal-overlay {
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
.category-modal {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  width: 420px;
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
  color: var(--accent-cyan);
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
  border-color: var(--accent-cyan-light);
  transform: rotate(90deg);
}

/* Body */
.modal-body {
  padding: 20px 24px;
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Category Selection */
.category-selection {
  background: var(--bg-base);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 12px;
  transition: all 0.2s ease;
}

.category-selection:hover {
  border-color: var(--accent-cyan);
}

.selection-header {
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
  color: var(--accent-cyan);
}

.category-count {
  font-size: var(--text-xs);
  color: var(--text-muted);
  background: var(--bg-hover);
  padding: 2px 6px;
  border-radius: 10px;
  margin-left: auto;
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.category-option {
  width: 100%;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid transparent;
  background: var(--bg-card);
  transition: all 0.15s ease;
  margin-bottom: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.category-option:hover {
  background: var(--bg-hover);
  border-color: var(--accent-cyan-light);
  color: var(--accent-cyan);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(2, 132, 199, 0.1);
}

.category-option.selected {
  background: var(--accent-cyan-light);
  border-color: var(--accent-cyan);
  color: var(--accent-cyan-dark);
  font-weight: 500;
}

.radio-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  margin-right: 12px;
}

.category-name {
  font-weight: 500;
  color: var(--text-primary);
}

.category-path {
  font-size: var(--text-xs);
  color: var(--text-muted);
  font-style: italic;
}

.category-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.category-option:hover .category-actions {
  opacity: 1;
}

.category-actions button {
  padding: 4px;
  border-radius: 4px;
  border: none;
  background: none;
  cursor: pointer;
  color: var(--text-muted);
  transition: all 0.2s ease;
}

.category-actions button:hover {
  color: var(--text-primary);
}

.edit-btn:hover {
  color: var(--accent-yellow) !important;
}

.delete-btn:hover {
  color: var(--status-error) !important;
}

.edit-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  margin-top: 4px;
}

.edit-input-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.edit-input {
  flex: 1;
  padding: 6px 8px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: var(--bg-base);
  color: var(--text-primary);
  font-size: var(--text-sm);
}

.edit-input:focus {
  outline: none;
  border-color: var(--accent-cyan);
  box-shadow: 0 0 0 2px rgba(2, 132, 199, 0.2);
}

.action-btn {
  padding: 6px;
  border-radius: 4px;
  border: none;
  background: none;
  cursor: pointer;
  color: var(--text-muted);
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.new-category-section {
  background: var(--bg-base);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 12px;
  margin-top: 12px;
  transition: all 0.2s ease;
}

.new-category-section:hover {
  border-color: var(--accent-purple);
}

.new-category-input {
  margin-bottom: 12px;
}

.save-path-input {
  margin-bottom: 0;
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
  color: var(--accent-cyan);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Error Message */
.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  color: var(--status-error);
  font-size: var(--text-sm);
}

.error-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
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
  border-color: var(--accent-cyan-light);
  color: var(--accent-cyan);
}

.btn-primary {
  background: linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-cyan-dark) 100%);
  color: white;
  border: none;
  box-shadow: 0 4px 12px rgba(2, 132, 199, 0.3);
}

.btn-primary:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(2, 132, 199, 0.4);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
}

.btn-icon {
  width: 16px;
  height: 16px;
}

/* Dropdown Styles */
.category-dropdown {
  border-radius: 10px !important;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15) !important;
  border: 1px solid var(--border-color) !important;
  background: var(--bg-card) !important;
}

.category-dropdown :deep(.el-select-dropdown__item) {
  padding: 10px 12px !important;
  border-radius: 6px !important;
  margin: 2px 6px !important;
  transition: all 0.15s ease !important;
}

.category-dropdown :deep(.el-select-dropdown__item:hover) {
  background: var(--bg-hover) !important;
  color: var(--accent-cyan) !important;
}

.category-dropdown :deep(.el-select-dropdown__item.selected) {
  background: var(--accent-cyan-light) !important;
  color: var(--accent-cyan-dark) !important;
  font-weight: 500 !important;
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
html.dark .category-modal {
  background: var(--bg-panel);
}

html.dark .category-list-section {
  background: var(--bg-base);
}

html.dark .category-option {
  background: var(--bg-card);
}
</style>
