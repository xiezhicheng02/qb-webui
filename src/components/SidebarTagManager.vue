<template>
  <div class="tag-manager">
    <div class="nav-label">
      <span>标签</span>
      <span v-if="torrentStore.tags.length > 0" class="count-badge">
        {{ torrentStore.tags.length }}
      </span>
      <button 
        @click.stop="addNewTag" 
        class="add-btn" 
        title="添加标签">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>
    </div>
    
    <!-- Add tag input when adding new -->
    <div 
      v-if="showAddInput" 
      class="add-input-wrapper">
      <input
        ref="addInputRef"
        v-model="newTagName"
        @keyup.enter="createTag"
        @keyup.esc="cancelAdd"
        class="add-input"
        placeholder="输入新标签名称..."
        @blur="createTag"
        @click.stop
        type="text"
      />
      <button 
        @click="createTag" 
        class="input-action-btn confirm-btn"
        title="确认创建">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </button>
      <button 
        @click="cancelAdd" 
        class="input-action-btn cancel-btn"
        title="取消">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
    
    <!-- Tags list -->
    <div class="category-tags">
      <div 
        v-for="tagName in torrentStore.tags" 
        :key="tagName"
        class="tag-item-wrapper"
        @click.stop>
        <div 
          v-if="editingTag === tagName"
          class="edit-input-wrapper">
          <input
            ref="editInputRef"
            v-model="editingName"
            @keyup.enter="saveTag(tagName)"
            @keyup.esc="cancelEdit"
            @blur="saveTag(tagName)"
            class="edit-input"
            placeholder="编辑标签名称..."
            @click.stop
            type="text"
          />
          <button 
            @click="saveTag(tagName)" 
            class="input-action-btn confirm-btn"
            title="确认保存">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </button>
          <button 
            @click="cancelEdit" 
            class="input-action-btn cancel-btn"
            title="取消">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <el-tag
          v-else
          size="small"
          class="w-fit justify-start text-left cursor-pointer whitespace-nowrap px-3"
          :class="{
            'bg-[var(--bg-hover)] text-[var(--accent-cyan)] border-l-4 border-[var(--accent-cyan)]': currentFilter === tagName,
            'bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--accent-cyan)]': currentFilter !== tagName
          }"
          @click="filterByTag(tagName)"
          @dblclick="startEdit(tagName)"
        >
          <span class="truncate">{{ tagName }}</span>
        </el-tag>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useTorrentStore } from '@/store/torrent'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const torrentStore = useTorrentStore()

// State for inline editing
const editingTag = ref(null)
const editingName = ref('')
const newTagName = ref('')
const showAddInput = ref(false)
const showTagDialog = ref(false)
const selectedTag = ref('')

// Refs for input focus
const addInputRef = ref(null)
const editInputRef = ref(null)

// Temporary variables for edit and add operations
const currentOperation = ref(null) // 'add' or 'edit'

// Computed property for current filter
const currentFilter = computed(() => {
  const query = router.currentRoute.value.query
  return query.tag || null
})

// Function to count torrents for each tag
const getTagCount = (tagName) => {
  return torrentStore.torrents.filter(torrent => {
    const torrentTags = torrent.tags ? torrent.tags.split(',').map(t => t.trim()) : []
    return torrentTags.includes(tagName)
  }).length
}

// Event handlers
const filterByTag = (tag) => {
  router.push(`/torrents/all?tag=${encodeURIComponent(tag)}`)
}

// Start editing a tag
const startEdit = async (tagName) => {
  editingTag.value = tagName
  editingName.value = tagName
  
  // Wait for DOM update then focus the input
  await nextTick()
  if (editInputRef.value) {
    const inputs = Array.isArray(editInputRef.value) ? editInputRef.value : [editInputRef.value]
    if (inputs.length > 0 && inputs[0]) {
      inputs[0].focus()
      inputs[0].select()
    }
  }
}

// Save edited tag
const saveTag = async (oldTagName) => {
  if (!editingName.value.trim()) {
    cancelEdit()
    return
  }
  
  // Check if tag name already exists
  const exists = torrentStore.tags.some(tag => 
    tag !== oldTagName && tag === editingName.value
  )
  if (exists) {
    ElMessage.warning('标签名称已存在')
    cancelEdit()
    return
  }
  
  try {
    // Since we don't have a direct rename API for tags, we need to:
    // 1. Remove the old tag from all torrents that have it
    // 2. Add the new tag to all those same torrents
    // 3. Remove the old tag definition
    
    // Get all torrents that have the old tag
    const torrentsWithOldTag = torrentStore.torrents.filter(torrent => {
      const torrentTags = torrent.tags ? torrent.tags.split(',').map(t => t.trim()) : []
      return torrentTags.includes(oldTagName)
    })
    
    const torrentHashes = torrentsWithOldTag.map(torrent => torrent.hash)
    
    if (torrentHashes.length > 0) {
      // Remove old tag from all affected torrents
      await torrentStore.batchRemoveTags(torrentHashes, [oldTagName])
      
      // Add new tag to all affected torrents
      await torrentStore.batchAddTags(torrentHashes, [editingName.value.trim()])
    }
    
    // Finally, remove the old tag definition and add the new one
    await torrentStore.removeTag(oldTagName)
    await torrentStore.addTag(editingName.value.trim())
    
    ElMessage.success('标签已更新')
  } catch (error) {
    console.error('Failed to save tag:', error)
    ElMessage.error('标签更新失败')
  }
  
  cancelEdit()
}

// Cancel editing
const cancelEdit = () => {
  editingTag.value = null
  editingName.value = ''
}

// Show add input field
const addNewTag = async () => {
  showAddInput.value = true
  newTagName.value = ''
  
  // Wait for DOM update then focus the input
  await nextTick()
  if (addInputRef.value) {
    addInputRef.value.focus()
  }
}

// Create new tag
const createTag = async () => {
  if (!newTagName.value.trim()) {
    cancelAdd()
    return
  }
  
  // Check if tag name already exists
  const exists = torrentStore.tags.some(tag => tag === newTagName.value)
  if (exists) {
    ElMessage.warning('标签名称已存在')
    cancelAdd()
    return
  }
  
  try {
    const success = await torrentStore.addTag(newTagName.value.trim())
    if (success) {
      ElMessage.success('标签创建成功')
    }
  } catch (error) {
    console.error('Failed to create tag:', error)
    ElMessage.error('标签创建失败')
  }
  
  cancelAdd()
}

// Cancel adding new tag
const cancelAdd = () => {
  showAddInput.value = false
  newTagName.value = ''
}

// Delete tag with confirmation
const deleteTagPrompt = async (tagName) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除标签 "${tagName}" 吗？此操作不可撤销。`,
      '删除标签',
      {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    const success = await torrentStore.removeTag(tagName)
    if (success) {
      ElMessage.success('标签删除成功')
      
      // If current filter matches deleted tag, clear the filter
      if (currentFilter.value === tagName) {
        router.push('/torrents/all')
      }
    }
  } catch (error) {
    // User cancelled or error occurred
    if (error !== 'cancel') {
      console.error('Failed to delete tag:', error)
      ElMessage.error('标签删除失败')
    }
  }
}
</script>

<style scoped>
.tag-manager {
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
  min-width: 0; /* Allow shrinking */
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

.tag-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 8px;
}

.tag-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.tag-item:hover .tag-actions {
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

.tag-item-wrapper {
  width: fit-content;
}
</style>