<template>
  <router-view v-slot="{ Component, route }">
    <!-- Use AppLayout for main app routes -->
    <AppLayout v-if="isAppRoute(route)">
      <component :is="Component" />
    </AppLayout>
    <!-- Use AuthLayout for auth routes -->
    <AuthLayout v-else-if="isAuthRoute(route)">
      <component :is="Component" />
    </AuthLayout>
    <!-- No layout wrapper for other routes -->
    <component :is="Component" v-else />
  </router-view>
</template>

<script setup>
import '@/styles/main.css'
import { onMounted } from 'vue'
import { checkSession, getSystemInfo } from '@/store/cache'
import { showMessageInfo } from '@/utils/dialog'
import { isChrome, isMobile } from '@/utils/libs'
import AppLayout from '@/components/layout/AppLayout.vue'
import AuthLayout from '@/components/layout/AuthLayout.vue'

// Routes that use AppLayout (main app shell with sidebar)
const appRoutes = [
  '/home', '/chat', '/mj', '/sd', '/member', '/apps', '/images-wall',
  '/invite', '/powerLog', '/xmind', '/dalle', '/suno', '/video', '/jimeng',
  '/balance', '/keys', '/usage', '/profile', '/dashboard'
]

// Routes that use AuthLayout (login, register, reset password)
const authRoutes = ['/login', '/register', '/resetpassword', '/admin/login']

function isAppRoute(r) {
  return appRoutes.some(path => r.path.startsWith(path))
}

function isAuthRoute(r) {
  return authRoutes.some(path => r.path === path)
}

const debounce = (fn, delay) => {
  let timer
  return (...args) => {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}

const _ResizeObserver = window.ResizeObserver
window.ResizeObserver = class ResizeObserver extends _ResizeObserver {
  constructor(callback) {
    callback = debounce(callback, 200)
    super(callback)
  }
}

onMounted(() => {
  // Get system parameters
  getSystemInfo().then((res) => {
    const link = document.createElement('link')
    link.rel = 'shortcut icon'
    link.href = res.data.logo
    document.head.appendChild(link)
  })

  if (!isChrome() && !isMobile()) {
    showMessageInfo('建议使用 Chrome 浏览器以获得最佳体验。')
  }

  checkSession()
    .then(() => {
      // User is logged in
    })
    .catch(() => {})

  // Set theme - use Tailwind dark mode class
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
})

// Print banner
const banner = `
  .oooooo.                        oooo              .o.       ooooo
 d8P'  'Y8b                        888             .888.       888
888            .ooooo.   .ooooo.   888  oooo      .8"888.      888
888           d88'  88b d88'  88b  888 .8P'      .8'  888.     888
888     ooooo 888ooo888 888ooo888  888888.      .88ooo8888.    888
'88.    .88'  888    .o 888    .o  888  88b.   .8'      888.   888
  Y8bood8P'    Y8bod8P'  Y8bod8P' o888o o888o o88o     o8888o o888o
  `
console.log('%c' + banner + '', 'color: purple;font-size: 18px;')

console.log(
  '%c感谢大家为 GeekAI 做出的卓越贡献！',
  "color: green;font-size: 40px;font-family: '微软雅黑';"
)
console.log(
  '%c项目源码：https://github.com/yangjian102621/geekai %c 您的 star 对我们非常重要！',
  "color: green;font-size: 20px;font-family: '微软雅黑';",
  "color: red;font-size: 20px;font-family: '微软雅黑';"
)
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
}

#app {
  margin: 0 !important;
  padding: 0 !important;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial,
    sans-serif;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

h1 {
  font-size: 2em;
}
h2 {
  font-size: 1.5em;
}
h3 {
  font-size: 1.17em;
}
h4 {
  font-size: 1em;
}
h5 {
  font-size: 0.83em;
}
h6 {
  font-size: 0.67em;
}

/* Scrollbar hide utility */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>