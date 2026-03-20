<template>
  <div class="login-container">
    <!-- Background Effects -->
    <div class="bg-grid"></div>
    <div class="bg-gradient-mesh"></div>

    <!-- Login Card -->
    <div class="login-card glass-panel">
      <div class="card-header">
        <div class="logo-icon">
          <svg viewBox="0 0 80 80" fill="none">
            <defs>
              <linearGradient id="login-logo-grad" x1="10" y1="10" x2="70" y2="70" gradientUnits="userSpaceOnUse">
                <stop stop-color="#22d3ee"/>
                <stop offset="1" stop-color="#c4b5fd"/>
              </linearGradient>
            </defs>
            <polygon points="40,16 58,26 58,46 40,56 22,46 22,26" stroke="url(#login-logo-grad)" stroke-width="2.5" fill="none"/>
            <path d="M40 28 L40 44" stroke="#22d3ee" stroke-width="3" stroke-linecap="round"/>
            <path d="M33 38 L40 46 L47 38" stroke="#22d3ee" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="14" cy="40" r="3" fill="#a78bfa" opacity="0.5"/>
            <circle cx="66" cy="40" r="3" fill="#22d3ee" opacity="0.5"/>
            <circle cx="40" cy="8" r="2.5" fill="#a78bfa" opacity="0.4"/>
            <circle cx="40" cy="72" r="2.5" fill="#22d3ee" opacity="0.4"/>
            <line x1="17" y1="40" x2="22" y2="38" stroke="#a78bfa" stroke-width="1" opacity="0.3"/>
            <line x1="58" y1="34" x2="63" y2="40" stroke="#22d3ee" stroke-width="1" opacity="0.3"/>
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
  background-color: var(--bg-base);
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
    linear-gradient(var(--accent-primary), transparent 1px),
    linear-gradient(90deg, var(--accent-primary), transparent 1px);
  opacity: 0.05;
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
    radial-gradient(circle at 20% 30%, var(--accent-primary) 0%, transparent 40%),
    radial-gradient(circle at 80% 70%, var(--accent-secondary) 0%, transparent 40%);
  opacity: 0.08;
  pointer-events: none;
  animation: meshShift 10s ease-in-out infinite alternate;
}

@keyframes meshShift {
  0% { transform: scale(1) translate(0, 0); }
  100% { transform: scale(1.1) translate(-20px, -20px); }
}

/* Login Card */
.login-card {
  position: relative;
  width: 100%;
  max-width: 420px;
  padding: 40px;
  border-radius: 16px;
  background: var(--bg-card);
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
</style>
