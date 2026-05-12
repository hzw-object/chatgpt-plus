<template>
  <div
    class="rounded-xl bg-white dark:bg-slate-900 shadow-sm overflow-hidden"
    :class="[paddingClass, borderClass, shadowClass]"
  >
    <div v-if="$slots.header" class="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
      <slot name="header" />
    </div>
    <div class="px-4 py-4">
      <slot />
    </div>
    <div v-if="$slots.footer" class="px-4 py-3 border-t border-slate-200 dark:border-slate-700">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type Padding = 'none' | 'sm' | 'md' | 'lg'
type Shadow = 'none' | 'sm' | 'md' | 'lg'

const props = withDefaults(defineProps<{
  padding?: Padding
  border?: boolean
  shadow?: Shadow
}>(), {
  padding: 'md',
  border: false,
  shadow: 'sm',
})

const paddingClass = computed(() => {
  const paddingMap: Record<Padding, string> = {
    none: '',
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-6',
  }
  return paddingMap[props.padding]
})

const borderClass = computed(() =>
  props.border ? 'border-2 border-slate-200 dark:border-slate-700' : ''
)

const shadowClass = computed(() => {
  const shadowMap: Record<Shadow, string> = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
  }
  return shadowMap[props.shadow]
})
</script>