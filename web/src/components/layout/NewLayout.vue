<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950">
    <!-- Sidebar -->
    <NewSidebar
      :main-navs="mainNavs"
      :more-navs="moreNavs"
      :login-user="loginUser"
      :title="title"
      :logo="logo"
      :license="license"
      @show-login="showLoginDialog = true"
      @show-config="showConfigDialog = true"
      @logout="handleLogout"
    />

    <!-- Main Content Area -->
    <div class="lg:pl-64 min-h-screen transition-all duration-300">
      <!-- Header -->
      <header class="sticky top-0 z-30 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div class="h-full px-4 lg:px-6 flex items-center justify-between">
          <!-- Left: Mobile menu toggle + Title -->
          <div class="flex items-center gap-4">
            <button
              @click="toggleMobileSidebar"
              class="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <i class="iconfont icon-menu text-xl text-slate-600 dark:text-slate-400"></i>
            </button>
            <div>
              <h1 class="text-lg font-semibold text-slate-900 dark:text-slate-50">{{ pageTitle }}</h1>
            </div>
          </div>

          <!-- Right: Actions -->
          <div class="flex items-center gap-2">
            <!-- Announcement Bell -->
            <el-popover placement="bottom-end" trigger="click" :width="320">
              <template #reference>
                <button class="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <i class="iconfont icon-tips text-xl text-slate-600 dark:text-slate-400"></i>
                </button>
              </template>
              <div class="p-4">
                <div class="text-center text-slate-500 dark:text-slate-400">
                  暂无新公告
                </div>
              </div>
            </el-popover>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="p-4 lg:p-6">
        <slot />
      </main>
    </div>

    <!-- Login Dialog -->
    <el-dialog v-model="showLoginDialog" width="500px" :show-close="true">
      <template #header>
        <div class="text-center text-xl font-semibold text-slate-900 dark:text-slate-50">
          登录后解锁功能
        </div>
      </template>
      <LoginDialog @success="onLoginSuccess" @hide="showLoginDialog = false" />
    </el-dialog>

    <!-- User Config Dialog -->
    <config-dialog v-if="loginUser.id" v-model:show="showConfigDialog" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import NewSidebar from './NewSidebar.vue'
import LoginDialog from '@/components/LoginDialog.vue'
import ConfigDialog from '@/components/UserInfoDialog.vue'
import ThemeChange from '@/components/ThemeChange.vue'
import { checkSession, getLicenseInfo, getSystemInfo } from '@/store/cache'
import { httpGet } from '@/utils/http'
import { removeUserToken } from '@/store/session'
import { useSharedStore } from '@/store/sharedata'

const router = useRouter()
const store = useSharedStore()

const title = ref('')
const logo = ref('')
const license = ref({ de_copy: true })
const loginUser = ref({})
const mainNavs = ref([])
const moreNavs = ref([])
const showLoginDialog = ref(false)
const showConfigDialog = ref(false)
const pageTitle = ref('')

// Calculate menu display based on window height
const calculateMenus = (menus) => {
  const rows = Math.floor((window.innerHeight - 300) / 60)
  if (menus.length > rows) {
    mainNavs.value = menus.slice(0, rows)
    moreNavs.value = menus.slice(rows)
  } else {
    mainNavs.value = menus
    moreNavs.value = []
  }
}

// Fetch menu list
const fetchMenuList = () => {
  return httpGet('/api/menu/list')
    .then((res) => {
      calculateMenus(res.data)
    })
    .catch((e) => {
      console.error('Failed to fetch menu:', e)
    })
}

// Update page title based on route
const updatePageTitle = () => {
  const route = router.currentRoute.value
  pageTitle.value = route.meta?.title || 'Geek-AI'
}

// Initialize data
const init = () => {
  checkSession()
    .then((user) => {
      loginUser.value = user
    })
    .catch(() => {})

  getSystemInfo()
    .then((res) => {
      title.value = res.data.title
      logo.value = res.data.logo
    })
    .catch((e) => {
      console.error('Failed to get system info:', e)
    })

  getLicenseInfo()
    .then((res) => {
      license.value = res.data
    })
    .catch((e) => {
      license.value = { de_copy: false }
    })

  fetchMenuList()
}

const toggleMobileSidebar = () => {
  // Mobile sidebar toggle logic
}

const onLoginSuccess = () => {
  showLoginDialog.value = false
  loginUser.value = store.user || {}
  fetchMenuList()
}

const handleLogout = () => {
  removeUserToken()
  loginUser.value = {}
  router.push('/login')
}

// Watch route changes
watch(
  () => router.currentRoute.value.path,
  () => {
    updatePageTitle()
  }
)

onMounted(() => {
  init()
  updatePageTitle()
})
</script>
