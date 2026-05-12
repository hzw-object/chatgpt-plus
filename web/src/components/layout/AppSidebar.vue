<template>
  <aside
    class="sidebar"
    :class="[
      sidebarCollapsed ? 'w-[72px]' : 'w-64',
      { '-translate-x-full lg:translate-x-0': !mobileOpen }
    ]"
  >
    <!-- Logo/Brand -->
    <div class="sidebar-header">
      <div class="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
        <img :src="siteLogo || '/logo.png'" alt="Logo" class="h-full w-full object-contain" />
      </div>
      <transition name="fade">
        <div v-if="!sidebarCollapsed" class="flex flex-col">
          <span class="text-base font-semibold text-slate-900 dark:text-slate-50">
            {{ siteName }}
          </span>
        </div>
      </transition>
    </div>

    <!-- Navigation -->
    <nav class="sidebar-nav flex-1 overflow-y-auto py-4 px-3 scrollbar-hide">
      <div class="space-y-1">
        <template v-for="item in menuItems" :key="item.url">
          <!-- External Link -->
          <div
            v-if="item.url.startsWith('http')"
            class="sidebar-link mb-1"
            @click="openExternal(item.url)"
          >
            <i :class="'iconfont ' + item.icon" v-if="item.icon.startsWith('icon')"></i>
            <img :src="item.icon" class="w-5 h-5" v-else />
            <span v-if="!sidebarCollapsed">{{ item.name }}</span>
          </div>
          <!-- Internal Route -->
          <router-link
            v-else
            :to="item.url"
            class="sidebar-link mb-1"
            :class="{ 'sidebar-link-active': isActive(item.url) }"
          >
            <i :class="'iconfont ' + item.icon" v-if="item.icon.startsWith('icon')"></i>
            <img :src="item.icon" class="w-5 h-5" v-else />
            <span v-if="!sidebarCollapsed">{{ item.name }}</span>
          </router-link>
        </template>
      </div>
    </nav>

    <!-- Bottom Section -->
    <div class="mt-auto border-t border-slate-100 p-3 dark:border-slate-800">
      <!-- Theme Toggle -->
      <button @click="toggleTheme" class="sidebar-link mb-2 w-full">
        <i :class="isDark ? 'iconfont icon-yueliang' : 'iconfont icon-taiyang'"></i>
        <span v-if="!sidebarCollapsed">{{ isDark ? 'Light Mode' : 'Dark Mode' }}</span>
      </button>

      <!-- Collapse Button -->
      <button @click="toggleSidebar" class="sidebar-link w-full">
        <i :class="sidebarCollapsed ? 'iconfont icon-menu' : 'iconfont icon-yemian'"></i>
        <span v-if="!sidebarCollapsed">Collapse</span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores'

interface MenuItem {
  url: string
  name: string
  icon: string
}

defineProps<{
  menuItems: MenuItem[]
}>()

const route = useRoute()
const appStore = useAppStore()

const sidebarCollapsed = computed(() => appStore.sidebarCollapsed)
const mobileOpen = computed(() => appStore.mobileOpen)
const isDark = ref(document.documentElement.classList.contains('dark'))

const siteName = computed(() => appStore.siteName || 'GeekAI')
const siteLogo = computed(() => appStore.siteLogo || '/logo.png')

function toggleSidebar() {
  appStore.toggleSidebar()
}

function toggleTheme() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

function isActive(url: string): boolean {
  return route.path.startsWith(url)
}

function openExternal(url: string) {
  window.open(url, '_blank')
}
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

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>