<template>
  <aside
    class="fixed top-0 left-0 z-40 h-screen w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 flex flex-col"
    :class="{ '-translate-x-full lg:translate-x-0': !isMobileOpen }"
  >
    <!-- Logo -->
    <div class="h-16 flex items-center px-4 border-b border-slate-200 dark:border-slate-800">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <img :src="logo || '/logo.png'" alt="Logo" class="w-full h-full object-contain" />
        </div>
        <div class="flex flex-col">
          <span class="text-base font-semibold text-slate-900 dark:text-slate-50">{{ title || 'Geek-AI' }}</span>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto py-4 px-3 scrollbar-hide">
      <!-- Main Menu Items -->
      <div class="space-y-1">
        <template v-for="item in mainNavs" :key="item.url">
          <div
            v-if="item.url.startsWith('http')"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
            @click="openExternal(item)"
          >
            <i :class="'iconfont ' + item.icon" v-if="item.icon.startsWith('icon')"></i>
            <el-image :src="item.icon" class="w-5 h-5" v-else />
            <span class="text-sm font-medium">{{ item.name }}</span>
          </div>
          <router-link
            v-else
            :to="item.url"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            :class="{ 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400': isActive(item.url) }"
          >
            <i :class="'iconfont ' + item.icon" v-if="item.icon.startsWith('icon')"></i>
            <el-image :src="item.icon" class="w-5 h-5" v-else />
            <span class="text-sm font-medium">{{ item.name }}</span>
          </router-link>
        </template>
      </div>

      <!-- More Menu -->
      <div v-if="moreNavs.length > 0" class="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div class="px-3 py-2 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          更多
        </div>
        <div class="space-y-1">
          <template v-for="item in moreNavs" :key="item.url">
            <div
              v-if="item.url.startsWith('http')"
              class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
              @click="openExternal(item)"
            >
              <i :class="'iconfont ' + item.icon" v-if="item.icon.startsWith('icon')"></i>
              <el-image :src="item.icon" class="w-5 h-5" v-else />
              <span class="text-sm font-medium">{{ item.name }}</span>
            </div>
            <router-link
              v-else
              :to="item.url"
              class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              :class="{ 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400': isActive(item.url) }"
            >
              <i :class="'iconfont ' + item.icon" v-if="item.icon.startsWith('icon')"></i>
              <el-image :src="item.icon" class="w-5 h-5" v-else />
              <span class="text-sm font-medium">{{ item.name }}</span>
            </router-link>
          </template>
        </div>
      </div>
    </nav>

    <!-- Bottom Actions -->
    <div class="p-3 border-t border-slate-200 dark:border-slate-800">
      <!-- User Section -->
      <div v-if="loginUser.id" class="mb-3">
        <el-popover placement="top-start" trigger="click" :width="200">
          <template #reference>
            <div class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors">
              <div class="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                <i class="iconfont icon-user-circle text-violet-600 dark:text-violet-400"></i>
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-sm font-medium text-slate-900 dark:text-slate-50 truncate">用户</div>
              </div>
              <i class="iconfont icon-more text-slate-400"></i>
            </div>
          </template>
          <div class="py-2">
            <div
              class="flex items-center gap-3 px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer rounded-lg"
              @click="$emit('showConfig')"
            >
              <i class="iconfont icon-user text-slate-600 dark:text-slate-400"></i>
              <span class="text-sm text-slate-700 dark:text-slate-300">账户信息</span>
            </div>
            <a
              :href="githubURL"
              target="_blank"
              class="flex items-center gap-3 px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer rounded-lg"
              v-if="!license.de_copy"
            >
              <i class="iconfont icon-github text-slate-600 dark:text-slate-400"></i>
              <span class="text-sm text-slate-700 dark:text-slate-300">项目源码</span>
            </a>
            <div
              class="flex items-center gap-3 px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer rounded-lg"
              @click="handleLogout"
            >
              <i class="iconfont icon-logout text-slate-600 dark:text-slate-400"></i>
              <span class="text-sm text-slate-700 dark:text-slate-300">退出登录</span>
            </div>
          </div>
        </el-popover>
      </div>
      <div v-else class="mb-3">
        <el-button @click="$emit('showLogin')" type="primary" class="w-full" size="default">
          登录
        </el-button>
      </div>

      <!-- Bottom Row -->
      <div class="flex items-center justify-between">
        <router-link
          to="/"
          class="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="首页"
        >
          <i class="iconfont icon-house text-slate-600 dark:text-slate-400"></i>
        </router-link>
        <ThemeChange size="small" />
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import ThemeChange from '@/components/ThemeChange.vue'

const props = defineProps({
  mainNavs: {
    type: Array,
    default: () => []
  },
  moreNavs: {
    type: Array,
    default: () => []
  },
  loginUser: {
    type: Object,
    default: () => ({})
  },
  title: String,
  logo: String,
  license: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['showLogin', 'showConfig', 'logout'])

const curPath = ref('/chat')
const isMobileOpen = ref(true)
const githubURL = import.meta.env.VITE_GITHUB_URL

const isActive = (url) => {
  return curPath.value.startsWith(url)
}

const openExternal = (item) => {
  window.open(item.url, '_blank')
}

const handleLogout = () => {
  emit('logout')
}

// Listen for route changes
const updateCurPath = () => {
  curPath.value = window.location.pathname
}

onMounted(() => {
  updateCurPath()
  window.addEventListener('popstate', updateCurPath)
})

onUnmounted(() => {
  window.removeEventListener('popstate', updateCurPath)
})
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
