<template>
  <button
    :disabled="disabled || loading"
    :type="nativeType"
    class="inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
    :class="[variantClasses, sizeClasses]"
  >
    <svg
      v-if="loading"
      class="animate-spin -ml-1 mr-2 h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'
type NativeType = 'button' | 'submit' | 'reset'

const props = withDefaults(defineProps<{
  variant?: Variant
  size?: Size
  loading?: boolean
  disabled?: boolean
  nativeType?: NativeType
}>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false,
  nativeType: 'button',
})

const variantClasses = computed(() => {
  const variants: Record<Variant, string> = {
    primary: 'bg-violet-600 text-white hover:bg-violet-700 focus:ring-violet-500 dark:bg-violet-600 dark:hover:bg-violet-700',
    secondary: 'border-2 border-slate-300 text-slate-700 hover:bg-slate-50 focus:ring-slate-400 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800',
    ghost: 'text-slate-600 hover:bg-slate-100 focus:ring-slate-400 dark:text-slate-300 dark:hover:bg-slate-800',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 dark:bg-red-600 dark:hover:bg-red-700',
  }
  return variants[props.variant]
})

const sizeClasses = computed(() => {
  const sizes: Record<Size, string> = {
    sm: 'px-3 py-1.5 text-sm rounded-lg',
    md: 'px-4 py-2 text-base rounded-xl',
    lg: 'px-6 py-3 text-lg rounded-xl',
  }
  return sizes[props.size]
})
</script>