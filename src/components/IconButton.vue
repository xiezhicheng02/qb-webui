<template>
  <button
    :type="type"
    class="inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
    :class="buttonClasses"
    :disabled="disabled"
    :aria-label="ariaLabel"
  >
    <span v-if="$slots.default" class="mr-2">
      <slot name="icon" />
    </span>
    <span v-if="label">
      {{ label }}
    </span>
    <slot v-else />
  </button>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (value) => [
      'default', 'primary', 'secondary', 'success', 'warning', 'danger', 'ghost', 'link'
    ].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  type: {
    type: String,
    default: 'button'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    default: undefined
  },
  ariaLabel: {
    type: String,
    required: true
  }
});

const buttonClasses = computed(() => {
  const variantClasses = {
    'default': 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 focus:ring-gray-500 dark:focus:ring-gray-400',
    'primary': 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 focus:ring-blue-500 dark:focus:ring-blue-400',
    'secondary': 'bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 focus:ring-purple-500 dark:focus:ring-purple-400',
    'success': 'bg-green-600 text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 focus:ring-green-500 dark:focus:ring-green-400',
    'warning': 'bg-yellow-600 text-white hover:bg-yellow-700 dark:bg-yellow-700 dark:hover:bg-yellow-600 focus:ring-yellow-500 dark:focus:ring-yellow-400',
    'danger': 'bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 focus:ring-red-500 dark:focus:ring-red-400',
    'ghost': 'bg-transparent text-gray-900 hover:bg-gray-100 dark:text-gray-50 dark:hover:bg-gray-700 focus:ring-gray-500 dark:focus:ring-gray-400',
    'link': 'bg-transparent text-blue-600 underline-offset-4 hover:underline dark:text-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400'
  };
  
  const sizeClasses = {
    'sm': 'h-8 px-2 text-sm',
    'md': 'h-9 px-3 text-sm',
    'lg': 'h-10 px-4 text-base'
  };

  return [
    variantClasses[props.variant],
    sizeClasses[props.size],
    'ring-offset-white dark:ring-offset-gray-900'
  ];
});
</script>

<style scoped>
/* Additional styling can be added here if needed */
</style>