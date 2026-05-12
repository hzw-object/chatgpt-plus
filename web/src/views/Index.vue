<template>
  <div class="relative min-h-screen flex flex-col overflow-hidden bg-gradient-to-br from-slate-50 via-slate-50/30 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
    <!-- Background Decorations -->
    <div class="pointer-events-none absolute inset-0 overflow-hidden">
      <div class="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-violet-400/20 blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-slate-500/15 blur-3xl"></div>
      <div class="absolute left-1/3 top-1/4 h-72 w-72 rounded-full bg-slate-300/10 blur-3xl"></div>
      <div class="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-violet-400/10 blur-3xl"></div>
      <div class="absolute inset-0 bg-[linear-gradient(rgba(20,184,166,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(20,184,166,0.03)_1px,transparent_1px)] bg-[size:64px_64px]"></div>
    </div>

    <!-- Header -->
    <header class="relative z-20 bg-white/60 backdrop-blur-lg dark:bg-slate-900/60 py-4">
      <nav class="mx-auto flex max-w-6xl items-center justify-between px-6">
        <div class="flex items-center gap-3">
          <div class="h-10 w-10 overflow-hidden rounded-xl shadow-md">
            <img :src="logo" alt="Logo" class="h-full w-full object-contain" />
          </div>
          <span class="text-lg font-bold text-slate-900 dark:text-white">{{ title }}</span>
        </div>

        <div class="flex items-center gap-3">
          <button
            v-if="!isLogin"
            @click="router.push('/login')"
            class="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700"
          >
            登录 / 注册
          </button>
          <button
            v-else
            @click="logout"
            class="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700"
          >
            退出登录
          </button>
        </div>
      </nav>
    </header>

    <!-- Hero Section -->
    <div class="relative flex-1 flex flex-col items-center justify-center px-6 py-16">
      <div class="relative z-10 mx-auto max-w-6xl w-full">
        <!-- Title Section -->
        <div class="text-center mb-12">
          <h1 class="text-5xl md:text-6xl font-black text-slate-900 dark:text-white mb-4">
            <span class="text-violet-500">GeekAI</span> 创作助手
          </h1>
          <p class="text-lg text-slate-500 dark:text-slate-400">
            让每一个人都能用好 AI
          </p>
        </div>

        <!-- Menu Cards Grid -->
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div
            v-for="(item, index) in navs"
            :key="item.url"
            @click="router.push(item.url)"
            class="group cursor-pointer rounded-2xl border border-slate-200/50 bg-white/80 p-5 backdrop-blur-sm transition-all duration-300 hover:border-violet-300 hover:shadow-xl hover:shadow-violet-500/10 hover:-translate-y-1 dark:border-slate-700/50 dark:bg-slate-800/80 dark:hover:border-violet-500/50"
            :style="{ animationDelay: `${index * 50}ms` }"
          >
            <div class="flex flex-col items-center text-center gap-3">
              <div class="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 text-2xl dark:from-violet-900/30 dark:to-purple-900/30">
                <i v-if="item.icon.startsWith('icon')" :class="'iconfont text-violet-500 ' + item.icon"></i>
                <img v-else :src="item.icon" class="w-8 h-8 rounded-lg object-cover" alt="icon" />
              </div>
              <span class="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-violet-600 dark:group-hover:text-violet-400">{{ item.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <section class="bg-gradient-to-b from-violet-50/50 to-slate-50 px-6 py-12 dark:from-slate-900/50 dark:to-slate-950">
      <div class="mx-auto max-w-6xl">
        <div class="grid gap-5 md:grid-cols-3">
          <div class="flex gap-4 rounded-2xl border border-slate-200/50 bg-white/80 p-6 backdrop-blur-sm transition-all hover:shadow-lg hover:-translate-y-0.5 dark:border-slate-700/50 dark:bg-slate-800/80 dark:hover:bg-white/10">
            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-2xl dark:bg-blue-900/30">📦</div>
            <div>
              <h3 class="mb-1.5 text-[15px] font-bold text-slate-900 dark:text-white">AI 对话</h3>
              <p class="text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">支持 GPT、Claude、Gemini 等多种大语言模型</p>
            </div>
          </div>
          <div class="flex gap-4 rounded-2xl border border-slate-200/50 bg-white/80 p-6 backdrop-blur-sm transition-all hover:shadow-lg hover:-translate-y-0.5 dark:border-slate-700/50 dark:bg-slate-800/80">
            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-50 text-2xl dark:bg-green-900/30">🎨</div>
            <div>
              <h3 class="mb-1.5 text-[15px] font-bold text-slate-900 dark:text-white">AI 绘画</h3>
              <p class="text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">MidJourney、Stable Diffusion 创作无限创意</p>
            </div>
          </div>
          <div class="flex gap-4 rounded-2xl border border-slate-200/50 bg-white/80 p-6 backdrop-blur-sm transition-all hover:shadow-lg hover:-translate-y-0.5 dark:border-slate-700/50 dark:bg-slate-800/80">
            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-2xl dark:bg-violet-900/30">💳</div>
            <div>
              <h3 class="mb-1.5 text-[15px] font-bold text-slate-900 dark:text-white">灵活充值</h3>
              <p class="text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">支持多种会员套餐和点卡充值</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-slate-200/50 px-6 py-6 dark:border-slate-800/50">
      <div class="mx-auto max-w-6xl flex items-center justify-between">
        <p class="text-sm text-slate-500 dark:text-slate-400">© 2024 GeekAI. All rights reserved.</p>
        <p class="text-sm text-slate-500 dark:text-slate-400">让每一个人都能用好 AI</p>
      </div>
    </footer>

    <!-- Notice Dialog -->
    <Teleport to="body">
      <transition name="fade">
        <div v-if="showNotice" class="fixed inset-0 bg-black/50 z-40 flex items-center justify-center" @click.self="showNotice = false">
          <div class="bg-white/90 backdrop-blur-xl rounded-2xl p-6 max-w-lg w-full mx-4 shadow-2xl border border-slate-200/50 dark:bg-slate-800/90 dark:border-slate-700/50">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-bold text-slate-900 dark:text-white">网站公告</h3>
              <button @click="showNotice = false" class="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <i class="iconfont icon-close text-slate-500"></i>
              </button>
            </div>
            <div class="max-h-80 overflow-y-auto text-slate-600 dark:text-slate-300">
              <div v-html="notice"></div>
            </div>
            <div class="mt-4 flex justify-end">
              <button @click="notShow" class="px-4 py-2 rounded-xl bg-violet-500 text-white font-medium hover:bg-violet-600 transition-colors">
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
const logo = ref('')
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