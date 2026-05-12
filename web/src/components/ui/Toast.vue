<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-md text-white max-w-sm"
          :class="toastClass(toast.type)"
        >
          <i class="iconfont text-lg" :class="toastIcon(toast.type)" />
          <span class="text-sm font-medium">{{ toast.message }}</span>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: number
  message: string
  type: ToastType
}

let toastId = 0
const toasts = ref<Toast[]>([])

const toastClass = (type: ToastType) => ({
  success: 'bg-green-500',
  error: 'bg-red-500',
  warning: 'bg-yellow-500',
  info: 'bg-blue-500',
}[type])

const toastIcon = (type: ToastType) => ({
  success: 'icon-success',
  error: 'icon-error',
  warning: 'icon-warning',
  info: 'icon-info',
}[type])

const addToast = (message: string, type: ToastType = 'info', duration = 3000) => {
  const id = ++toastId
  toasts.value.push({ id, message, type })
  setTimeout(() => removeToast(id), duration)
}

const removeToast = (id: number) => {
  const index = toasts.value.findIndex(t => t.id === id)
  if (index !== -1) {
    toasts.value.splice(index, 1)
  }
}

// Static methods for global access
let showToastFn: ((message: string, type?: ToastType, duration?: number) => void) | null = null

onMounted(() => {
  showToastFn = addToast
})

onUnmounted(() => {
  showToastFn = null
})

const showToast = (message: string, type: ToastType = 'info', duration = 3000) => {
  if (showToastFn) {
    showToastFn(message, type, duration)
  }
}

defineExpose({ showToast, addToast })
</script>

<style scoped>
.toast-enter-active {
  transition: all 0.3s ease;
}

.toast-leave-active {
  transition: all 0.2s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>