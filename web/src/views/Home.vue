<template>
  <div class="w-full">
    <router-view v-slot="{ Component }">
      <transition name="move" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
</script>

<style scoped>
.move-enter-active,
.move-leave-active {
  @apply transition-all duration-200;
}

.move-enter-from {
  @apply opacity-0 translate-x-5;
}

.move-leave-to {
  @apply opacity-0 -translate-x-5;
}
</style>