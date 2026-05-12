<template>
  <AuthLayout>
    <div class="text-center mb-8">
      <h1 class="text-3xl font-semibold m-0 mb-2 tracking-tight text-slate-900 dark:text-slate-50">
        {{ title }}
      </h1>
      <p class="text-base m-0 leading-relaxed text-slate-500 dark:text-slate-400">
        {{ subtitle }}
      </p>
    </div>

    <login-dialog
      :show="true"
      :active="active"
      :inviteCode="inviteCode"
      @success="handleRegisterSuccess"
      @changeActive="handleChangeActive"
      ref="loginDialogRef"
    />

    <template #footer>
      <div class="mt-4">
        <router-link to="/" class="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
          <i class="iconfont icon-house"></i>
          <span>返回首页</span>
        </router-link>
      </div>
    </template>
  </AuthLayout>
</template>

<script setup>
import AuthLayout from '@/components/layout/AuthLayout.vue'
import LoginDialog from '@/components/LoginDialog.vue'
import { isMobile } from '@/utils/libs'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { setUserToken } from '@/store/session'

const router = useRouter()
const loginDialogRef = ref(null)
const inviteCode = ref(router.currentRoute.value.query.invite_code || '')
const token = ref(router.currentRoute.value.query.token || '')
const isRegister = ref(router.currentRoute.value.path === '/register')
const active = ref(isRegister.value ? 'register' : 'login')
const title = computed(() => (isRegister.value ? '用户注册' : '用户登录'))
const subtitle = computed(() =>
  isRegister.value ? '创建您的账户以开始使用服务' : '登录您的账户以继续使用服务'
)

const handleRegisterSuccess = () => {
  if (isMobile()) {
    router.push('/mobile')
  } else {
    router.push('/chat')
  }
}

const handleChangeActive = (newValue) => {
  isRegister.value = !newValue
}

onMounted(() => {
  if (loginDialogRef.value) {
    loginDialogRef.value.login = !isRegister
  }

  if (token.value) {
    setUserToken(token.value)
    handleRegisterSuccess()
  }
})
</script>