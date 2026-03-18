import { createRouter, createWebHistory } from 'vue-router'
import qbittorrentAPI from '@/api/qbittorrent'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    redirect: '/torrents/all'
  },
  {
    path: '/torrents/:filter?',
    name: 'Torrents',
    component: () => import('@/views/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/Settings.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Cache authentication state to avoid repeated API calls
let authCheckCache = {
  isValid: false,
  lastCheck: 0,
  checkPromise: null
}

// Navigation guard to check authentication
router.beforeEach(async (to, from, next) => {
  // Skip auth check for login page
  if (to.path === '/login') {
    next()
    return
  }

  // Check if route requires authentication
  if (to.meta.requiresAuth) {
    // Check if we have a saved SID in localStorage
    const savedSid = localStorage.getItem('qb-webui-sid')
    if (!savedSid) {
      // No SID found, redirect to login
      next('/login')
      return
    }

    // Use cached auth check if recent (within 30 seconds)
    const now = Date.now()
    if (authCheckCache.isValid && (now - authCheckCache.lastCheck) < 30000) {
      next()
      return
    }

    // Prevent multiple simultaneous auth checks
    if (!authCheckCache.checkPromise) {
      authCheckCache.checkPromise = (async () => {
        try {
          // Temporarily disable 403 error handling during auth check
          const originalHandle403 = qbittorrentAPI.handle403Error
          let authCheckFailed = false
          qbittorrentAPI.handle403Error = () => {
            authCheckFailed = true
          }

          // Try to verify connection by getting version
          const version = await qbittorrentAPI.getVersion()

          // Restore original 403 handler
          qbittorrentAPI.handle403Error = originalHandle403

          const isValid = !authCheckFailed && !!version
          authCheckCache.isValid = isValid
          authCheckCache.lastCheck = now
          return isValid
        } catch (error) {
          authCheckCache.isValid = false
          authCheckCache.lastCheck = now
          return false
        } finally {
          authCheckCache.checkPromise = null
        }
      })()
    }

    const isValid = await authCheckCache.checkPromise
    if (isValid) {
      next()
    } else {
      next('/login')
    }
  } else {
    next()
  }
})

export default router
