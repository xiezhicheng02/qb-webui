import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNotificationStore = defineStore('notification', () => {
  // State
  const notifications = ref([])
  let nextId = 1

  // Actions
  function addNotification({ type = 'info', title = '', message = '', duration = 5000 }) {
    const id = nextId++
    const notification = {
      id,
      type, // 'success', 'error', 'warning', 'info'
      title,
      message,
      timestamp: new Date(),
      duration
    }

    notifications.value.push(notification)

    // Auto-remove after duration
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, duration)
    }

    return id
  }

  function removeNotification(id) {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index !== -1) {
      notifications.value.splice(index, 1)
    }
  }

  function clearAll() {
    notifications.value = []
  }

  // Convenience methods for different notification types
  function success(title, message, duration = 5000) {
    return addNotification({ type: 'success', title, message, duration })
  }

  function error(title, message, duration = 8000) {
    return addNotification({ type: 'error', title, message, duration })
  }

  function warning(title, message, duration = 6000) {
    return addNotification({ type: 'warning', title, message, duration })
  }

  function info(title, message, duration = 5000) {
    return addNotification({ type: 'info', title, message, duration })
  }

  return {
    // State
    notifications,
    // Actions
    addNotification,
    removeNotification,
    clearAll,
    success,
    error,
    warning,
    info
  }
})
