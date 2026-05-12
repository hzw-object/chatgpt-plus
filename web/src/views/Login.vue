<template>
  <AuthLayout>
    <div class="space-y-6">
      <!-- Title -->
      <div class="text-center">
        <h2 class="text-2xl font-bold text-slate-900 dark:text-white">
          {{ isRegister ? '创建账号' : '欢迎回来' }}
        </h2>
        <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {{ isRegister ? '注册您的账户以开始使用' : '登录您的账户以继续使用' }}
        </p>
      </div>

      <!-- Login Form -->
      <form v-if="login" @submit.prevent="submitLogin" class="space-y-5">
        <!-- Username Input -->
        <div>
          <label class="input-label">账号</label>
          <div class="relative">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <i class="iconfont icon-user text-slate-400 dark:text-slate-500"></i>
            </div>
            <input
              v-model="data.username"
              required
              autofocus
              autocomplete="username"
              :disabled="loading"
              class="input pl-11"
              :class="{ 'input-error': errors.username }"
              placeholder="请输入用户名"
            />
          </div>
          <p v-if="errors.username" class="input-error-text">{{ errors.username }}</p>
        </div>

        <!-- Password Input -->
        <div>
          <label class="input-label">密码</label>
          <div class="relative">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <i class="iconfont icon-lock text-slate-400 dark:text-slate-500"></i>
            </div>
            <input
              v-model="data.password"
              :type="showPassword ? 'text' : 'password'"
              required
              autocomplete="current-password"
              :disabled="loading"
              class="input pl-11 pr-11"
              :class="{ 'input-error': errors.password }"
              placeholder="请输入密码(8-16位)"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-300"
            >
              <i :class="showPassword ? 'iconfont icon-eye' : 'iconfont icon-eye-off'"></i>
            </button>
          </div>
          <div class="mt-1 flex items-center justify-between">
            <p v-if="errors.password" class="input-error-text">{{ errors.password }}</p>
            <span v-else></span>
            <button
              type="button"
              @click="showResetPass = true"
              class="text-sm font-medium text-violet-600 transition-colors hover:text-slate-500 dark:text-violet-400 dark:hover:text-slate-300"
            >
              忘记密码？
            </button>
          </div>
        </div>

        <!-- Error Message -->
        <transition name="fade">
          <div
            v-if="errorMessage"
            class="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800/50 dark:bg-red-900/20"
          >
            <div class="flex items-start gap-3">
              <div class="flex-shrink-0">
                <i class="iconfont icon-warning-circle text-red-500 text-lg"></i>
              </div>
              <p class="text-sm text-red-700 dark:text-red-400">{{ errorMessage }}</p>
            </div>
          </div>
        </transition>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="loading"
          class="btn btn-primary w-full"
        >
          <svg v-if="loading" class="-ml-1 mr-2 h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <i v-else class="iconfont icon-login mr-2"></i>
          {{ loading ? '登录中...' : '登 录' }}
        </button>
      </form>

      <!-- Register Form -->
      <form v-else @submit.prevent="submitRegister" class="space-y-5">
        <!-- Register Tab Switcher -->
        <div v-if="enableRegister" class="tabs mb-1">
          <button
            v-if="enableMobile"
            @click="activeName = 'mobile'"
            :class="activeName === 'mobile' ? 'tab-active' : 'tab'"
            class="flex-1"
          >手机注册</button>
          <button
            v-if="enableEmail"
            @click="activeName = 'email'"
            :class="activeName === 'email' ? 'tab-active' : 'tab'"
            class="flex-1"
          >邮箱注册</button>
          <button
            v-if="enableUser"
            @click="activeName = 'username'"
            :class="activeName === 'username' ? 'tab-active' : 'tab'"
            class="flex-1"
          >用户名注册</button>
        </div>

        <!-- Mobile / Email Register -->
        <div v-if="activeName === 'mobile' || activeName === 'email'">
          <div>
            <label class="input-label">{{ activeName === 'mobile' ? '手机号码' : '邮箱地址' }}</label>
            <div class="relative">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                <i :class="activeName === 'mobile' ? 'iconfont icon-phone' : 'iconfont icon-email'" class="text-slate-400 dark:text-slate-500"></i>
              </div>
              <input
                class="input pl-11"
                :placeholder="activeName === 'mobile' ? '请输入手机号' : '请输入邮箱地址'"
                :value="activeName === 'mobile' ? data.mobile : data.email"
                @input="(e) => activeName === 'mobile' ? data.mobile = e.target.value : data.email = e.target.value"
                autocomplete="off"
              />
            </div>
          </div>
          <div class="mt-4">
            <label class="input-label">验证码</label>
            <div class="flex gap-2">
              <input
                class="input flex-1"
                placeholder="请输入验证码"
                maxlength="30"
                v-model="data.code"
                autocomplete="off"
              />
              <send-msg :receiver="activeName === 'mobile' ? data.mobile : data.email" :type="activeName" />
            </div>
          </div>
        </div>

        <!-- Username Register -->
        <div v-if="activeName === 'username'">
          <label class="input-label">用户名</label>
          <div class="relative">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <i class="iconfont icon-user text-slate-400 dark:text-slate-500"></i>
            </div>
            <input
              class="input pl-11"
              placeholder="请输入用户名"
              v-model="data.username"
              autocomplete="off"
            />
          </div>
        </div>

        <div>
          <label class="input-label">密码</label>
          <div class="relative">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <i class="iconfont icon-lock text-slate-400 dark:text-slate-500"></i>
            </div>
            <input
              class="input pl-11 pr-11"
              placeholder="请输入密码(8-16位)"
              maxlength="16"
              v-model="data.password"
              type="password"
              autocomplete="off"
            />
            <button
              type="button"
              @click="showRegPassword = !showRegPassword"
              class="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-300"
            >
              <i :class="showRegPassword ? 'iconfont icon-eye' : 'iconfont icon-eye-off'"></i>
            </button>
          </div>
        </div>

        <div>
          <label class="input-label">确认密码</label>
          <div class="relative">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <i class="iconfont icon-lock text-slate-400 dark:text-slate-500"></i>
            </div>
            <input
              class="input pl-11"
              placeholder="请再次输入密码(8-16位)"
              maxlength="16"
              v-model="data.repass"
              type="password"
              autocomplete="off"
            />
          </div>
        </div>

        <div>
          <label class="input-label">邀请码 <span class="font-normal text-slate-400">(可选)</span></label>
          <div class="relative">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <i class="iconfont icon-gift text-slate-400 dark:text-slate-500"></i>
            </div>
            <input
              class="input pl-11"
              placeholder="如有邀请码请填写"
              v-model="data.invite_code"
              autocomplete="off"
            />
          </div>
        </div>

        <div class="flex items-start gap-2 text-sm">
          <input type="checkbox" v-model="agreeChecked" class="mt-1 h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500" />
          <span class="text-slate-600 dark:text-slate-400">
            我已阅读并同意
            <a href="javascript:void(0)" class="font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400" @click="openAgreement">《用户协议》</a>
            和
            <a href="javascript:void(0)" class="font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400" @click="openPrivacy">《隐私政策》</a>
          </span>
        </div>

        <!-- Error Message -->
        <transition name="fade">
          <div
            v-if="errorMessage"
            class="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800/50 dark:bg-red-900/20"
          >
            <div class="flex items-start gap-3">
              <div class="flex-shrink-0">
                <i class="iconfont icon-warning-circle text-red-500 text-lg"></i>
              </div>
              <p class="text-sm text-red-700 dark:text-red-400">{{ errorMessage }}</p>
            </div>
          </div>
        </transition>

        <button
          type="submit"
          :disabled="loading"
          class="btn btn-primary w-full"
        >
          <svg v-if="loading" class="-ml-1 mr-2 h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <i v-else class="iconfont icon-user-plus mr-2"></i>
          {{ loading ? '注册中...' : '注 册' }}
        </button>
      </form>

      <!-- Register Closed -->
      <div v-if="!login && !enableRegister" class="text-center py-8">
        <i class="iconfont icon-close-circle text-5xl text-red-500 mb-4 block"></i>
        <p class="text-lg font-medium mb-2">注册功能已关闭</p>
        <p class="text-sm text-slate-500 dark:text-slate-400">抱歉，系统已关闭注册功能，请联系管理员添加账号！</p>
      </div>
    </div>

    <!-- Footer -->
    <template #footer>
      <p v-if="login" class="text-slate-500 dark:text-slate-400">
        还没有账号？
        <button
          @click="login = false"
          class="font-medium text-violet-600 transition-colors hover:text-slate-500 dark:text-violet-400 dark:hover:text-slate-300"
          type="button"
        >注册</button>
      </p>
      <p v-else class="text-slate-500 dark:text-slate-400">
        已有账号？
        <button
          @click="login = true"
          class="font-medium text-violet-600 transition-colors hover:text-slate-500 dark:text-violet-400 dark:hover:text-slate-300"
          type="button"
        >登录</button>
      </p>
    </template>
  </AuthLayout>

  <reset-pass @hide="showResetPass = false" :show="showResetPass" />

  <!-- Agreement Dialog -->
  <Teleport to="body">
    <transition name="fade">
      <div v-if="showAgreement" class="modal-overlay" @click.self="showAgreement = false">
        <div class="modal-content max-w-2xl">
          <div class="modal-header">
            <h3 class="modal-title">用户协议</h3>
            <button @click="showAgreement = false" class="btn-ghost btn-icon">
              <i class="iconfont icon-close"></i>
            </button>
          </div>
          <div class="modal-body prose" v-html="agreementHtml"></div>
        </div>
      </div>
    </transition>
  </Teleport>

  <!-- Privacy Dialog -->
  <Teleport to="body">
    <transition name="fade">
      <div v-if="showPrivacy" class="modal-overlay" @click.self="showPrivacy = false">
        <div class="modal-content max-w-2xl">
          <div class="modal-header">
            <h3 class="modal-title">隐私政策</h3>
            <button @click="showPrivacy = false" class="btn-ghost btn-icon">
              <i class="iconfont icon-close"></i>
            </button>
          </div>
          <div class="modal-body prose" v-html="privacyHtml"></div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import AuthLayout from '@/components/layout/AuthLayout.vue'
import ResetPass from '@/components/ResetPass.vue'
import SendMsg from '@/components/SendMsg.vue'
import { getSystemInfo } from '@/store/cache'
import { setUserToken } from '@/store/session'
import { useSharedStore } from '@/store/sharedata'
import { showMessageError, showMessageSuccess } from '@/utils/dialog'
import { httpGet, httpPost } from '@/utils/http'
import { arrayContains } from '@/utils/libs'
import { isMobile } from '@/utils/libs'
import { validateEmail, validateMobile } from '@/utils/validate'
import { marked } from 'marked'
import { onMounted, ref, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const store = useSharedStore()

const inviteCode = ref(router.currentRoute.value.query.invite_code || '')
const token = ref(router.currentRoute.value.query.token || '')
const isRegister = ref(router.currentRoute.value.path === '/register')
const login = ref(!isRegister.value)
const loading = ref(false)
const showPassword = ref(false)
const showRegPassword = ref(false)
const errorMessage = ref('')

const data = ref({
  username: import.meta.env.VITE_USER,
  password: import.meta.env.VITE_PASS,
  mobile: '',
  email: '',
  repass: '',
  code: '',
  invite_code: inviteCode.value,
})

const errors = reactive({
  username: '',
  password: '',
})

const enableMobile = ref(false)
const enableEmail = ref(false)
const enableUser = ref(false)
const enableRegister = ref(true)
const activeName = ref('')

const showResetPass = ref(false)
const agreeChecked = ref(false)
const showAgreement = ref(false)
const showPrivacy = ref(false)
const agreementHtml = ref('')
const privacyHtml = ref('')

// Sync login state with isRegister
watch(login, (val) => {
  isRegister.value = !val
})

onMounted(() => {
  getSystemInfo()
    .then((res) => {
      if (res.data) {
        const registerWays = res.data['register_ways']
        if (arrayContains(registerWays, 'username')) {
          enableUser.value = true
          activeName.value = 'username'
        }
        if (arrayContains(registerWays, 'email')) {
          enableEmail.value = true
          activeName.value = 'email'
        }
        if (arrayContains(registerWays, 'mobile')) {
          enableMobile.value = true
          activeName.value = 'mobile'
        }
        enableRegister.value = res.data['enabled_register']
      }
    })
    .catch((e) => {
      showMessageError('获取系统配置失败：' + e.message)
    })

  if (token.value) {
    setUserToken(token.value)
    handleSuccess()
  }
})

function handleSuccess() {
  if (isMobile()) {
    router.push('/mobile')
  } else {
    router.push('/chat')
  }
}

// Login
function submitLogin() {
  errors.username = ''
  errors.password = ''
  errorMessage.value = ''

  if (!data.value.username) {
    errors.username = '请输入用户名'
    return
  }
  if (!data.value.password) {
    errors.password = '请输入密码'
    return
  }
  if (data.value.password.length < 8) {
    errors.password = '密码长度为8-16个字符'
    return
  }

  loading.value = true
  httpPost('/api/user/login', data.value)
    .then((res) => {
      setUserToken(res.data.token)
      store.setIsLogin(true)
      showMessageSuccess('登录成功！')
      handleSuccess()
    })
    .catch((e) => {
      errorMessage.value = '登录失败，' + e.message
    })
    .finally(() => {
      loading.value = false
    })
}

// Register
function submitRegister() {
  errorMessage.value = ''

  if (activeName.value === 'username' && !data.value.username) {
    errorMessage.value = '请输入用户名'
    return
  }
  if (activeName.value === 'mobile' && !validateMobile(data.value.mobile)) {
    errorMessage.value = '请输入合法的手机号'
    return
  }
  if (activeName.value === 'email' && !validateEmail(data.value.email)) {
    errorMessage.value = '请输入合法的邮箱地址'
    return
  }
  if (data.value.password.length < 8) {
    errorMessage.value = '密码的长度为8-16个字符'
    return
  }
  if (data.value.repass !== data.value.password) {
    errorMessage.value = '两次输入密码不一致'
    return
  }
  if ((activeName.value === 'mobile' || activeName.value === 'email') && !data.value.code) {
    errorMessage.value = '请输入验证码'
    return
  }
  if (!agreeChecked.value) {
    errorMessage.value = '请先阅读并同意《用户协议》和《隐私政策》'
    return
  }

  data.value.reg_way = activeName.value
  loading.value = true
  httpPost('/api/user/register', data.value)
    .then((res) => {
      setUserToken(res.data.token)
      showMessageSuccess({
        message: '注册成功!',
        onClose: () => {
          handleSuccess()
        },
        duration: 1000,
      })
    })
    .catch((e) => {
      errorMessage.value = '注册失败，' + e.message
    })
    .finally(() => {
      loading.value = false
    })
}

// Agreement & Privacy
function openAgreement() {
  if (!agreementHtml.value) {
    httpGet('/api/config/get?key=agreement')
      .then((res) => {
        agreementHtml.value = marked.parse(res.data?.content || '')
        showAgreement.value = true
      })
      .catch((e) => showMessageError('加载用户协议失败：' + e.message))
  } else {
    showAgreement.value = true
  }
}

function openPrivacy() {
  if (!privacyHtml.value) {
    httpGet('/api/config/get?key=privacy')
      .then((res) => {
        privacyHtml.value = marked.parse(res.data?.content || '')
        showPrivacy.value = true
      })
      .catch((e) => showMessageError('加载隐私政策失败：' + e.message))
  } else {
    showPrivacy.value = true
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

input[type="checkbox"] {
  accent-color: #8b5cf6;
}
</style>
