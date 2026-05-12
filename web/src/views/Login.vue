<template>
  <AuthLayout>
    <login-dialog
      :show="true"
      :active="active"
      :inviteCode="inviteCode"
      @success="handleRegisterSuccess"
      @changeActive="handleChangeActive"
      ref="loginDialogRef"
    />

    <template #footer>
      <router-link to="/" class="flex items-center justify-center gap-2 text-slate-500 hover:text-violet-600 dark:text-slate-400 dark:hover:text-violet-400 transition-colors text-sm">
        <i class="iconfont icon-house text-base"></i>
        <span>返回首页</span>
      </router-link>
    </template>
  </AuthLayout>
</template>

<script setup>
import AuthLayout from '@/components/layout/AuthLayout.vue'
import LoginDialog from '@/components/LoginDialog.vue'
import { isMobile } from '@/utils/libs'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { setUserToken } from '@/store/session'

const router = useRouter()
const loginDialogRef = ref(null)
const inviteCode = ref(router.currentRoute.value.query.invite_code || '')
const token = ref(router.currentRoute.value.query.token || '')
const isRegister = ref(router.currentRoute.value.path === '/register')
const active = ref(isRegister.value ? 'register' : 'login')

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
