<template>
  <div class="login-container">
    <!-- Background Effects -->
    <div class="bg-grid"></div>
    <div class="bg-gradient-mesh"></div>
    <div class="particles">
      <div v-for="n in 20" :key="n" class="particle" :style="getParticleStyle(n)"></div>
    </div>

    <!-- Login Card -->
    <div class="login-card glass-panel">
      <div class="card-header">
        <div class="logo-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
            <line x1="12" y1="22.08" x2="12" y2="12"></line>
          </svg>
        </div>
        <h1 class="title">QB-WebUI</h1>
        <p class="subtitle">qBittorrent Web 管理界面</p>
      </div>

      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="rules"
        class="login-form"
        @submit.prevent="handleLogin"
      >
        <el-form-item prop="username" class="form-item">
          <div class="input-wrapper">
            <el-input
              v-model="loginForm.username"
              placeholder="用户名"
              prefix-icon="User"
              class="cyber-input"
            />
            <div class="input-glow"></div>
          </div>
        </el-form-item>

        <el-form-item prop="password" class="form-item">
          <div class="input-wrapper">
            <el-input
              v-model="loginForm.password"
              placeholder="密码"
              prefix-icon="Lock"
              type="password"
              show-password
              class="cyber-input"
            />
            <div class="input-glow"></div>
          </div>
        </el-form-item>

        <el-form-item>
          <button
            type="submit"
            class="login-button"
            :class="{ loading: loading }"
            @click="handleLogin"
          >
            <span class="btn-text">登录</span>
            <div class="btn-glitch"></div>
          </button>
        </el-form-item>
      </el-form>

      <div class="card-footer">
        <p>Default: admin / (empty)</p>
        <div class="status-line"></div>
      </div>
    </div>

    <!-- Scanline Effect -->
    <div class="scanlines"></div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import qbittorrentAPI from '@/api/qbittorrent'

const router = useRouter()
const loginFormRef = ref()
const loading = ref(false)

const loginForm = reactive({
  username: 'admin',
  password: ''
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ]
}

// Particle animation styles
const getParticleStyle = (index) => {
  const size = Math.random() * 4 + 1
  const left = Math.random() * 100
  const top = Math.random() * 100
  const delay = Math.random() * 5
  const duration = Math.random() * 10 + 10
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${left}%`,
    top: `${top}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`
  }
}

// Check auth status
const checkAuthStatus = async () => {
  try {
    const originalHandle403 = qbittorrentAPI.handle403Error
    qbittorrentAPI.handle403Error = () => {
      console.log('403 detected during login page auth check')
    }

    const version = await qbittorrentAPI.getVersion()
    qbittorrentAPI.handle403Error = originalHandle403

    if (version) {
      router.push('/torrents/all')
      return true
    }
  } catch (error) {
    console.log('Not authenticated, showing login page')
  }
  return false
}

const handleLogin = async () => {
  if (!loginFormRef.value) return

  try {
    await loginFormRef.value.validate()
    loading.value = true

    qbittorrentAPI.setConfig(
      loginForm.username,
      loginForm.password
    )

    const success = await qbittorrentAPI.login()

    if (success) {
      const connectionInfo = {
        host: 'localhost',
        port: 8088,
        username: loginForm.username,
        lastLogin: new Date().toISOString()
      }
      localStorage.setItem('qb-webui-connection', JSON.stringify(connectionInfo))

      ElMessage.success('登录成功')
      router.push('/torrents/all')
    } else {
      ElMessage.error('登录失败，请检查用户名和密码')
    }
  } catch (error) {
    console.error('Login error:', error)
    ElMessage.error('登录失败，请检查连接设置')
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  const isLoggedIn = await checkAuthStatus()
  if (!isLoggedIn) {
    const savedConnection = localStorage.getItem('qb-webui-connection')
    if (savedConnection) {
      try {
        const settings = JSON.parse(savedConnection)
        loginForm.username = settings.username || 'admin'
      } catch (e) {
        console.error('Failed to load saved connection:', e)
      }
    }
  }
})
</script>

<style scoped>
.login-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100vw;
  background-color: var(--bg-light);
  overflow: hidden;
}

/* Background Effects */
.bg-grid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image:
    linear-gradient(rgba(2, 132, 199, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(2, 132, 199, 0.05) 1px, transparent 1px);
  background-size: 50px 50px;
  pointer-events: none;
}

.bg-gradient-mesh {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background:
    radial-gradient(circle at 20% 30%, rgba(2, 132, 199, 0.08) 0%, transparent 40%),
    radial-gradient(circle at 80% 70%, rgba(124, 58, 237, 0.08) 0%, transparent 40%);
  pointer-events: none;
  animation: meshShift 10s ease-in-out infinite alternate;
}

@keyframes meshShift {
  0% { transform: scale(1) translate(0, 0); }
  100% { transform: scale(1.1) translate(-20px, -20px); }
}

.particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.particle {
  position: absolute;
  background: var(--accent-cyan);
  border-radius: 50%;
  opacity: 0.3;
  animation: floatParticle linear infinite;
}

@keyframes floatParticle {
  0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
  10% { opacity: 0.3; }
  90% { opacity: 0.3; }
  100% { transform: translateY(-100vh) rotate(720deg); opacity: 0; }
}

/* Login Card */
.login-card {
  position: relative;
  width: 100%;
  max-width: 420px;
  padding: 40px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
  box-shadow:
    0 4px 20px rgba(0, 0, 0, 0.08),
    0 0 0 1px rgba(2, 132, 199, 0.1),
    0 10px 40px rgba(2, 132, 199, 0.05);
  z-index: 10;
  animation: cardEnter 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes cardEnter {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Header */
.card-header {
  text-align: center;
  margin-bottom: 32px;
}

.logo-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto 16px;
  color: var(--accent-cyan);
  filter: drop-shadow(0 0 8px rgba(2, 132, 199, 0.3));
}

.title {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: 700;
  letter-spacing: 4px;
  margin-bottom: 8px;
  background: var(--accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--text-muted);
  letter-spacing: 2px;
  text-transform: uppercase;
}

/* Form */
.login-form {
  margin-top: 24px;
}

.form-item {
  margin-bottom: 24px;
}

.input-wrapper {
  position: relative;
}

.input-glow {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: var(--accent-cyan);
  transform: scaleX(0);
  transition: transform 0.3s ease;
  box-shadow: 0 0 10px var(--accent-cyan);
}

/* Override Element Plus styles */
:deep(.cyber-input) {
  background: transparent !important;
}

:deep(.cyber-input .el-input__wrapper) {
  background: transparent !important;
  box-shadow: none !important;
  border: none !important;
  border-bottom: 1px solid var(--border-color) !important;
  border-radius: 0 !important;
  padding: 12px 0 !important;
  transition: all 0.3s ease;
}

:deep(.cyber-input .el-input__inner) {
  background: transparent !important;
  color: var(--text-primary) !important;
  font-family: var(--font-mono) !important;
  font-size: var(--text-base) !important;
  letter-spacing: 1px !important;
}

:deep(.cyber-input .el-input__inner::placeholder) {
  color: var(--text-muted) !important;
}

:deep(.cyber-input .el-input__prefix) {
  color: var(--text-secondary);
}

:deep(.cyber-input .el-input__wrapper:hover) {
  border-color: var(--text-secondary) !important;
}

:deep(.cyber-input .el-input__wrapper.is-focus) {
  border-color: var(--accent-cyan) !important;
  box-shadow: 0 2px 0 0 var(--accent-cyan) !important;
}

/* Login Button */
.login-button {
  position: relative;
  width: 100%;
  padding: 14px 24px;
  margin-top: 16px;
  background: var(--accent-gradient);
  border: none;
  border-radius: 8px;
  color: #fff;
  font-family: var(--font-display);
  font-size: var(--text-base);
  font-weight: 700;
  letter-spacing: 2px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(2, 132, 199, 0.3);
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(2, 132, 199, 0.4);
}

.login-button:active {
  transform: translateY(0);
}

.btn-glitch {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transform: translateX(-100%);
  transition: transform 0.5s;
}

.login-button:hover .btn-glitch {
  transform: translateX(100%);
}

/* Footer */
.card-footer {
  margin-top: 32px;
  text-align: center;
}

.card-footer p {
  font-size: var(--text-xs);
  color: var(--text-muted);
  letter-spacing: 1px;
  margin-bottom: 8px;
}

.status-line {
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--accent-cyan), transparent);
  opacity: 0.5;
}

/* Scanlines */
.scanlines {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.03),
    rgba(0, 0, 0, 0.03) 1px,
    transparent 1px,
    transparent 2px
  );
  pointer-events: none;
  z-index: 1000;
  opacity: 0.5;
}
</style>
