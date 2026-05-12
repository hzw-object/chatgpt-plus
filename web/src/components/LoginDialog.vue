<template>
  <div class="login-dialog w-full">
    <div class="login-box" v-if="login">
      <!-- Login Tabs -->
      <div class="tabs mb-6">
        <button
          @click="loginActiveName = 'account'"
          :class="loginActiveName === 'account' ? 'tab-active' : 'tab'"
          class="flex-1 flex items-center justify-center gap-2"
        >
          <i class="iconfont icon-user-fill"></i>
          <span>账号登录</span>
        </button>
        <button
          @click="loginActiveName = 'wechat'"
          :class="loginActiveName === 'wechat' ? 'tab-active' : 'tab'"
          class="flex-1 flex items-center justify-center gap-2"
        >
          <i class="iconfont icon-wechat"></i>
          <span>微信登录</span>
        </button>
      </div>

      <!-- Account Login Form -->
      <form class="space-y-4" v-if="loginActiveName === 'account'" @submit.prevent="submitLogin">
        <div>
          <label class="input-label">账号</label>
          <input
            class="input h-11"
            placeholder="请输入用户名"
            v-model="data.username"
            autocomplete="off"
          />
        </div>

        <div>
          <label class="input-label">密码</label>
          <input
            class="input h-11"
            placeholder="请输入密码(8-16位)"
            maxlength="16"
            type="password"
            v-model="data.password"
            autocomplete="off"
          />
        </div>

        <button
          class="btn btn-primary w-full h-11 text-base mt-6"
          type="submit"
          :disabled="loading"
        >
          <span v-if="loading" class="spinner mr-2"></span>
          {{ loading ? '登录中...' : '登 录' }}
        </button>

        <div class="flex justify-center items-center pt-2 text-sm text-slate-500 dark:text-slate-400">
          还没有账号？
          <button
            class="ml-1.5 font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 transition-colors"
            @click="login = false"
            type="button"
          >注册</button>
          <button
            type="button"
            class="ml-4 font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 transition-colors"
            @click="showResetPass = true"
          >忘记密码？</button>
        </div>
      </form>

      <!-- WeChat Login -->
      <div v-if="loginActiveName === 'wechat'" class="wechat-login pt-2">
        <div class="qr-code-container">
          <div class="qr-code-wrapper w-[200px] h-[200px] mx-auto" v-if="qrcodeLoading">
            <div class="w-[200px] h-[200px] flex justify-center items-center">
              <i class="iconfont icon-wechat !text-3xl text-green-600"></i>
            </div>
          </div>
          <div class="qr-code-wrapper w-[200px] h-[200px] mx-auto" v-else>
            <img :src="wechatLoginQRCode" class="qr-frame" v-if="wechatLoginQRCode" />
            <div
              v-else
              class="w-[200px] h-[200px] flex justify-center items-center text-green-600"
            >
              <i class="iconfont icon-wechat !text-3xl"></i>
            </div>
            <div v-if="qrcodeExpired" class="qr-expired-mask">
              <div class="expired-content">
                <i class="iconfont icon-refresh-ccw expired-icon"></i>
                <p class="expired-text">二维码已过期</p>
                <button
                  @click="getWxLoginURL"
                  class="btn btn-secondary btn-sm"
                >
                  <i class="iconfont icon-refresh text-lg"></i>
                  刷新
                </button>
              </div>
            </div>
          </div>
          <p class="text-center mt-4 text-sm text-slate-500 dark:text-slate-400">
            请使用微信扫描二维码登录
          </p>
        </div>
      </div>
    </div>

    <!-- Register -->
    <div class="register-box w-full" v-else>
      <form class="space-y-4" v-if="enableRegister" @submit.prevent="submitRegister">
        <!-- Register Tab Switcher -->
        <div class="tabs mb-5">
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
            <input
              class="input h-11"
              :placeholder="activeName === 'mobile' ? '请输入手机号' : '请输入邮箱地址'"
              :value="activeName === 'mobile' ? data.mobile : data.email"
              @input="(e) => activeName === 'mobile' ? data.mobile = e.target.value : data.email = e.target.value"
              autocomplete="off"
            />
          </div>
          <div class="mt-4 flex gap-2">
            <input
              class="input h-11 flex-1"
              placeholder="验证码"
              maxlength="30"
              v-model="data.code"
              autocomplete="off"
            />
            <send-msg :receiver="activeName === 'mobile' ? data.mobile : data.email" :type="activeName" />
          </div>
        </div>

        <!-- Username Register -->
        <div v-if="activeName === 'username'">
          <label class="input-label">用户名</label>
          <input
            class="input h-11"
            placeholder="请输入用户名"
            v-model="data.username"
            autocomplete="off"
          />
        </div>

        <div>
          <label class="input-label">密码</label>
          <input
            class="input h-11"
            placeholder="请输入密码(8-16位)"
            maxlength="16"
            v-model="data.password"
            type="password"
            autocomplete="off"
          />
        </div>

        <div>
          <label class="input-label">确认密码</label>
          <input
            class="input h-11"
            placeholder="请再次输入密码(8-16位)"
            maxlength="16"
            v-model="data.repass"
            type="password"
            autocomplete="off"
          />
        </div>

        <div>
          <label class="input-label">邀请码 <span class="font-normal text-slate-400">(可选)</span></label>
          <input
            class="input h-11"
            placeholder="如有邀请码请填写"
            v-model="data.invite_code"
            autocomplete="off"
          />
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

        <button
          class="btn btn-primary w-full h-11 text-base"
          type="submit"
          :disabled="loading"
        >
          <span v-if="loading" class="spinner mr-2"></span>
          {{ loading ? '注册中...' : '注 册' }}
        </button>

        <div class="flex justify-center items-center text-sm text-slate-500 dark:text-slate-400">
          已有账号？
          <button
            class="ml-1.5 font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 transition-colors"
            @click="login = true"
            type="button"
          >登录</button>
        </div>
      </form>

      <div class="tip-result" v-else>
        <div class="flex gap-4">
          <div class="flex-1 text-center py-8">
            <i class="iconfont icon-close-circle text-5xl text-red-500 mb-4 block"></i>
            <p class="text-lg font-medium mb-2">注册功能已关闭</p>
            <p class="text-sm text-slate-500 dark:text-slate-400">抱歉，系统已关闭注册功能，请联系管理员添加账号！</p>
          </div>
          <div class="flex-1">
            <img :src="wxImg" class="w-32 h-32 mx-auto" />
          </div>
        </div>
      </div>
    </div>

    <reset-pass @hide="showResetPass = false" :show="showResetPass" />

    <!-- Agreement Dialog -->
    <Teleport to="body">
      <transition name="modal">
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
      <transition name="modal">
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
  </div>
</template>

<script setup>
import ResetPass from '@/components/ResetPass.vue'
import SendMsg from '@/components/SendMsg.vue'
import { getSystemInfo } from '@/store/cache'
import { setUserToken } from '@/store/session'
import { useSharedStore } from '@/store/sharedata'
import { showMessageError, showMessageSuccess } from '@/utils/dialog'
import { httpGet, httpPost } from '@/utils/http'
import { arrayContains } from '@/utils/libs'
import { validateEmail, validateMobile } from '@/utils/validate'
import { marked } from 'marked'
import QRCode from 'qrcode'
import { onMounted, onUnmounted, ref, watch } from 'vue'

// eslint-disable-next-line no-undef
const props = defineProps({
  show: Boolean,
  active: {
    type: String,
    default: 'login',
  },
  inviteCode: {
    type: String,
    default: '',
  },
})
const showDialog = ref(false)
watch(
  () => props.show,
  (newValue) => {
    showDialog.value = newValue
  }
)

const login = ref(props.active === 'login')
const loginActiveName = ref('account')
const data = ref({
  username: import.meta.env.VITE_USER,
  password: import.meta.env.VITE_PASS,
  mobile: '',
  email: '',
  repass: '',
  code: '',
  invite_code: props.inviteCode,
})

// WeChat login
const wechatLoginQRCode = ref('')
const wechatLoginState = ref('')
const qrcodeLoading = ref(false)
const pollingTimer = ref(null)
const qrcodeExpired = ref(false)
const qrcodeTimer = ref(null)

const enableMobile = ref(false)
const enableEmail = ref(false)
const enableUser = ref(false)
const enableRegister = ref(true)

const activeName = ref('')
const wxImg = ref('/images/wx.png')
// eslint-disable-next-line no-undef
const emits = defineEmits(['hide', 'success', 'changeActive'])
const showResetPass = ref(false)
const store = useSharedStore()
const loading = ref(false)
const agreeChecked = ref(false)
const showAgreement = ref(false)
const showPrivacy = ref(false)
const agreementHtml = ref('')
const privacyHtml = ref('')

watch(
  () => login.value,
  (newValue) => {
    emits('changeActive', newValue)
  }
)

// Watch login tab switch for WeChat QR
watch(loginActiveName, (newValue) => {
  if (newValue === 'wechat') {
    getWxLoginURL()
  } else {
    if (pollingTimer.value) clearInterval(pollingTimer.value)
    if (qrcodeTimer.value) clearTimeout(qrcodeTimer.value)
  }
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
        if (res.data['wechat_card_url'] !== '') {
          wxImg.value = res.data['wechat_card_url']
        }
      }
    })
    .catch((e) => {
      showMessageError('获取系统配置失败：' + e.message)
    })
})

// WeChat Login
const getWxLoginURL = () => {
  wechatLoginQRCode.value = ''
  qrcodeLoading.value = true
  qrcodeExpired.value = false

  if (qrcodeTimer.value) clearTimeout(qrcodeTimer.value)

  httpGet('/api/user/login/qrcode')
    .then((res) => {
      QRCode.toDataURL(res.data.url, { width: 200, height: 200, margin: 2 }, (error, url) => {
        if (error) {
          console.error(error)
        } else {
          wechatLoginQRCode.value = url
        }
      })
      wechatLoginState.value = res.data.state
      startPolling()
      qrcodeTimer.value = setTimeout(() => {
        qrcodeExpired.value = true
        if (pollingTimer.value) clearInterval(pollingTimer.value)
      }, 60 * 1000)
    })
    .catch((e) => {
      showMessageError('获取微信登录 URL 失败，' + e.message)
    })
    .finally(() => {
      qrcodeLoading.value = false
    })
}

const startPolling = () => {
  if (pollingTimer.value) clearInterval(pollingTimer.value)
  pollingTimer.value = setInterval(() => {
    checkLoginStatus()
  }, 1000)
}

const checkLoginStatus = () => {
  if (!wechatLoginState.value) return

  httpGet(`/api/user/login/status?state=${wechatLoginState.value}`)
    .then((res) => {
      const status = res.data.status
      switch (status) {
        case 'success':
          clearInterval(pollingTimer.value)
          clearTimeout(qrcodeTimer.value)
          setUserToken(res.data.token)
          store.setIsLogin(true)
          showMessageSuccess('登录成功！')
          emits('hide')
          emits('success')
          break
        case 'expired':
          clearInterval(pollingTimer.value)
          clearTimeout(qrcodeTimer.value)
          qrcodeExpired.value = true
          break
        case 'pending':
          break
        default:
          clearInterval(pollingTimer.value)
          clearTimeout(qrcodeTimer.value)
          showMessageError('登录失败，请重试')
          break
      }
    })
    .catch(() => {
      clearInterval(pollingTimer.value)
      clearTimeout(qrcodeTimer.value)
      qrcodeExpired.value = true
    })
}

// Login
const submitLogin = () => {
  if (!data.value.username) {
    return showMessageError('请输入用户名')
  }
  if (!data.value.password) {
    return showMessageError('请输入密码')
  }
  doLogin()
}

const doLogin = () => {
  loading.value = true
  httpPost('/api/user/login', data.value)
    .then((res) => {
      setUserToken(res.data.token)
      store.setIsLogin(true)
      showMessageSuccess('登录成功！')
      emits('hide')
      emits('success')
    })
    .catch((e) => {
      showMessageError('登录失败，' + e.message)
    })
    .finally(() => {
      loading.value = false
    })
}

// Register
const submitRegister = () => {
  if (activeName.value === 'username' && data.value.username === '') {
    return showMessageError('请输入用户名')
  }
  if (activeName.value === 'mobile' && !validateMobile(data.value.mobile)) {
    return showMessageError('请输入合法的手机号')
  }
  if (activeName.value === 'email' && !validateEmail(data.value.email)) {
    return showMessageError('请输入合法的邮箱地址')
  }
  if (data.value.password.length < 8) {
    return showMessageError('密码的长度为8-16个字符')
  }
  if (data.value.repass !== data.value.password) {
    return showMessageError('两次输入密码不一致')
  }
  if ((activeName.value === 'mobile' || activeName.value === 'email') && data.value.code === '') {
    return showMessageError('请输入验证码')
  }
  if (!agreeChecked.value) {
    return showMessageError('请先阅读并同意《用户协议》和《隐私政策》')
  }
  doRegister()
}

const doRegister = () => {
  data.value.reg_way = activeName.value
  loading.value = true
  httpPost('/api/user/register', data.value)
    .then((res) => {
      setUserToken(res.data.token)
      showMessageSuccess({
        message: '注册成功!',
        onClose: () => {
          emits('hide')
          emits('success')
        },
        duration: 1000,
      })
    })
    .catch((e) => {
      showMessageError('注册失败，' + e.message)
    })
    .finally(() => {
      loading.value = false
    })
}

// Agreement & Privacy
const openAgreement = () => {
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

const openPrivacy = () => {
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

onUnmounted(() => {
  if (pollingTimer.value) clearInterval(pollingTimer.value)
  if (qrcodeTimer.value) clearTimeout(qrcodeTimer.value)
})
</script>

<style lang="scss" scoped>
.wechat-login {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 240px;

  .qr-code-container {
    text-align: center;

    .qr-code-wrapper {
      display: inline-block;
      border: 1px solid var(--line-box);
      border-radius: 12px;
      overflow: hidden;
      position: relative;

      .qr-frame {
        display: block;
        width: 100%;
        height: 100%;
      }

      .qr-expired-mask {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 12px;

        .expired-content {
          text-align: center;
          color: white;

          .expired-icon {
            font-size: 48px;
            color: #f56565;
            margin-bottom: 12px;
            display: block;
          }

          .expired-text {
            font-size: 16px;
            margin: 0 0 16px 0;
            font-weight: 500;
          }
        }
      }
    }
  }
}

// Modal transitions
.modal-enter-active { transition: opacity 200ms ease-out; }
.modal-leave-active { transition: opacity 150ms ease-in; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-active .modal-content { transition: transform 200ms ease-out, opacity 200ms ease-out; }
.modal-leave-active .modal-content { transition: transform 150ms ease-in, opacity 150ms ease-in; }
.modal-enter-from .modal-content, .modal-leave-to .modal-content { transform: scale(0.97); opacity: 0; }

// Checkbox
input[type="checkbox"] {
  accent-color: #8b5cf6;
}
</style>
