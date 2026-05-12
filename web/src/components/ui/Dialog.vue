<template>
  <Teleport to="body">
    <Transition name="dialog">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="handleClose"
      >
        <div class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" @click="handleClose" />
        <div
          class="relative bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-hidden"
          :class="sizeClass"
        >
          <button
            v-if="showClose"
            type="button"
            class="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            @click="handleClose"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div v-if="$slots.header" class="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
            <slot name="header" />
          </div>
          <div class="px-6 py-4 overflow-y-auto max-h-[60vh]">
            <slot />
          </div>
          <div v-if="$slots.footer" class="px-6 py-4 border-t border-slate-200 dark:border-slate-700">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'

type Size = 'sm' | 'md' | 'lg' | 'xl' | 'full'

const props = withDefaults(defineProps<{
  modelValue: boolean
  size?: Size
  showClose?: boolean
  closeOnOverlay?: boolean
}>(), {
  size: 'md',
  showClose: true,
  closeOnOverlay: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'close': []
}>()

const sizeClass = computed(() => {
  const sizeMap: Record<Size, string> = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full',
  }
  return sizeMap[props.size]
})

const handleClose = () => {
  if (props.closeOnOverlay) {
    emit('update:modelValue', false)
    emit('close')
  }
}

// Prevent body scroll when dialog is open
watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})
</script>

<style scoped>
.dialog-enter-active,
.dialog-leave-active {
  transition: all 0.2s ease;
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
}

.dialog-enter-from .relative,
.dialog-leave-to .relative {
  transform: scale(0.95);
}
</style>