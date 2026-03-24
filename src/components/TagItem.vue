<template>
  <div 
    class="inline-flex items-center rounded-full font-medium cursor-pointer transition-all duration-200"
    :class="tagClasses"
  >
    <span class="truncate">
      <slot />
    </span>
    <button 
      v-if="closable"
      @click.stop="handleClose"
      class="ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center rounded-full w-4 h-4"
      :class="closeButtonClasses"
      aria-label="Remove tag"
    >
      <svg 
        class="w-3 h-3 flex-shrink-0" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        stroke-width="2"
      >
        <path d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (value) => [
      'default', 'primary', 'secondary', 'success', 'warning', 'danger', 'info',
      'completed', 'downloading', 'paused', 'error', 'queued', 'checking'
    ].includes(value)
  },
  closable: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  }
})

const emit = defineEmits(['close'])

const tagClasses = computed(() => {
  // Size classes
  const sizeClasses = {
    'sm': 'px-2 py-0.5 text-xs',
    'md': 'px-3 py-1 text-sm', 
    'lg': 'px-3.5 py-1.5 text-base'
  }

  // Variant color classes
  const variantColors = {
    // Default status types
    'default': 'bg-[var(--bg-card)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)]',
    'primary': 'bg-[var(--accent-primary-soft)] text-[var(--accent-primary)] hover:bg-[var(--accent-primary-softer)]',
    'secondary': 'bg-[var(--accent-secondary-soft)] text-[var(--accent-secondary)] hover:bg-[var(--accent-secondary-softer)]',
    'success': 'bg-[var(--status-success-soft)] text-[var(--status-success)] hover:bg-[var(--status-success-softer)]',
    'warning': 'bg-[var(--status-warning-soft)] text-[var(--status-warning)] hover:bg-[var(--status-warning-softer)]',
    'danger': 'bg-[var(--status-error-soft)] text-[var(--status-error)] hover:bg-[var(--status-error-softer)]',
    'info': 'bg-[var(--status-info-soft)] text-[var(--status-info)] hover:bg-[var(--status-info-softer)]',
    
    // Specific torrent statuses
    'completed': 'bg-[var(--status-success-soft)] text-[var(--status-success)] hover:bg-[var(--status-success-softer)]',
    'downloading': 'bg-[var(--speed-download-soft)] text-[var(--speed-download)] hover:bg-[var(--speed-download-softer)]',
    'paused': 'bg-[var(--text-muted-soft)] text-[var(--text-muted)] hover:bg-[var(--text-muted-softer)]',
    'error': 'bg-[var(--status-error-soft)] text-[var(--status-error)] hover:bg-[var(--status-error-softer)]',
    'queued': 'bg-[var(--accent-indigo-soft)] text-[var(--accent-indigo)] hover:bg-[var(--accent-indigo-softer)]',
    'checking': 'bg-[var(--accent-purple-soft)] text-[var(--accent-purple)] hover:bg-[var(--accent-purple-softer)]'
  }

  return [
    'inline-flex items-center font-medium transition-all duration-200 whitespace-nowrap',
    sizeClasses[props.size],
    variantColors[props.variant],
    props.closable ? 'group' : ''
  ]
})

const closeButtonClasses = computed(() => {
  const variantColors = {
    'default': 'hover:bg-[var(--text-primary)] focus:ring-[var(--text-primary)] focus:ring-offset-[var(--bg-base)]',
    'primary': 'hover:bg-[var(--accent-primary)] focus:ring-[var(--accent-primary)] focus:ring-offset-[var(--accent-primary-soft)]',
    'secondary': 'hover:bg-[var(--accent-secondary)] focus:ring-[var(--accent-secondary)] focus:ring-offset-[var(--accent-secondary-soft)]',
    'success': 'hover:bg-[var(--status-success)] focus:ring-[var(--status-success)] focus:ring-offset-[var(--status-success-soft)]',
    'warning': 'hover:bg-[var(--status-warning)] focus:ring-[var(--status-warning)] focus:ring-offset-[var(--status-warning-soft)]',
    'danger': 'hover:bg-[var(--status-error)] focus:ring-[var(--status-error)] focus:ring-offset-[var(--status-error-soft)]',
    'info': 'hover:bg-[var(--status-info)] focus:ring-[var(--status-info)] focus:ring-offset-[var(--status-info-soft)]',
    'completed': 'hover:bg-[var(--status-success)] focus:ring-[var(--status-success)] focus:ring-offset-[var(--status-success-soft)]',
    'downloading': 'hover:bg-[var(--speed-download)] focus:ring-[var(--speed-download)] focus:ring-offset-[var(--speed-download-soft)]',
    'paused': 'hover:bg-[var(--text-muted)] focus:ring-[var(--text-muted)] focus:ring-offset-[var(--text-muted-soft)]',
    'error': 'hover:bg-[var(--status-error)] focus:ring-[var(--status-error)] focus:ring-offset-[var(--status-error-soft)]',
    'queued': 'hover:bg-[var(--accent-indigo)] focus:ring-[var(--accent-indigo)] focus:ring-offset-[var(--accent-indigo-soft)]',
    'checking': 'hover:bg-[var(--accent-purple)] focus:ring-[var(--accent-purple)] focus:ring-offset-[var(--accent-purple-soft)]'
  }

  return [
    variantColors[props.variant],
    'focus:outline-none focus:ring-2 focus:ring-offset-2 bg-opacity-20'
  ]
})

const handleClose = () => {
  emit('close')
}
</script>

<style scoped>
</style>