<template>
  <BaseDialog :show="show" :title="t('usage.exporting')" width="narrow" @close="handleCancel">
    <div class="space-y-4">
      <div class="text-sm text-slate-600 dark:text-slate-400">
        {{ t('usage.exportingProgress') }}
      </div>
      <div class="flex items-center justify-between text-sm text-slate-700 dark:text-slate-300">
        <span>{{ t('usage.exportedCount', { current, total }) }}</span>
        <span class="font-medium text-slate-900 dark:text-white">{{ normalizedProgress }}%</span>
      </div>
      <div class="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700">
        <div
          role="progressbar"
          :aria-valuenow="normalizedProgress"
          aria-valuemin="0"
          aria-valuemax="100"
          :aria-label="`${t('usage.exportingProgress')}: ${normalizedProgress}%`"
          class="h-2 rounded-full bg-violet-600 transition-all"
          :style="{ width: `${normalizedProgress}%` }"
        ></div>
      </div>
      <div v-if="estimatedTime" class="text-xs text-slate-500 dark:text-slate-400" aria-live="polite" aria-atomic="true">
        {{ t('usage.estimatedTime', { time: estimatedTime }) }}
      </div>
    </div>

    <template #footer>
      <button
        @click="handleCancel"
        type="button"
        class="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 dark:focus:ring-offset-slate-800"
      >
        {{ t('usage.cancelExport') }}
      </button>
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseDialog from './BaseDialog.vue'

interface Props {
  show: boolean
  progress: number
  current: number
  total: number
  estimatedTime: string
}

interface Emits {
  (e: 'cancel'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const { t } = useI18n()

const normalizedProgress = computed(() => {
  const value = Number.isFinite(props.progress) ? props.progress : 0
  return Math.min(100, Math.max(0, Math.round(value)))
})

const handleCancel = () => {
  emit('cancel')
}
</script>
