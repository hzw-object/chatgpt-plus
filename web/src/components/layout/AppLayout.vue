<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950">
    <!-- Sidebar -->
    <AppSidebar :menu-items="menuItems" />

    <!-- Mobile Overlay -->
    <transition name="fade">
      <div
        v-if="mobileOpen"
        class="fixed inset-0 z-30 bg-black/50 lg:hidden"
        @click="closeMobile"
      ></div>
    </transition>

    <!-- Main Content Area -->
    <div
      class="relative min-h-screen transition-all duration-300"
      :class="[sidebarCollapsed ? 'lg:ml-[72px]' : 'lg:ml-64']"
    >
      <!-- Header -->
      <AppHeader />

      <!-- Main Content -->
      <main class="p-3 md:p-5 lg:p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useAppStore } from '@/stores'
import AppHeader from './AppHeader.vue'
import AppSidebar from './AppSidebar.vue'

interface MenuItem {
  url: string
  name: string
  icon: string
}

const appStore = useAppStore()
const menuItems = ref<MenuItem[]>([])
const loading = ref(true)

const sidebarCollapsed = computed(() => appStore.sidebarCollapsed)
const mobileOpen = computed(() => appStore.mobileOpen)

function closeMobile() {
  appStore.setMobileOpen(false)
}

// Fetch menu items from API
async function fetchMenuItems() {
  try {
    const res = await fetch('/api/menu/list')
    const data = await res.json()
    if (data.data) {
      menuItems.value = data.data
    }
  } catch (e) {
    console.error('Failed to fetch menu items:', e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchMenuItems()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>