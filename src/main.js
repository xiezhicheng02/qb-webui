import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import './assets/main.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import router from './router'
import qbittorrentAPI from './api/qbittorrent'
import NotificationContainer from './components/NotificationContainer.vue'

const app = createApp(App)

// 注册所有 Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 注册全局组件
app.component('NotificationContainer', NotificationContainer)

// API configuration is now handled by the login page
// The login page will set the configuration after successful authentication

app.use(createPinia())
app.use(router)
app.use(ElementPlus)

// === Theme System ===
function applyTheme(preference) {
  const html = document.documentElement
  if (preference === 'dark') {
    html.classList.add('dark')
  } else if (preference === 'light') {
    html.classList.remove('dark')
  } else {
    // auto — follow system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
  }
}

// Global theme toggle for Settings page
window.__toggleTheme = (preference) => {
  localStorage.setItem('theme-preference', preference)
  applyTheme(preference)
}

// Apply saved theme on startup
const savedTheme = localStorage.getItem('theme-preference') || 'light'
applyTheme(savedTheme)

// Listen for system theme changes (only matters in 'auto' mode)
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  const pref = localStorage.getItem('theme-preference') || 'light'
  if (pref === 'auto') {
    applyTheme('auto')
  }
})

app.mount('#app')
