<template>
  <div class="flex items-center gap-1.5 rounded-xl bg-slate-100 px-2 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-400">
    <span class="font-medium">网络状态</span>
    <span class="relative flex h-2 w-2">
      <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60"></span>
      <span class="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
    </span>
  </div>
</template>

<script setup lang="ts">
defineProps<{ version?: string }>()
</script>
