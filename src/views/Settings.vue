<template>
  <div class="settings">
    <el-tabs v-model="activeTab">
      <el-tab-pane label="常规设置" name="general">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>常规设置</span>
            </div>
          </template>

          <!-- 保存按钮移到顶部 -->
          <div style="margin-bottom: 20px;">
            <el-button type="primary" @click="saveGeneralSettings">保存设置</el-button>
          </div>

          <!-- 使用 Collapse 来组织不同的设置组 -->
          <el-collapse v-model="activeNames" accordion>
            <!-- 基本选项组 -->
            <el-collapse-item title="基本选项" name="basic">
              <el-form :model="generalSettings" label-width="220px" style="max-width: 800px;">
                <el-form-item label="界面语言">
                  <el-select v-model="generalSettings.locale" placeholder="选择语言">
                    <el-option label="中文" value="zh" />
                    <el-option label="English" value="en" />
                    <el-option label="Русский" value="ru" />
                    <el-option label="Français" value="fr" />
                    <el-option label="Español" value="es" />
                  </el-select>
                </el-form-item>
                <el-form-item label="添加种子时创建子文件夹">
                  <el-switch v-model="generalSettings.createSubfolderEnabled" />
                </el-form-item>
                <el-form-item label="以暂停状态添加种子">
                  <el-switch v-model="generalSettings.startPausedEnabled" />
                </el-form-item>
                <el-form-item label="预分配磁盘空间">
                  <el-switch v-model="generalSettings.preallocateAll" />
                  <template #description>
                    <div class="form-description">为所有文件预分配磁盘空间，防止文件碎片化</div>
                  </template>
                </el-form-item>
                <el-form-item label="为未完成文件添加扩展名">
                  <el-switch v-model="generalSettings.incompleteFilesExt" />
                  <template #description>
                    <div class="form-description">将 .!qB 扩展名追加到未完成的文件</div>
                  </template>
                </el-form-item>
              </el-form>
            </el-collapse-item>

            <!-- 速度设置组 -->
            <el-collapse-item title="速度设置" name="speed">
              <el-form :model="generalSettings" label-width="220px" style="max-width: 800px;">
                <el-form-item label="全局下载限速 (KB/s)">
                  <el-input-number 
                    v-model="generalSettings.globalDownloadLimit" 
                    :min="0"
                    :step="100"
                    placeholder="0表示无限制"
                    controls-position="right"
                    style="width: 200px;"
                  />
                </el-form-item>
                <el-form-item label="全局上传限速 (KB/s)">
                  <el-input-number 
                    v-model="generalSettings.globalUploadLimit" 
                    :min="0"
                    :step="100"
                    placeholder="0表示无限制"
                    controls-position="right"
                    style="width: 200px;"
                  />
                </el-form-item>
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="启用速度限制计划">
                      <el-switch v-model="generalSettings.schedulerEnabled" />
                      <template #description>
                        <div class="form-description">在指定时间段内使用备用速度限制</div>
                      </template>
                    </el-form-item>
                  </el-col>
                </el-row>
                <template v-if="generalSettings.schedulerEnabled">
                  <el-form-item label="计划时间段">
                    <div class="time-range">
                      <el-time-select
                        v-model="generalSettings.scheduleFromHour"
                        :placeholder="'开始时间'"
                        start="00:00"
                        step="01:00"
                        end="23:00"
                        format="HH:mm"
                        style="width: 100px; margin-right: 10px;"
                      />
                      <span style="margin: 0 10px;">至</span>
                      <el-time-select
                        v-model="generalSettings.scheduleToHour"
                        :placeholder="'结束时间'"
                        start="00:00"
                        step="01:00"
                        end="23:00"
                        format="HH:mm"
                        style="width: 100px; margin-left: 10px;"
                      />
                    </div>
                  </el-form-item>
                  <el-form-item label="计划应用天数">
                    <el-select v-model="generalSettings.schedulerDays" placeholder="选择天数">
                      <el-option label="每日" :value="0" />
                      <el-option label="工作日" :value="1" />
                      <el-option label="周末" :value="2" />
                      <el-option label="周一" :value="3" />
                      <el-option label="周二" :value="4" />
                      <el-option label="周三" :value="5" />
                      <el-option label="周四" :value="6" />
                      <el-option label="周五" :value="7" />
                      <el-option label="周六" :value="8" />
                      <el-option label="周日" :value="9" />
                    </el-select>
                  </el-form-item>
                </template>
                <el-divider />
                <el-form-item label="备用下载限速 (KB/s)">
                  <el-input-number 
                    v-model="generalSettings.altDownloadLimit" 
                    :min="0"
                    :step="100"
                    placeholder="备用下载限速"
                    controls-position="right"
                    style="width: 200px;"
                  />
                </el-form-item>
                <el-form-item label="备用上传限速 (KB/s)">
                  <el-input-number 
                    v-model="generalSettings.altUploadLimit" 
                    :min="0"
                    :step="100"
                    placeholder="备用上传限速"
                    controls-position="right"
                    style="width: 200px;"
                  />
                </el-form-item>
              </el-form>
            </el-collapse-item>

            <!-- 路径设置组 -->
            <el-collapse-item title="路径设置" name="paths">
              <el-form :model="generalSettings" label-width="220px" style="max-width: 800px;">
                <el-form-item label="默认保存路径">
                  <el-input v-model="generalSettings.defaultSavePath" placeholder="/downloads" />
                </el-form-item>
                <el-form-item label="启用临时路径">
                  <el-switch v-model="generalSettings.tempPathEnabled" />
                </el-form-item>
                <el-form-item label="临时路径" v-if="generalSettings.tempPathEnabled" :style="{ marginLeft: '20px' }">
                  <el-input v-model="generalSettings.tempPath" placeholder="/downloads/temp" />
                  <template #description>
                    <div class="form-description">用于不完整torrents的路径</div>
                  </template>
                </el-form-item>
                <el-form-item label=".torrent文件导出目录">
                  <el-input v-model="generalSettings.exportDir" placeholder="/path/to/export/.torrent/files" />
                  <template #description>
                    <div class="form-description">复制.torrent文件到此目录</div>
                  </template>
                </el-form-item>
                <el-form-item label="完成种子.torrent导出目录">
                  <el-input v-model="generalSettings.exportDirFin"
                    placeholder="/path/to/export/completed/.torrent/files" />
                  <template #description>
                    <div class="form-description">复制已完成下载的.torrent文件到此目录</div>
                  </template>
                </el-form-item>
              </el-form>
            </el-collapse-item>

            <!-- 队列管理组 -->
            <el-collapse-item title="队列管理" name="queue">
              <el-form :model="generalSettings" label-width="220px" style="max-width: 800px;">
                <el-form-item label="启用队列管理">
                  <el-switch v-model="generalSettings.queueingEnabled" />
                </el-form-item>
                <el-form-item label="最大活跃下载数">
                  <el-input-number v-model="generalSettings.maxActiveDownloads" :min="-1" :max="100" />
                  <template #description>
                    <div class="form-description">-1 表示无限制</div>
                  </template>
                </el-form-item>
                <el-form-item label="最大活跃上传数">
                  <el-input-number v-model="generalSettings.maxActiveUploads" :min="-1" :max="100" />
                  <template #description>
                    <div class="form-description">-1 表示无限制</div>
                  </template>
                </el-form-item>
                <el-form-item label="最大活跃种子数">
                  <el-input-number v-model="generalSettings.maxActiveTorrents" :min="-1" :max="100" />
                  <template #description>
                    <div class="form-description">-1 表示无限制</div>
                  </template>
                </el-form-item>
                <el-form-item label="不统计慢速种子">
                  <el-switch v-model="generalSettings.dontCountSlowTorrents" />
                  <template #description>
                    <div class="form-description">慢速种子不会计入活跃种子限制</div>
                  </template>
                </el-form-item>
                <el-form-item label="慢速下载阈值 (KB/s)">
                  <el-input-number v-model="generalSettings.slowTorrentDlRateThreshold" :min="0" :max="10000"
                    controls-position="right" style="width: 150px;" />
                  <template #description>
                    <div class="form-description">低于此值的下载速度视为慢速</div>
                  </template>
                </el-form-item>
                <el-form-item label="慢速上传阈值 (KB/s)">
                  <el-input-number v-model="generalSettings.slowTorrentUlRateThreshold" :min="0" :max="10000"
                    controls-position="right" style="width: 150px;" />
                  <template #description>
                    <div class="form-description">低于此值的上传速度视为慢速</div>
                  </template>
                </el-form-item>
                <el-form-item label="慢速种子非活动时间 (秒)">
                  <el-input-number v-model="generalSettings.slowTorrentInactiveTimer" :min="0" :max="3600"
                    controls-position="right" style="width: 150px;" />
                  <template #description>
                    <div class="form-description">种子在此时间内无活动则视为慢速</div>
                  </template>
                </el-form-item>
              </el-form>
            </el-collapse-item>

            <!-- 分享与做种限制组 -->
            <el-collapse-item title="分享与做种限制" name="limits">
              <el-form :model="generalSettings" label-width="220px" style="max-width: 800px;">
                <el-form-item label="启用分享率限制">
                  <el-switch v-model="generalSettings.maxRatioEnabled" />
                </el-form-item>
                <el-form-item label="最大分享率" v-if="generalSettings.maxRatioEnabled" :style="{ marginLeft: '20px' }">
                  <el-input-number v-model="generalSettings.maxRatio" :precision="2" :step="0.1" :min="0" :max="100"
                    controls-position="right" style="width: 150px;" />
                  <template #description>
                    <div class="form-description">达到此分享率后执行相应操作</div>
                  </template>
                </el-form-item>
                <el-form-item label="达到限制时的操作" v-if="generalSettings.maxRatioEnabled" :style="{ marginLeft: '20px' }">
                  <el-radio-group v-model="generalSettings.maxRatioAct">
                    <el-radio :label="0">暂停种子</el-radio>
                    <el-radio :label="1">删除种子</el-radio>
                  </el-radio-group>
                </el-form-item>

                <el-divider />

                <el-form-item label="启用最大做种时间">
                  <el-switch v-model="generalSettings.maxSeedingTimeEnabled" />
                </el-form-item>
                <el-form-item label="最大做种时间 (分钟)" v-if="generalSettings.maxSeedingTimeEnabled"
                  :style="{ marginLeft: '20px' }">
                  <el-input-number v-model="generalSettings.maxSeedingTime" :min="-1" :max="14400"
                    controls-position="right" style="width: 150px;" />
                  <template #description>
                    <div class="form-description">-1 表示无限制</div>
                  </template>
                </el-form-item>
              </el-form>
            </el-collapse-item>
          </el-collapse>



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

      <el-tab-pane label="连接设置" name="connection">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>连接设置</span>
            </div>
          </template>

          <el-form :model="connectionSettings" label-width="150px" style="max-width: 600px;">
            <el-form-item label="监听端口">
              <el-input v-model="connectionSettings.listenPort" placeholder="监听端口" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveConnectionSettings">保存连接设置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>

      <el-tab-pane label="账户设置" name="account">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>用户凭证</span>
            </div>
          </template>

          <el-form :model="accountSettings" label-width="150px" style="max-width: 600px;">
            <el-form-item label="用户名">
              <el-input v-model="accountSettings.username" placeholder="新用户名" />
            </el-form-item>
            <el-form-item label="密码">
              <el-input v-model="accountSettings.password" type="password" placeholder="新密码" />
            </el-form-item>
            <el-form-item>
              <el-button type="warning" @click="saveCredentials">修改用户凭证</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { useTorrentStore } from '@/store/torrent'
import { ElMessage } from 'element-plus'
import { onMounted, ref, watch } from 'vue'

const torrentStore = useTorrentStore()
const activeTab = ref('general')
const activeNames = ref(['basic']) // 默认展开基本选项

// Consolidated general settings (including download and speed limits)
const generalSettings = ref({
  // Basic Options
  locale: 'zh', // Language setting
  createSubfolderEnabled: true, // Create subfolder when adding torrents
  startPausedEnabled: false, // Start added torrents in paused state
  preallocateAll: false, // Pre-allocate disk space for all files
  incompleteFilesExt: false, // Append .!qB extension to incomplete files

  // Path Settings
  defaultSavePath: '/downloads',
  tempPathEnabled: false, // Enable temp path
  tempPath: '/downloads/temp', // Temp path for incomplete torrents
  exportDir: '', // Path to copy .torrent files to
  exportDirFin: '', // Path to copy .torrent files of completed downloads to

  // Speed Limits
  globalDownloadLimit: 0, // dl_limit in KB/s -> converted to bytes in API
  globalUploadLimit: 0, // up_limit in KB/s -> converted to bytes in API
  altDownloadLimit: 10240, // alt_dl_limit in KB/s -> converted to bytes in API
  altUploadLimit: 10240, // alt_up_limit in KB/s -> converted to bytes in API

  // Queue Management
  queueingEnabled: true, // Enable queueing
  maxActiveDownloads: 5, // max_active_downloads
  maxActiveTorrents: 5, // max_active_torrents
  maxActiveUploads: 5, // max_active_uploads
  dontCountSlowTorrents: false, // Don't count slow torrents in these limits
  slowTorrentDlRateThreshold: 2, // Slow torrent download rate threshold (KB/s)
  slowTorrentUlRateThreshold: 2, // Slow torrent upload rate threshold (KB/s)
  slowTorrentInactiveTimer: 60, // Seconds a torrent should be inactive before considered slow

  // Ratio and Seeding Limits
  maxRatioEnabled: false, // Enable share ratio limit
  maxRatio: 1.0, // Max share ratio
  maxRatioAct: 0, // Action when ratio reached (0: pause, 1: remove)
  maxSeedingTimeEnabled: false, // Enable max seeding time
  maxSeedingTime: -1, // Max seeding time in minutes (-1: disabled)

  // Scheduler
  schedulerEnabled: false, // Enable scheduler
  scheduleFromHour: 8, // Scheduler start hour
  scheduleFromMin: 0, // Scheduler start minute
  scheduleToHour: 20, // Scheduler end hour
  scheduleToMin: 0, // Scheduler end minute
  schedulerDays: 0 // Scheduler days (0: every day)
})

const interfaceSettings = ref({
  theme: 'light',
  refreshInterval: 3,
  showHash: false,
  showTags: true
})

// Connection settings
const connectionSettings = ref({
  listenPort: 8080
})

// Account settings
const accountSettings = ref({
  username: '',
  password: ''
})

const saveGeneralSettings = async () => {
  try {
    // Prepare settings for API
    const newPrefs = {
      // Basic options
      locale: generalSettings.value.locale,
      create_subfolder_enabled: generalSettings.value.createSubfolderEnabled,
      start_paused_enabled: generalSettings.value.startPausedEnabled,
      preallocate_all: generalSettings.value.preallocateAll,
      incomplete_files_ext: generalSettings.value.incompleteFilesExt,

      // Path settings
      save_path: generalSettings.value.defaultSavePath,
      temp_path_enabled: generalSettings.value.tempPathEnabled,
      temp_path: generalSettings.value.tempPath,
      export_dir: generalSettings.value.exportDir,
      export_dir_fin: generalSettings.value.exportDirFin,

      // Speed limits (convert from KB/s to bytes/s)
      dl_limit: generalSettings.value.globalDownloadLimit * 1024,
      up_limit: generalSettings.value.globalUploadLimit * 1024,
      alt_dl_limit: generalSettings.value.altDownloadLimit * 1024,
      alt_up_limit: generalSettings.value.altUploadLimit * 1024,

      // Queue management
      queueing_enabled: generalSettings.value.queueingEnabled,
      max_active_downloads: generalSettings.value.maxActiveDownloads,
      max_active_uploads: generalSettings.value.maxActiveUploads,
      max_active_torrents: generalSettings.value.maxActiveTorrents,
      dont_count_slow_torrents: generalSettings.value.dontCountSlowTorrents,
      slow_torrent_dl_rate_threshold: generalSettings.value.slowTorrentDlRateThreshold,
      slow_torrent_ul_rate_threshold: generalSettings.value.slowTorrentUlRateThreshold,
      slow_torrent_inactive_timer: generalSettings.value.slowTorrentInactiveTimer,

      // Ratio and seeding limits
      max_ratio_enabled: generalSettings.value.maxRatioEnabled,
      max_ratio: generalSettings.value.maxRatio,
      max_ratio_act: generalSettings.value.maxRatioAct,
      max_seeding_time_enabled: generalSettings.value.maxSeedingTimeEnabled,
      max_seeding_time: generalSettings.value.maxSeedingTime,

      // Scheduler
      scheduler_enabled: generalSettings.value.schedulerEnabled,
      schedule_from_hour: generalSettings.value.scheduleFromHour,
      schedule_from_min: generalSettings.value.scheduleFromMin,
      schedule_to_hour: generalSettings.value.scheduleToHour,
      schedule_to_min: generalSettings.value.scheduleToMin,
      scheduler_days: generalSettings.value.schedulerDays
    };

    // Update settings in qBittorrent
    const success = await torrentStore.updatePreferences(newPrefs);

    if (success) {
      // Also save to local storage as backup
      const downloadSettings = {
        defaultSavePath: generalSettings.value.defaultSavePath,
        maxDownloadSpeed: generalSettings.value.globalDownloadLimit,
        maxUploadSpeed: generalSettings.value.globalUploadLimit,
        maxActiveDownloads: generalSettings.value.maxActiveDownloads
      };
      localStorage.setItem('qb-webui-download', JSON.stringify(downloadSettings));

      ElMessage.success('常规设置已保存');
    } else {
      ElMessage.error('保存常规设置失败');
    }
  } catch (error) {
    console.error('Error saving general settings:', error);
    ElMessage.error('保存常规设置失败: ' + error.message);
  }
}

const saveInterfaceSettings = () => {
  localStorage.setItem('qb-webui-interface', JSON.stringify(interfaceSettings.value))
  ElMessage.success('界面设置已保存')
}

const saveConnectionSettings = async () => {
  try {
    const newPrefs = {
      listen_port: parseInt(connectionSettings.value.listenPort)
    }

    const success = await torrentStore.updatePreferences(newPrefs)
    if (success) {
      ElMessage.success('连接设置已保存')
    } else {
      ElMessage.error('保存连接设置失败')
    }
  } catch (error) {
    console.error('Error saving connection settings:', error)
    ElMessage.error('保存连接设置失败: ' + error.message)
  }
}

const saveCredentials = async () => {
  if (!accountSettings.value.username.trim() || !accountSettings.value.password.trim()) {
    ElMessage.warning('请输入用户名和密码')
    return
  }

  // NOTE: Actual credential modification depends on qBittorrent API capabilities
  // The WebAPI typically doesn't allow changing credentials directly
  // This would typically involve updating the connection configuration

  // For now, we'll just show a message indicating this limitation
  ElMessage.warning('注意：通过WebUI无法直接修改qBittorrent的登录凭证，需在qBittorrent服务端修改')
}

// Apply theme when selector changes
watch(() => interfaceSettings.value.theme, (newTheme) => {
  if (window.__toggleTheme) {
    window.__toggleTheme(newTheme)
  }
})

onMounted(async () => {
  // 加载下载设置
  const savedDownload = localStorage.getItem('qb-webui-download')
  if (savedDownload) {
    try {
      const savedData = JSON.parse(savedDownload);
      generalSettings.value.defaultSavePath = savedData.defaultSavePath || '/downloads';
      generalSettings.value.globalDownloadLimit = savedData.maxDownloadSpeed || 0;
      generalSettings.value.globalUploadLimit = savedData.maxUploadSpeed || 0;
      generalSettings.value.maxActiveDownloads = savedData.maxActiveDownloads || 5;
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

  // Load current preferences from API
  await torrentStore.fetchPreferences()
  const prefs = torrentStore.preferences
  if (prefs) {
    // Basic options
    generalSettings.value.locale = prefs.locale || 'zh';
    generalSettings.value.createSubfolderEnabled = prefs.create_subfolder_enabled ?? true;
    generalSettings.value.startPausedEnabled = prefs.start_paused_enabled ?? false;
    generalSettings.value.preallocateAll = prefs.preallocate_all ?? false;
    generalSettings.value.incompleteFilesExt = prefs.incomplete_files_ext ?? false;

    // Path settings
    generalSettings.value.defaultSavePath = prefs.save_path || '/downloads';
    generalSettings.value.tempPathEnabled = prefs.temp_path_enabled ?? false;
    generalSettings.value.tempPath = prefs.temp_path || '/downloads/temp';
    generalSettings.value.exportDir = prefs.export_dir || '';
    generalSettings.value.exportDirFin = prefs.export_dir_fin || '';

    // Speed limits (convert from bytes/s to KB/s)
    generalSettings.value.globalDownloadLimit = prefs.dl_limit ? Math.round(prefs.dl_limit / 1024) : 0;
    generalSettings.value.globalUploadLimit = prefs.up_limit ? Math.round(prefs.up_limit / 1024) : 0;
    generalSettings.value.altDownloadLimit = prefs.alt_dl_limit ? Math.round(prefs.alt_dl_limit / 1024) : 10240;
    generalSettings.value.altUploadLimit = prefs.alt_up_limit ? Math.round(prefs.alt_up_limit / 1024) : 10240;

    // Queue management
    generalSettings.value.queueingEnabled = prefs.queueing_enabled ?? true;
    generalSettings.value.maxActiveDownloads = prefs.max_active_downloads ?? 5;
    generalSettings.value.maxActiveUploads = prefs.max_active_uploads ?? 5;
    generalSettings.value.maxActiveTorrents = prefs.max_active_torrents ?? 5;
    generalSettings.value.dontCountSlowTorrents = prefs.dont_count_slow_torrents ?? false;
    generalSettings.value.slowTorrentDlRateThreshold = prefs.slow_torrent_dl_rate_threshold ?? 2;
    generalSettings.value.slowTorrentUlRateThreshold = prefs.slow_torrent_ul_rate_threshold ?? 2;
    generalSettings.value.slowTorrentInactiveTimer = prefs.slow_torrent_inactive_timer ?? 60;

    // Ratio and seeding limits
    generalSettings.value.maxRatioEnabled = prefs.max_ratio_enabled ?? false;
    generalSettings.value.maxRatio = prefs.max_ratio ?? 1.0;
    generalSettings.value.maxRatioAct = prefs.max_ratio_act ?? 0;
    generalSettings.value.maxSeedingTimeEnabled = prefs.max_seeding_time_enabled ?? false;
    generalSettings.value.maxSeedingTime = prefs.max_seeding_time ?? -1;

    // Scheduler
    generalSettings.value.schedulerEnabled = prefs.scheduler_enabled ?? false;
    generalSettings.value.scheduleFromHour = prefs.schedule_from_hour ?? 8;
    generalSettings.value.scheduleFromMin = prefs.schedule_from_min ?? 0;
    generalSettings.value.scheduleToHour = prefs.schedule_to_hour ?? 20;
    generalSettings.value.scheduleToMin = prefs.schedule_to_min ?? 0;
    generalSettings.value.schedulerDays = prefs.scheduler_days ?? 0;

    // Connection settings
    connectionSettings.value.listenPort = prefs.listen_port || 8080;
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

/* 表单描述样式 */
.form-description {
  font-size: var(--font-size-sm);
  color: var(--text-tertiary);
  margin-top: 4px;
}

/* 时间范围选择样式 */
.time-range {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
