<template>
  <div class="page-iframe relative w-full h-screen overflow-hidden">
    <!-- Loading overlay -->
    <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-slate-800/80 z-10">
      <div class="text-center">
        <div class="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-white">页面正在加载中...</p>
      </div>
    </div>
    <iframe :src="externalUrl" class="iframe w-full h-full border-none" @load="onIframeLoad"></iframe>
  </div>
</template>
<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const loading = ref(true)
const router = useRouter()
const externalUrl = computed(() => {
  loading.value = true
  return router.currentRoute.value.query.url || 'about:blank'
})

// 设置标题
document.title = router.currentRoute.value.query.title

const onIframeLoad = () => {
  loading.value = false
}
</script>

<style scoped>
.page-iframe {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
</style>
