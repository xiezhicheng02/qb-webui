<template>
  <div class="category-manager">
    <div class="nav-label">
      <span>分类</span>
      <span v-if="torrentStore.categories.length > 0" class="count-badge">
        {{ torrentStore.categories.length }}
      </span>
      <button @click.stop="addNewCategory" class="add-btn" title="添加分类">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>
    </div>

    <!-- Add category input when adding new -->
    <div v-if="showAddInput" class="add-input-wrapper">
      <input ref="addInputRef" v-model="newCategoryName" @keyup.enter="createCategory" @keyup.esc="cancelAdd"
        class="add-input" placeholder="输入新分类名称..." @blur="createCategory" @click.stop type="text" />
      <button @click="createCategory" class="input-action-btn confirm-btn" title="确认创建">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </button>
      <button @click="cancelAdd" class="input-action-btn cancel-btn" title="取消">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>

    <!-- Categories list -->
    <div class="category-tags">
      <div 
        v-for="category in torrentStore.categories" 
        :key="category.name" 
        class="category-item-wrapper"
        @click.stop
      >
        <el-button 
          size="small" 
          class="w-fit justify-start text-left whitespace-nowrap px-3"
          :class="{
            'bg-[var(--bg-hover)] text-[var(--accent-purple)] border-l-4 border-[var(--accent-purple)]': currentFilter === category.name,
            'bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--accent-purple)]': currentFilter !== category.name
          }"
          @click="filterByCategory(category.name)"
        >
          <span class="truncate">{{ category.name }}</span>
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useTorrentStore } from '@/store/torrent'
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed, nextTick, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const torrentStore = useTorrentStore()

// State for inline editing
const editingCategory = ref(null)
const editingName = ref('')
const newCategoryName = ref('')
const showAddInput = ref(false)

// Refs for input focus
const addInputRef = ref(null)
const editInputRef = ref(null)

// Computed property for current filter
const currentFilter = computed(() => {
  const query = router.currentRoute.value.query
  return query.category || null
})

// Function to count torrents for each category
const getCategoryCount = (categoryName) => {
  return torrentStore.torrents.filter(torrent => torrent.category === categoryName).length
}

// Event handlers
const filterByCategory = (category) => {
  router.push(`/torrents/all?category=${encodeURIComponent(category)}`)
}

// Start editing a category
const startEdit = async (category) => {
  editingCategory.value = category.name
  editingName.value = category.name

  // Wait for DOM update then focus the input
  await nextTick()
  if (editInputRef.value && editInputRef.value.length > 0) {
    editInputRef.value[0].focus()
    editInputRef.value[0].select()
  }
}

// Save edited category
const saveCategory = async (category) => {
  if (!editingName.value.trim()) {
    cancelEdit()
    return
  }

  // Check if category name already exists
  const exists = torrentStore.categories.some(cat =>
    cat.name !== category.name && cat.name === editingName.value
  )
  if (exists) {
    ElMessage.warning('分类名称已存在')
    cancelEdit()
    return
  }

  try {
    let success = false
    if (editingName.value !== category.name) {
      // Name changed - use rename functionality
      success = await torrentStore.renameCategory(category.name, editingName.value.trim(), category.savePath || '')
    } else {
      // Just save path - use edit functionality (but we don't have a UI for editing paths in sidebar)
      // We'll just update the name for now, since sidebar only allows renaming
      success = true
    }

    if (success) {
      ElMessage.success('分类已更新')
    }
  } catch (error) {
    console.error('Failed to save category:', error)
    ElMessage.error('分类更新失败')
  }

  cancelEdit()
}

// Cancel editing
const cancelEdit = () => {
  editingCategory.value = null
  editingName.value = ''
}

// Show add input field
const addNewCategory = async () => {
  showAddInput.value = true
  newCategoryName.value = ''

  // Wait for DOM update then focus the input
  await nextTick()
  if (addInputRef.value) {
    addInputRef.value.focus()
  }
}

// Create new category
const createCategory = async () => {
  if (!newCategoryName.value.trim()) {
    cancelAdd()
    return
  }

  // Check if category name already exists
  const exists = torrentStore.categories.some(cat => cat.name === newCategoryName.value)
  if (exists) {
    ElMessage.warning('分类名称已存在')
    cancelAdd()
    return
  }

  try {
    const success = await torrentStore.addCategory(newCategoryName.value.trim())
    if (success) {
      ElMessage.success('分类创建成功')
    }
  } catch (error) {
    console.error('Failed to create category:', error)
    ElMessage.error('分类创建失败')
  }

  cancelAdd()
}

// Cancel adding new category
const cancelAdd = () => {
  showAddInput.value = false
  newCategoryName.value = ''
}

// Delete category with confirmation
const deleteCategoryPrompt = async (category) => {
  try {
    await ElMessageBox.confirm(
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

      // If current filter matches deleted category, clear the filter
      if (currentFilter.value === category.name) {
        router.push('/torrents/all')
      }
    }
  } catch (error) {
    // User cancelled or error occurred
    if (error !== 'cancel') {
      console.error('Failed to delete category:', error)
      ElMessage.error('分类删除失败')
    }
  }
}
</script>

<style scoped>
.category-manager {
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
  display: flex;
  align-items: center;
  gap: 8px;
}

.count-badge {
  font-size: var(--text-xs);
  padding: 2px 6px;
  background: var(--bg-hover);
  border-radius: 10px;
  margin-left: 8px;
  color: var(--text-muted);
  font-weight: 500;
}

.add-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  margin-left: auto;
}

.add-btn:hover {
  background: var(--bg-hover);
  color: var(--accent-cyan);
}

.add-btn svg {
  width: 14px;
  height: 14px;
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-width: 0;
  /* Allow shrinking */
}

.tag-item:hover {
  border-color: var(--accent-cyan);
  color: var(--accent-cyan);
  background: rgba(2, 132, 199, 0.1);
}

.tag-item.active {
  background: var(--accent-gradient);
  color: #fff;
  border-color: transparent;
}

.category-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 8px;
}

.category-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.tag-item:hover .category-actions {
  opacity: 1;
}

.action-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 3px;
  border-radius: 3px;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.edit-btn:hover {
  color: var(--accent-yellow);
}

.delete-btn:hover {
  color: var(--status-error);
}

.input-action-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.input-action-btn:hover {
  background: var(--bg-hover);
}

.input-action-btn.confirm-btn:hover {
  color: var(--accent-green);
}

.input-action-btn.cancel-btn:hover {
  color: var(--status-error);
}

.add-input-wrapper,
.edit-input-wrapper {
  display: flex;
  align-items: center;
  margin: 0 15px 8px;
  padding: 4px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  transition: all 0.2s ease;
}

.add-input-wrapper:focus-within,
.edit-input-wrapper:focus-within {
  border-color: var(--accent-cyan);
  outline: none;
  box-shadow: 0 0 0 2px rgba(2, 132, 199, 0.2);
}

.add-input,
.edit-input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 4px 8px;
  font-size: var(--text-xs);
  color: var(--text-primary);
  outline: none;
}

.add-input::placeholder,
.edit-input::placeholder {
  color: var(--text-muted);
}

.category-item-wrapper {
  width: fit-content;
}
</style>