<template>
  <div class="settings">
    <el-tabs v-model="activeTab">
      <el-tab-pane label="连接设置" name="connection">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>连接设置</span>
              <el-tag :type="connectionStatus.type" size="small">
                {{ connectionStatus.text }}
              </el-tag>
            </div>
          </template>

          <el-form :model="connectionSettings" :rules="rules" ref="connectionForm" label-width="150px" style="max-width: 600px;">
            <el-form-item label="qBittorrent 地址" prop="host">
              <el-input v-model="connectionSettings.host" placeholder="http://localhost" />
            </el-form-item>
            <el-form-item label="端口" prop="port">
              <el-input-number v-model="connectionSettings.port" :min="1" :max="65535" />
            </el-form-item>
            <el-form-item label="用户名" prop="username">
              <el-input v-model="connectionSettings.username" placeholder="admin" />
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="connectionSettings.password" type="password" placeholder="密码" show-password />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="testConnection" :loading="testingConnection">
                <el-icon><Connection /></el-icon>
                测试连接
              </el-button>
              <el-button type="success" @click="saveConnection" :loading="savingConnection">
                <el-icon><Check /></el-icon>
                保存连接
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>

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
import { ref, onMounted, computed, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Connection, Check } from '@element-plus/icons-vue'
import qbittorrentAPI from '@/api/qbittorrent'
import { useTorrentStore } from '@/store/torrent'

const torrentStore = useTorrentStore()
const activeTab = ref('connection')

const connectionSettings = ref({
  host: 'http://localhost',
  port: 8080,
  username: 'admin',
  password: ''
})

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

const testingConnection = ref(false)
const savingConnection = ref(false)
const connectionStatus = computed(() => {
  if (torrentStore.isConnected) {
    return { type: 'success', text: '已连接' }
  }
  return { type: 'danger', text: '未连接' }
})

const connectionForm = ref(null)

// 定义验证规则
const rules = reactive({
  host: [
    { required: true, message: '请输入主机地址', trigger: 'blur' },
    { pattern: /^https?:\/\/.+/, message: '请输入有效的 URL (http:// 或 https://)', trigger: 'blur' }
  ],
  port: [
    { required: true, message: '请输入端口', trigger: 'blur' },
    { type: 'number', min: 1, max: 65535, message: '端口必须在 1-65535 之间', trigger: 'blur' }
  ],
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
})

const testConnection = async () => {
  // Validate form first
  try {
    await connectionForm.value.validate()
  } catch (error) {
    ElMessage.warning('请检查表单输入')
    return
  }

  testingConnection.value = true
  try {
    // 设置API配置
    qbittorrentAPI.setConfig(
      connectionSettings.value.host,
      connectionSettings.value.port,
      connectionSettings.value.username,
      connectionSettings.value.password
    )

    // 尝试登录
    const loginSuccess = await qbittorrentAPI.login()
    if (loginSuccess) {
      ElMessage.success('连接成功！')
      torrentStore.isConnected = true
      // 获取服务器信息
      await torrentStore.fetchServerState()
    } else {
      ElMessage.error('连接失败，请检查用户名和密码')
      torrentStore.isConnected = false
    }
  } catch (error) {
    // 区分不同类型的错误
    if (error.message && error.message.includes('Failed to fetch')) {
      ElMessage.error('网络错误：无法连接到服务器')
    } else {
      ElMessage.error('连接失败：' + error.message)
    }
    torrentStore.isConnected = false
  } finally {
    testingConnection.value = false
  }
}

const saveConnection = async () => {
  // Validate form first
  try {
    await connectionForm.value.validate()
  } catch (error) {
    ElMessage.warning('请检查表单输入')
    return
  }

  savingConnection.value = true
  try {
    // 保存到本地存储
    localStorage.setItem('qb-webui-connection', JSON.stringify(connectionSettings.value))

    // 设置API配置
    qbittorrentAPI.setConfig(
      connectionSettings.value.host,
      connectionSettings.value.port,
      connectionSettings.value.username,
      connectionSettings.value.password
    )

    ElMessage.success('连接设置已保存')
  } catch (error) {
    ElMessage.error('保存失败：' + error.message)
  } finally {
    savingConnection.value = false
  }
}

const saveDownloadSettings = () => {
  localStorage.setItem('qb-webui-download', JSON.stringify(downloadSettings.value))
  ElMessage.success('下载设置已保存')
}

const saveInterfaceSettings = () => {
  localStorage.setItem('qb-webui-interface', JSON.stringify(interfaceSettings.value))
  ElMessage.success('界面设置已保存')
}

onMounted(() => {
  // 加载连接设置
  const savedConnection = localStorage.getItem('qb-webui-connection')
  if (savedConnection) {
    try {
      connectionSettings.value = JSON.parse(savedConnection)
    } catch (e) {
      console.error('Failed to load connection settings:', e)
    }
  }

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
    } catch (e) {
      console.error('Failed to load interface settings:', e)
    }
  }
})
</script>

<style scoped>
.settings {
  padding: 10px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
}

.el-divider {
  margin: 20px 0;
}
</style>
