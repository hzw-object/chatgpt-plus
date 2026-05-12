<template>
  <div class="test-3d dark:bg-slate-900 min-h-screen">
    <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">3D预览功能测试</h1>

    <div class="test-container">
      <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">测试1: 默认立方体（无模型URL）</h2>
      <div class="preview-wrapper border-2 border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <ThreeDPreview />
      </div>
    </div>

    <div class="test-container">
      <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">测试2: 带模型URL（如果有的话）</h2>
      <div class="preview-wrapper border-2 border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <ThreeDPreview v-if="testModelUrl" :model-url="testModelUrl" :model-type="testModelType" />
        <div v-else class="no-model bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
          <p>没有测试模型URL</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import ThreeDPreview from '@/components/ThreeDPreview.vue'
import { ref } from 'vue'

// 测试用的模型URL（可以替换为实际的模型文件）
const testModelUrl = ref('https://img.r9it.com/R03TQZ7PZ386RGL7PTMNGFOHAJW15WYF.glb')
const testModelType = ref('glb')
</script>

<style lang="scss" scoped>
.test-3d {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.test-container {
  margin-bottom: 40px;
}

.preview-wrapper {
  width: 100%;
  height: 500px;
}
</style>