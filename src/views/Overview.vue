<template>
  <div class="overview">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <el-icon class="stat-icon" color="#409eff"><Download /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ stats.downloading }}</div>
              <div class="stat-label">下载中</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <el-icon class="stat-icon" color="#67c23a"><Upload /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ stats.uploading }}</div>
              <div class="stat-label">上传中</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <el-icon class="stat-icon" color="#e6a23c"><Finished /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ stats.completed }}</div>
              <div class="stat-label">已完成</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <el-icon class="stat-icon" color="#f56c6c"><Warning /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ stats.error }}</div>
              <div class="stat-label">错误</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card class="speed-card" style="margin-top: var(--spacing-lg);">
      <template #header>
        <div class="card-header">
          <span>速度监控</span>
        </div>
      </template>
      <div class="speed-info">
        <div class="speed-item">
          <span class="speed-label">下载速度:</span>
          <span class="speed-value download">{{ formatSpeed(stats.downloadSpeed) }}</span>
        </div>
        <div class="speed-item">
          <span class="speed-label">上传速度:</span>
          <span class="speed-value upload">{{ formatSpeed(stats.uploadSpeed) }}</span>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const stats = ref({
  downloading: 5,
  uploading: 3,
  completed: 42,
  error: 1,
  downloadSpeed: 1024 * 1024 * 2.5, // 2.5 MB/s
  uploadSpeed: 1024 * 1024 * 0.8 // 0.8 MB/s
})

const formatSpeed = (bytes) => {
  if (bytes < 1024) return bytes + ' B/s'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB/s'
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB/s'
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB/s'
}
</script>

<style scoped>
.overview {
  padding: 10px;
}

.stat-card {
  cursor: pointer;
  transition: transform 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-content {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
}

.stat-icon {
  margin-right: 15px;
}

.stat-info {
  text-align: center;
}

.stat-value {
  font-size: var(--text-xl);
  font-weight: bold;
  color: var(--text-primary);
}

.stat-label {
  font-size: var(--text-base);
  color: var(--text-muted);
  margin-top: 5px;
}

.card-header {
  font-weight: bold;
}

.speed-info {
  display: flex;
  justify-content: space-around;
  padding: 20px 0;
}

.speed-item {
  text-align: center;
}

.speed-label {
  display: block;
  font-size: var(--text-base);
  color: var(--text-muted);
  margin-bottom: 8px;
}

.speed-value {
  font-size: var(--text-lg);
  font-weight: bold;
}

.speed-value.download {
  color: var(--speed-download);
}

.speed-value.upload {
  color: var(--speed-upload);
}
</style>
