<template>
  <span 
    class="inline-flex items-center rounded-full font-medium whitespace-nowrap"
    :class="badgeClasses"
  >
    <slot />
  </span>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  type: {
    type: String,
    default: 'default',
    validator: (value) => [
      'default', 
      'primary', 
      'secondary', 
      'success', 
      'warning', 
      'danger', 
      'info',
      'completed',
      'downloading',
      'paused',
      'error',
      'queued',
      'checking'
    ].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg'].includes(value)
  }
});

const badgeClasses = computed(() => {
  const typeClasses = {
    // Default status types
    'default': 'bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-color)]',
    'primary': 'bg-[var(--accent-primary-soft)] text-[var(--accent-primary)]',
    'secondary': 'bg-[var(--accent-secondary-soft)] text-[var(--accent-secondary)]',
    'success': 'bg-[var(--status-success-soft)] text-[var(--status-success)]',
    'warning': 'bg-[var(--status-warning-soft)] text-[var(--status-warning)]',
    'danger': 'bg-[var(--status-error-soft)] text-[var(--status-error)]',
    'info': 'bg-[var(--status-info-soft)] text-[var(--status-info)]',
    
    // Specific torrent statuses
    'completed': 'bg-[var(--status-success-soft)] text-[var(--status-success)] border border-[var(--status-success)]',
    'downloading': 'bg-[var(--speed-download-soft)] text-[var(--speed-download)] border border-[var(--speed-download)]',
    'paused': 'bg-[var(--text-muted-soft)] text-[var(--text-muted)] border border-[var(--text-muted)]',
    'error': 'bg-[var(--status-error-soft)] text-[var(--status-error)] border border-[var(--status-error)]',
    'queued': 'bg-[var(--accent-indigo-soft)] text-[var(--accent-indigo)] border border-[var(--accent-indigo)]',
    'checking': 'bg-[var(--accent-purple-soft)] text-[var(--accent-purple)] border border-[var(--accent-purple)]'
  };

  const sizeClasses = {
    'xs': 'text-[var(--text-xs)] px-1.5 py-0.5',
    'sm': 'text-[var(--text-xs)] px-2 py-1',
    'md': 'text-[var(--text-sm)] px-2.5 py-1.5',
    'lg': 'text-[var(--text-sm)] px-3 py-2'
  };

  return [
    'inline-flex items-center font-medium',
    typeClasses[props.type],
    sizeClasses[props.size]
  ];
});
</script>

<style scoped>
/* Additional styling can be added here if needed */
</style>