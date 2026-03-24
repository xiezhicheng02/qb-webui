<template>
  <Teleport to="body">
    <Transition name="dialog-fade">
      <div v-if="visible" class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[2000]" @click="closeDialog">
        <div class="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl w-[500px] max-w-[90vw] max-h-[85vh] flex flex-col shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25),0_0_0_1px_rgba(255,255,255,0.05)] transform transition-transform origin-bottom animate-dialogSlideUp" @click.stop>
          <!-- Header -->
          <div class="flex justify-between items-center p-[20px] pr-6 pb-4 border-b border-[var(--border-color)] bg-gradient-to-br from-[var(--bg-card)] to-[var(--bg-base)] rounded-t-xl">
            <h3 class="text-[var(--text-lg)] text-[var(--text-primary)] font-semibold m-0">添加任务</h3>
            <button class="bg-[var(--bg-base)] border border-[var(--border-color)] text-[var(--text-muted)] cursor-pointer p-1.5 rounded-lg w-8 h-8 flex items-center justify-center transition-all duration-200 ease-in-out flex-shrink-0 hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] hover:border-[var(--accent-cyan-light)]" @click="closeDialog">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <!-- Tabs: URL/Magnet vs File Upload -->
          <div class="flex border-b border-[var(--border-color)] px-6">
            <button 
              :class="[
                'flex-1 flex flex-col items-center gap-1 p-2.5 bg-transparent border-none text-[var(--text-muted)] cursor-pointer font-medium transition-all duration-200 ease-in-out border-b-2 border-transparent',
                { 'text-[var(--accent-cyan)] border-[var(--accent-cyan)] bg-[rgba(2,132,199,0.05)]': activeTab === 'url' }
              ]" 
              @click="activeTab = 'url'"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 12v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              <span class="text-[var(--text-sm)]">URL/Magnet</span>
            </button>
            <button 
              :class="[
                'flex-1 flex flex-col items-center gap-1 p-2.5 bg-transparent border-none text-[var(--text-muted)] cursor-pointer font-medium transition-all duration-200 ease-in-out border-b-2 border-transparent',
                { 'text-[var(--accent-cyan)] border-[var(--accent-cyan)] bg-[rgba(2,132,199,0.05)]': activeTab === 'file' }
              ]" 
              @click="activeTab = 'file'"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              <span class="text-[var(--text-sm)]">种子文件</span>
            </button>
          </div>
          
          <!-- URL/Magnet Tab Content -->
          <div v-show="activeTab === 'url'" class="p-5 flex-1 overflow-y-auto">
            <el-input
              v-model="urlInput"
              type="textarea"
              :rows="4"
              placeholder="输入磁力链接或HTTP/FTP链接，每行一个"
              class="w-full"
            />
          </div>
          
          <!-- File Upload Tab Content -->
          <div v-show="activeTab === 'file'" class="p-5 flex-1 overflow-y-auto">
            <div 
              class="border-2 border-dashed border-[var(--border-color)] rounded-lg p-7.5 text-center transition-all duration-200 ease-in-out cursor-pointer bg-[var(--bg-base)] hover:border-[var(--accent-cyan)] hover:bg-[rgba(2,132,199,0.05)]" 
              @dragover.prevent="handleDragOver"
              @drop.prevent="handleDrop"
              @click="triggerFileInput"
            >
              <div class="flex flex-col items-center gap-3">
                <svg class="w-12 h-12 text-[var(--text-muted)] opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                <p class="m-0 text-[var(--text-sm)] text-[var(--text-secondary)]">拖拽文件到此处或点击选择</p>
                <p class="m-0 text-[var(--text-xs)] text-[var(--text-muted)]">支持 .torrent 文件</p>
              </div>
            </div>
            
            <input
              ref="fileInputRef"
              type="file"
              multiple
              accept=".torrent"
              @change="handleFileSelect"
              style="display: none;"
            />
            
            <div v-if="selectedFiles.length > 0" class="mt-4">
              <div 
                v-for="(file, index) in selectedFiles" 
                :key="index" 
                class="flex items-center gap-2 p-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-md mb-2"
              >
                <svg class="w-4 h-4 text-[var(--text-secondary)] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                  <polyline points="13 2 13 9 20 9"></polyline>
                </svg>
                <span class="flex-1 text-[var(--text-sm)] text-[var(--text-primary)] truncate">{{ file.name }}</span>
                <button 
                  class="bg-none border-none text-[var(--text-muted)] cursor-pointer p-1 rounded-sm w-6 h-6 flex items-center justify-center transition-all duration-200 hover:bg-[var(--bg-hover)] hover:text-[var(--status-error)]"
                  @click="removeFile(index)"
                >
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                 </button>
               </div>
             </div>
           </div>
           
           <!-- Category Selection -->
          <div class="px-6 pb-5 border-b border-[var(--border-color)]">
            <label class="block text-[var(--text-sm)] text-[var(--text-secondary)] font-semibold mb-2">分类</label>
            <div class="flex items-center gap-2">
              <el-select
                v-model="selectedCategory"
                placeholder="选择分类"
                class="flex-1"
                clearable
                filterable
                allow-create
                default-first-option
              >
                <el-option
                  v-for="category in categories"
                  :key="category.name"
                  :label="category.name"
                  :value="category.name"
                >
                  <div class="flex items-center justify-between">
                    <span>{{ category.name }}</span>
                    <span v-if="category.savePath" class="text-[var(--text-xs)] text-[var(--text-muted)] ml-2">{{ category.savePath }}</span>
                  </div>
                </el-option>
              </el-select>
            </div>
            <p class="text-[var(--text-xs)] text-[var(--text-muted)] mt-2">
              <svg class="w-3.5 h-3.5 inline-block mr-1 text-[var(--accent-cyan)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              可直接输入新分类名称或从列表选择
            </p>
          </div>
          
          <!-- Options Section -->
          <div class="p-5 border-b border-[var(--border-color)]">
            <label class="block text-[var(--text-sm)] text-[var(--text-secondary)] font-semibold mb-3">选项</label>
            <div class="flex items-center gap-3 mb-3">
              <el-switch v-model="options.paused" />
              <span class="text-[var(--text-secondary)] text-[var(--text-sm)]">添加后暂停</span>
            </div>
            <div class="flex items-center gap-3 mb-3">
              <el-switch v-model="options.autoTMM" />
              <span class="text-[var(--text-secondary)] text-[var(--text-sm)]">使用自动管理</span>
            </div>
            <div class="mt-2">
              <el-input 
                v-model="options.savepath" 
                placeholder="自定义保存路径（可选）"
                class="w-full"
              />
            </div>
          </div>
          
          <!-- Footer -->
          <div class="p-5 pt-5 border-t border-[var(--border-color)] flex justify-end gap-3 bg-gradient-to-br from-[var(--bg-base)] to-[var(--bg-card)] rounded-b-xl mt-auto">
            <el-button @click="closeDialog">取消</el-button>
            <el-button 
              type="primary" 
              @click="submitTask" 
              :disabled="!canSubmit"
              :loading="isSubmitting"
            >
              <svg class="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>添加任务</span>
            </el-button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useTorrentStore } from '@/store/torrent'
import { ElMessage } from 'element-plus'

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['update:visible', 'close'])

const torrentStore = useTorrentStore()

// State
const activeTab = ref('url')
const urlInput = ref('')
const selectedFiles = ref([])
const selectedCategory = ref('')
const isSubmitting = ref(false)
const fileInputRef = ref(null)

// Options
const options = ref({
  paused: false,
  autoTMM: true,
  savepath: ''
})

// Computed
const categories = computed(() => torrentStore.categories)

const canSubmit = computed(() => {
  // Must have either URL input or selected files
  const hasInput = activeTab.value === 'url' ? urlInput.value.trim() : selectedFiles.value.length > 0
  
  return hasInput
})

// Methods
const closeDialog = () => {
  emit('update:visible', false)
  emit('close')
  
  // Reset state
  activeTab.value = 'url'
  urlInput.value = ''
  selectedFiles.value = []
  selectedCategory.value = ''
  isSubmitting.value = false
  options.value = {
    paused: false,
    autoTMM: true,
    savepath: ''
  }
}

const triggerFileInput = () => {
  fileInputRef.value.click()
}

const handleFileSelect = (event) => {
  const files = Array.from(event.target.files)
  selectedFiles.value = [...selectedFiles.value, ...files]
  
  // Reset file input value so same file can be selected again later
  event.target.value = ''
}

const handleDragOver = (event) => {
  event.preventDefault()
}

const handleDrop = (event) => {
  event.preventDefault()
  const files = Array.from(event.dataTransfer.files).filter(file => 
    file.type === 'application/x-bittorrent' || file.name.endsWith('.torrent')
  )
  selectedFiles.value = [...selectedFiles.value, ...files]
}

const removeFile = (index) => {
  selectedFiles.value.splice(index, 1)
}

const submitTask = async () => {
  if (!canSubmit.value) return
  
  try {
    isSubmitting.value = true
    
    // 1. 首先处理分类：如果用户输入了新分类，先创建
    let effectiveCategory = selectedCategory.value
    if (selectedCategory.value) {
      // 检查是否为新建分类（不在现有列表中）
      const existingCategory = categories.value.find(c => c.name === selectedCategory.value)
      if (!existingCategory) {
        // 创建新分类
        const created = await torrentStore.addCategory(selectedCategory.value)
        if (!created) {
          ElMessage.warning('分类创建失败，将使用默认分类')
          effectiveCategory = ''
        } else {
          ElMessage.success(`分类 "${selectedCategory.value}" 创建成功`)
        }
      }
    }
    
    // 2. 准备任务选项
    const taskOptions = {
      paused: options.value.paused,
      autoTMM: options.value.autoTMM,
      savepath: options.value.savepath || undefined,
      category: effectiveCategory || undefined
    }
    
    let successCount = 0
    let failCount = 0
    
    // 3. 添加任务
    if (activeTab.value === 'url') {
      // 通过 URL/Magnet 链接添加
      const urls = urlInput.value.split('\n').filter(line => line.trim())
      for (const url of urls) {
        const success = await torrentStore.addTorrent(url.trim(), taskOptions)
        if (success) {
          successCount++
        } else {
          failCount++
        }
      }
    } else {
      // 通过种子文件添加
      for (const file of selectedFiles.value) {
        const success = await torrentStore.addTorrentFromFile(file, taskOptions)
        if (success) {
          successCount++
        } else {
          failCount++
        }
      }
    }
    
    // 4. 显示结果
    if (successCount > 0 && failCount === 0) {
      ElMessage.success(`成功添加 ${successCount} 个任务`)
      closeDialog()
    } else if (successCount > 0 && failCount > 0) {
      ElMessage.warning(`成功添加 ${successCount} 个任务，${failCount} 个失败`)
      closeDialog()
    } else {
      ElMessage.error('任务添加失败')
    }
  } catch (error) {
    console.error('Error submitting task:', error)
    ElMessage.error(`任务添加失败：${error.message}`)
  } finally {
    isSubmitting.value = false
  }
}

const handleEscKey = (event) => {
  if (event.key === 'Escape' && props.visible) {
    closeDialog()
  }
}

onMounted(() => {
  // Fetch categories when dialog is opened
  torrentStore.fetchCategories()
  window.addEventListener('keydown', handleEscKey)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleEscKey)
})
</script>

<style scoped>
@keyframes dialogSlideUp {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.animate-dialogSlideUp {
  animation: dialogSlideUp 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.dialog-fade-enter-active,
.dialog-fade-leave-active {
  transition: opacity 0.2s ease;
}

.dialog-fade-enter-from,
.dialog-fade-leave-to {
  opacity: 0;
}
</style>