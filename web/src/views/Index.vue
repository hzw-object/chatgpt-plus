<template>
  <div class="relative min-h-screen flex flex-col overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
    <!-- Background Decorations -->
    <div class="pointer-events-none absolute inset-0 overflow-hidden">
      <div class="absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-violet-400/15 blur-3xl"></div>
      <div class="absolute -bottom-32 -left-32 h-[400px] w-[400px] rounded-full bg-blue-400/10 blur-3xl"></div>
      <div class="absolute left-1/4 top-1/3 h-72 w-72 rounded-full bg-violet-300/8 blur-3xl"></div>
      <div class="absolute bottom-1/3 right-1/4 h-56 w-56 rounded-full bg-pink-300/8 blur-3xl"></div>
      <div class="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.02)_1px,transparent_1px)] bg-[size:72px_72px]"></div>
    </div>

    <!-- Header -->
    <header class="w-full relative z-20 border-b border-slate-200/50 bg-white/70 backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-900/70">
      <nav class="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        <div class="flex items-center gap-3">
          <div class="h-9 w-9 overflow-hidden rounded-xl shadow-sm ring-1 ring-slate-200/50 dark:ring-slate-700/50">
            <img :src="logo" alt="Logo" class="h-full w-full object-contain" />
          </div>
          <span class="text-base font-bold text-slate-900 dark:text-white">{{ title }}</span>
        </div>

        <div class="flex items-center gap-2.5">
          <button
            v-if="!isLogin"
            @click="router.push('/login')"
            class="inline-flex items-center gap-1.5 rounded-full bg-violet-500 px-4 py-1.5 text-sm font-medium text-white shadow-sm shadow-violet-500/20 transition-all hover:bg-violet-600 hover:shadow-md hover:shadow-violet-500/25 active:scale-[0.97]"
          >
            开始使用
            <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </button>
          <button
            v-else
            @click="logout"
            class="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-50 active:scale-[0.97] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            退出登录
          </button>
        </div>
      </nav>
    </header>

    <!-- Hero Section -->
    <div class="relative flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-20">
      <div class="relative z-10 mx-auto max-w-6xl w-full">
        <!-- Title -->
        <div class="text-center mb-14 animate-fade-in">
          <div class="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-200/60 bg-violet-50 px-4 py-1 text-xs font-medium text-violet-600 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-400">
            <span class="relative flex h-1.5 w-1.5">
              <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75"></span>
              <span class="relative inline-flex h-1.5 w-1.5 rounded-full bg-violet-500"></span>
            </span>
            全能 AI 创作平台
          </div>
          <h1 class="text-5xl md:text-7xl font-black tracking-tight text-slate-900 dark:text-white mb-5">
            <span class="bg-gradient-to-r from-violet-600 to-violet-400 bg-clip-text text-transparent">GeekAI</span>
            <span class="text-slate-800 dark:text-slate-200"> 创作助手</span>
          </h1>
          <p class="text-lg text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            集成多种 AI 模型，让创作触手可及
          </p>
        </div>

        <!-- Menu Cards Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 animate-slide-up">
          <div
            v-for="(item, index) in navs"
            :key="item.url"
            @click="router.push(item.url)"
            class="group cursor-pointer rounded-2xl border border-slate-200/60 bg-white/80 p-4 backdrop-blur-sm transition-all duration-200 hover:border-violet-200 hover:bg-white hover:shadow-lg hover:shadow-violet-500/8 hover:-translate-y-1 active:scale-[0.98] dark:border-slate-700/50 dark:bg-slate-800/60 dark:hover:border-violet-500/30 dark:hover:bg-slate-800"
            :style="{ animationDelay: `${index * 60}ms` }"
          >
            <div class="flex flex-col items-center text-center gap-2.5">
              <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-50 to-purple-50 text-xl shadow-sm shadow-violet-500/5 transition-transform duration-200 group-hover:scale-110 dark:from-violet-900/20 dark:to-purple-900/20 dark:shadow-none">
                <i v-if="item.icon.startsWith('icon')" :class="'iconfont text-violet-500 ' + item.icon"></i>
                <img v-else :src="item.icon" class="w-7 h-7 rounded-lg object-cover" alt="icon" />
              </div>
              <span class="text-[13px] font-medium text-slate-600 group-hover:text-violet-600 dark:text-slate-400 dark:group-hover:text-violet-400">{{ item.name }}</span>
            </div>
          </div>
        </div>

        <!-- Quick Entry Hint -->
        <div class="mt-8 text-center animate-fade-in" style="animation-delay: 0.4s">
          <p class="text-xs text-slate-400 dark:text-slate-500">点击卡片即可进入对应功能</p>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <section class="relative border-t border-slate-200/50 bg-gradient-to-b from-slate-50/80 to-white px-6 py-14 dark:border-slate-800/50 dark:from-slate-900/50 dark:to-slate-950">
      <div class="mx-auto max-w-6xl">
        <div class="mb-8 text-center">
          <h2 class="text-2xl font-extrabold text-slate-900 dark:text-white">核心能力</h2>
          <p class="mt-1.5 text-sm text-slate-500 dark:text-slate-400">一个平台，多种 AI 能力</p>
        </div>
        <div class="grid gap-4 md:grid-cols-3">
          <div class="group flex gap-4 rounded-2xl border border-slate-200/60 bg-white p-5 transition-all hover:border-blue-200 hover:shadow-md hover:-translate-y-0.5 dark:border-slate-700/50 dark:bg-slate-800/80 dark:hover:border-blue-500/20">
            <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-lg shadow-sm shadow-blue-500/5 dark:bg-blue-900/30 dark:shadow-none">
              <i class="iconfont icon-chat text-blue-500"></i>
            </div>
            <div>
              <h3 class="mb-1 text-sm font-bold text-slate-900 dark:text-white">AI 对话</h3>
              <p class="text-xs leading-relaxed text-slate-500 dark:text-slate-400">支持 GPT、Claude、Gemini 等多种大语言模型，智能对话即开即用</p>
            </div>
          </div>
          <div class="group flex gap-4 rounded-2xl border border-slate-200/60 bg-white p-5 transition-all hover:border-emerald-200 hover:shadow-md hover:-translate-y-0.5 dark:border-slate-700/50 dark:bg-slate-800/80 dark:hover:border-emerald-500/20">
            <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-lg shadow-sm shadow-emerald-500/5 dark:bg-emerald-900/30 dark:shadow-none">
              <i class="iconfont icon-mj text-emerald-500"></i>
            </div>
            <div>
              <h3 class="mb-1 text-sm font-bold text-slate-900 dark:text-white">AI 绘画</h3>
              <p class="text-xs leading-relaxed text-slate-500 dark:text-slate-400">MidJourney、Stable Diffusion、DALL-E 多引擎创作无限创意</p>
            </div>
          </div>
          <div class="group flex gap-4 rounded-2xl border border-slate-200/60 bg-white p-5 transition-all hover:border-violet-200 hover:shadow-md hover:-translate-y-0.5 dark:border-slate-700/50 dark:bg-slate-800/80 dark:hover:border-violet-500/20">
            <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-lg shadow-sm shadow-violet-500/5 dark:bg-violet-900/30 dark:shadow-none">
              <i class="iconfont icon-video text-violet-500"></i>
            </div>
            <div>
              <h3 class="mb-1 text-sm font-bold text-slate-900 dark:text-white">多媒体创作</h3>
              <p class="text-xs leading-relaxed text-slate-500 dark:text-slate-400">AI 视频、AI 音乐、思维导图，一站式多媒体创作体验</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-slate-200/50 dark:border-slate-800/50">
      <div class="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
        <p class="text-xs text-slate-400 dark:text-slate-500">&copy; {{ new Date().getFullYear() }} {{ title || 'GeekAI' }}. All rights reserved.</p>
        <p class="text-xs text-slate-400 dark:text-slate-500">让每一个人都能用好 AI</p>
      </div>
    </footer>

    <!-- Notice Dialog -->
    <Teleport to="body">
      <transition name="fade">
        <div v-if="showNotice" class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center" @click.self="showNotice = false">
          <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-lg w-full mx-4 shadow-2xl border border-slate-200/50 dark:border-slate-700/50 animate-scale-in">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-base font-bold text-slate-900 dark:text-white">网站公告</h3>
              <button @click="showNotice = false" class="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <i class="iconfont icon-close text-slate-400 text-sm"></i>
              </button>
            </div>
            <div class="max-h-72 overflow-y-auto text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <div v-html="notice"></div>
            </div>
            <div class="mt-5 flex justify-end">
              <button @click="notShow" class="rounded-xl bg-violet-500 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-violet-500/20 hover:bg-violet-600 active:scale-[0.97] transition-all">
                我知道了，不再显示
              </button>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup>
import { checkSession, getLicenseInfo, getSystemInfo } from '@/store/cache'
import { removeUserToken } from '@/store/session'
import { httpGet } from '@/utils/http'
import { isMobile } from '@/utils/libs'
import { showMessageError } from '@/utils/dialog'
import MarkdownIt from 'markdown-it'
import emoji from 'markdown-it-emoji'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const title = ref('')
const logo = ref('/logo.png')
const license = ref({ de_copy: true })
const isLogin = ref(false)
const navs = ref([])

const showNotice = ref(false)
const notice = ref('')
const noticeKey = ref('SYSTEM_NOTICE')

const md = new MarkdownIt({
  breaks: true,
  html: true,
  linkify: true,
  typographer: true,
}).use(emoji)

onMounted(() => {
  if (isMobile()) {
    router.push('/mobile/index')
    return
  }

  getSystemInfo()
    .then((res) => {
      title.value = res.data.title
      logo.value = res.data.logo
    })
    .catch((e) => {
      showMessageError('获取系统配置失败：' + e.message)
    })

  getLicenseInfo()
    .then((res) => {
      license.value = res.data
    })
    .catch((e) => {
      license.value = { de_copy: false }
    })

  httpGet('/api/menu/list?index=1')
    .then((res) => {
      navs.value = res.data
    })
    .catch((e) => {
      showMessageError('获取导航菜单失败：' + e.message)
    })

  checkSession()
    .then(() => {
      isLogin.value = true
    })
    .catch(() => {})

  httpGet('/api/config/get?key=notice')
    .then((res) => {
      try {
        notice.value = md.render(res.data['content'])
        const oldNotice = localStorage.getItem(noticeKey.value)
        if (oldNotice !== notice.value && notice.value.length > 10) {
          showNotice.value = true
        }
      } catch (e) {
        console.warn(e)
      }
    })
    .catch(() => {})
})

const logout = () => {
  removeUserToken()
  router.push('/login')
}

const notShow = () => {
  localStorage.setItem(noticeKey.value, notice.value)
  showNotice.value = false
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
</style>
