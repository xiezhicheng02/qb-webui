<template>
  <div class="settings">
    <el-tabs v-model="activeTab">
      <el-tab-pane label="下载设置" name="download">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>下载设置</span>
            </div>
          </template>

          <el-form :model="downloadSettings" label-width="150px" style="max-width: 600px;">
            <el-form-item label="默认下载路径">
              <el-input v-model="downloadSettings.defaultSavePath" placeholder="/downloads" />
            </el-form-item>
            <el-form-item label="最大下载速度 (KB/s)">
              <el-input-number v-model="downloadSettings.maxDownloadSpeed" :min="0" />
            </el-form-item>
            <el-form-item label="最大上传速度 (KB/s)">
              <el-input-number v-model="downloadSettings.maxUploadSpeed" :min="0" />
            </el-form-item>
            <el-form-item label="同时下载任务数">
              <el-input-number v-model="downloadSettings.maxActiveDownloads" :min="1" :max="50" />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="saveDownloadSettings">保存设置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>

      <el-tab-pane label="界面设置" name="interface">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>界面设置</span>
            </div>
          </template>

          <el-form :model="interfaceSettings" label-width="150px" style="max-width: 600px;">
            <el-form-item label="主题">
              <el-select v-model="interfaceSettings.theme" placeholder="选择主题">
                <el-option label="浅色" value="light" />
                <el-option label="深色" value="dark" />
                <el-option label="自动" value="auto" />
              </el-select>
            </el-form-item>
            <el-form-item label="刷新间隔 (秒)">
              <el-input-number v-model="interfaceSettings.refreshInterval" :min="1" :max="60" />
            </el-form-item>
            <el-form-item label="显示种子哈希">
              <el-switch v-model="interfaceSettings.showHash" />
            </el-form-item>
            <el-form-item label="显示种子标签">
              <el-switch v-model="interfaceSettings.showTags" />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="saveInterfaceSettings">保存设置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useTorrentStore } from '@/store/torrent'

const torrentStore = useTorrentStore()
const activeTab = ref('download')

const downloadSettings = ref({
  defaultSavePath: '/downloads',
  maxDownloadSpeed: 0,
  maxUploadSpeed: 0,
  maxActiveDownloads: 5
})

const interfaceSettings = ref({
  theme: 'light',
  refreshInterval: 3,
  showHash: false,
  showTags: true
})

const saveDownloadSettings = () => {
  localStorage.setItem('qb-webui-download', JSON.stringify(downloadSettings.value))
  ElMessage.success('下载设置已保存')
}

const saveInterfaceSettings = () => {
  localStorage.setItem('qb-webui-interface', JSON.stringify(interfaceSettings.value))
  ElMessage.success('界面设置已保存')
}

// Apply theme when selector changes
watch(() => interfaceSettings.value.theme, (newTheme) => {
  if (window.__toggleTheme) {
    window.__toggleTheme(newTheme)
  }
})

onMounted(() => {
  // 加载下载设置
  const savedDownload = localStorage.getItem('qb-webui-download')
  if (savedDownload) {
    try {
      downloadSettings.value = JSON.parse(savedDownload)
    } catch (e) {
      console.error('Failed to load download settings:', e)
    }
  }

  // 加载界面设置
  const savedInterface = localStorage.getItem('qb-webui-interface')
  if (savedInterface) {
    try {
      interfaceSettings.value = JSON.parse(savedInterface)
      // Apply loaded theme
      if (window.__toggleTheme) {
        window.__toggleTheme(interfaceSettings.value.theme)
      }
    } catch (e) {
      console.error('Failed to load interface settings:', e)
    }
  }
})
</script>

<style scoped>
.settings {
  padding: var(--spacing-md);
  background-color: var(--background-color);
  min-height: calc(100vh - 60px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-md);
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
}

/* 优化表单样式 */
.el-form {
  max-width: 600px;
}

.el-form-item {
  margin-bottom: var(--spacing-lg);
}

.el-form-item__label {
  font-weight: var(--font-weight-medium);
  color: var(--text-secondary);
}

/* 优化按钮样式 */
.el-button {
  border-radius: var(--border-radius-md);
  font-weight: var(--font-weight-medium);
}

/* 优化卡片样式 */
.el-card {
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  transition: box-shadow 0.3s ease;
}

.el-card:hover {
  box-shadow: var(--shadow-md);
}

/* 优化标签样式 */
.el-tag {
  border-radius: var(--border-radius-sm);
  font-weight: var(--font-weight-medium);
}

/* 优化输入框样式 */
.el-input__inner,
.el-input-number__input {
  border-radius: var(--border-radius-sm);
}

/* 优化选项卡样式 */
.el-tabs__item {
  font-weight: var(--font-weight-medium);
  color: var(--text-secondary);
}

.el-tabs__item.is-active {
  color: var(--primary-color);
  font-weight: var(--font-weight-bold);
}
</style>
