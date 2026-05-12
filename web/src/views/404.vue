<template>
  <div class="page-404 bg-white dark:bg-slate-900" :style="{ height: winHeight + 'px' }">
    <div class="inner">
      <h1 class="text-gray-900 dark:text-slate-200">404</h1>
      <h2 class="text-gray-500 dark:text-white">饶了地球一圈，还是没有找到您要的页面</h2>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const winHeight = ref(window.innerHeight)
</script>

<style lang="scss" scoped>
.page-404 {
  display: flex;
  justify-content: center;

  .inner {
    text-align: center;

    h1 {
      font-size: 120px;
      font-weight: bold;
      letter-spacing: 0.1em;
      text-shadow: -1px -1px 1px #111111, 2px 2px 1px #363636;
    }

    h2 {
      font-weight: bold;
    }
  }
}
</style>
