<template>
  <header class="sticky top-0 z-30 border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
    <div class="flex h-14 items-center justify-between px-4 md:px-6">
      <!-- Left: Mobile Menu Toggle + Page Title -->
      <div class="flex items-center gap-4">
        <button
          @click="toggleMobileSidebar"
          class="btn-ghost btn-icon lg:hidden"
          aria-label="Toggle Menu"
        >
          <i class="iconfont icon-menu text-xl"></i>
        </button>

        <div class="hidden lg:block">
          <h1 class="text-base font-semibold text-slate-900 dark:text-slate-50" style="letter-spacing:-0.02em">
            {{ pageTitle }}
          </h1>
          <p v-if="pageDescription" class="text-xs text-slate-500 dark:text-slate-500">
            {{ pageDescription }}
          </p>
        </div>
      </div>

      <!-- Right: Actions -->
      <div class="flex items-center gap-3">
        <!-- Announcement Bell (placeholder) -->
        <button
          class="btn-ghost btn-icon relative"
          aria-label="Announcements"
        >
          <i class="iconfont icon-tips text-xl"></i>
        </button>

        <!-- Theme Toggle -->
        <button
          @click="toggleTheme"
          class="btn-ghost btn-icon"
          aria-label="Toggle Theme"
        >
          <i :class="isDark ? 'iconfont icon-yueliang text-xl' : 'iconfont icon-taiyang text-xl'"></i>
        </button>

        <!-- User Dropdown -->
        <div v-if="user" class="relative" ref="dropdownRef">
          <button
            @click="toggleDropdown"
            class="flex items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="User Menu"
          >
            <div
              class="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-sm font-medium text-white dark:bg-violet-500 dark:text-white"
            >
              {{ userInitials }}
            </div>
            <div class="hidden text-left md:block">
              <div class="text-sm font-medium text-slate-900 dark:text-slate-50">
                {{ displayName }}
              </div>
              <div class="text-xs capitalize text-slate-500 dark:text-slate-500">
                {{ user.role }}
              </div>
            </div>
            <i class="iconfont icon-more hidden md:block"></i>
          </button>

          <!-- Dropdown Menu -->
          <transition name="dropdown">
            <div v-if="dropdownOpen" class="dropdown right-0 mt-2 w-56">
              <!-- User Info -->
              <div class="border-b border-slate-100 px-4 py-3 dark:border-slate-800">
                <div class="text-sm font-medium text-slate-900 dark:text-slate-50">
                  {{ displayName }}
                </div>
                <div class="text-xs text-slate-500 dark:text-slate-500">{{ user.email }}</div>
              </div>

              <!-- Menu Items -->
              <div class="py-1">
                <router-link to="/profile" @click="closeDropdown" class="dropdown-item">
                  <i class="iconfont icon-user-circle"></i>
                  <span>Profile</span>
                </router-link>

                <router-link to="/keys" @click="closeDropdown" class="dropdown-item">
                  <i class="iconfont icon-key"></i>
                  <span>API Keys</span>
                </router-link>
              </div>

              <!-- Logout -->
              <div class="border-t border-slate-100 py-1 dark:border-slate-800">
                <button
                  @click="handleLogout"
                  class="dropdown-item w-full text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                >
                  <i class="iconfont icon-logout"></i>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore, useAuthStore } from '@/stores'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const authStore = useAuthStore()

const user = computed(() => authStore.user)
const dropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)
const isDark = ref(document.documentElement.classList.contains('dark'))

const userInitials = computed(() => {
  if (!user.value) return ''
  if (user.value.username) {
    return user.value.username.substring(0, 2).toUpperCase()
  }
  if (user.value.email) {
    const localPart = user.value.email.split('@')[0]
    return localPart.substring(0, 2).toUpperCase()
  }
  return ''
})

const displayName = computed(() => {
  if (!user.value) return ''
  return user.value.username || user.value.email?.split('@')[0] || ''
})

const pageTitle = computed(() => {
  return (route.meta.title as string) || ''
})

const pageDescription = computed(() => {
  return (route.meta.description as string) || ''
})

function toggleMobileSidebar() {
  appStore.toggleMobileSidebar()
}

function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value
}

function closeDropdown() {
  dropdownOpen.value = false
}

function toggleTheme() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

async function handleLogout() {
  closeDropdown()
  try {
    await authStore.logout()
  } catch (error) {
    console.error('Logout error:', error)
  }
  await router.push('/login')
}

function handleClickOutside(event: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-4px);
}
</style>