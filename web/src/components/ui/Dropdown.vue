<template>
  <div class="relative inline-block" ref="containerRef">
    <div @click="toggle" class="cursor-pointer">
      <slot name="trigger" />
    </div>
    <Transition name="dropdown">
      <div
        v-if="isOpen"
        class="absolute z-50 mt-2 min-w-[12rem] rounded-xl bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden"
        :class="alignClass"
      >
        <slot />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

type Align = 'left' | 'right'

const props = withDefaults(defineProps<{
  align?: Align
}>(), {
  align: 'left',
})

const isOpen = ref(false)
const containerRef = ref<HTMLElement | null>(null)

const alignClass = computed(() =>
  props.align === 'right' ? 'right-0' : 'left-0'
)

const toggle = () => {
  isOpen.value = !isOpen.value
}

const close = () => {
  isOpen.value = false
}

const handleClickOutside = (event: MouseEvent) => {
  if (containerRef.value && !containerRef.value.contains(event.target as Node)) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

defineExpose({ close })
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.15s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>