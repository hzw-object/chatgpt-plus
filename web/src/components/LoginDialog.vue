<template>
  <div class="login-dialog w-full">
    <div class="login-box" v-if="login">
      <custom-tabs v-model="loginActiveName" @tab-click="handleTabClick">
        <!-- 账号密码登录 -->
        <custom-tab-pane name="account" width="48">
          <template #label>
            <div class="flex items-center justify-center px-3">
              <i class="iconfont icon-user-fill mr-2"></i>
              <span>账号登录</span>
            </div>
          </template>
          <form class="form space-y-5" @submit.prevent="submitLogin">
            <div class="block">
              <input
                class="w-full h-12 px-4 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                placeholder="账号"
                v-model="data.username"
                autocomplete="off"
              />
            </div>

            <div class="block">
              <input
                class="w-full h-12 px-4 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                placeholder="请输入密码(8-16位)"
                maxlength="16"
                type="password"
                v-model="data.password"
                autocomplete="off"
              />
            </div>

            <div class="btn-row mt-8">
              <button
                class="w-full h-12 rounded-xl text-base font-medium text-white bg-gradient-to-r from-violet-500 to-violet-700 hover:from-violet-600 hover:to-violet-800 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 shadow-md"
                type="submit"
              >
                {{ loading ? '登录中...' : '登 录' }}
              </button>
            </div>

            <div class="w-full">
              <div
                class="text flex justify-center items-center pt-3 text-sm"
                style="color: var(--login-text-color)"
              >
                还没有账号？
                <button
                  size="small"
                  class="ml-2 rounded-md px-2 py-1 transition-colors duration-200"
                  style="color: var(--login-link-color)"
                  @click="login = false"
                  type="button"
                  >注册</button
                >

                <button
                  type="button"
                  class="forget ml-4"
                  size="small"
                  @click="showResetPass = true"
                  >忘记密码？</button
                >
              </div>
            </div>
          </form>
        </custom-tab-pane>

        <!-- 微信登录 -->
        <custom-tab-pane name="wechat" width="48">
          <template #label>
            <div class="flex items-center justify-center px-3">
              <i class="iconfont icon-wechat mr-2"></i>
              <span>微信登录</span>
            </div>
          </template>
          <div class="wechat-login pt-3">
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
                <!-- 二维码过期蒙版 -->
                <div v-if="qrcodeExpired" class="qr-expired-mask">
                  <div class="expired-content">
                    <i class="iconfont icon-refresh-ccw expired-icon"></i>
                    <p class="expired-text">二维码已过期</p>
                    <button
                      @click="getWxLoginURL"
                      class="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600"
                    >
                      <i class="iconfont icon-refresh text-lg"></i>
                    </button>
                  </div>
                </div>
              </div>
              <p class="text-center mt-4 text-slate-600 dark:text-slate-400">
                请使用微信扫描二维码登录
              </p>
            </div>
          </div>
        </custom-tab-pane>
      </custom-tabs>
    </div>

    <div class="register-box w-full" v-else>
      <form class="form space-y-5" v-if="enableRegister" @submit.prevent="submitRegister">
        <div class="flex border-b border-slate-200 dark:border-slate-700 mb-4">
          <button
            v-if="enableMobile"
            type="button"
            class="px-4 py-2 text-sm font-medium transition-colors duration-200"
            :class="activeName === 'mobile' ? 'border-b-2 border-violet-500 text-violet-600' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'"
            @click="activeName = 'mobile'"
          >
            手机注册
          </button>
          <button
            v-if="enableEmail"
            type="button"
            class="px-4 py-2 text-sm font-medium transition-colors duration-200"
            :class="activeName === 'email' ? 'border-b-2 border-violet-500 text-violet-600' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'"
            @click="activeName = 'email'"
          >
            邮箱注册
          </button>
          <button
            v-if="enableUser"
            type="button"
            class="px-4 py-2 text-sm font-medium transition-colors duration-200"
            :class="activeName === 'username' ? 'border-b-2 border-violet-500 text-violet-600' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'"
            @click="activeName = 'username'"
          >
            用户名注册
          </button>
        </div>

        <div v-if="activeName === 'mobile' || activeName === 'email'">
          <div class="block">
            <input
              class="w-full h-12 px-4 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              :placeholder="activeName === 'mobile' ? '手机号码' : '邮箱地址'"
              size="large"
              :value="activeName === 'mobile' ? data.mobile : data.email"
              @input="(e) => activeName === 'mobile' ? data.mobile = e.target.value : data.email = e.target.value"
              autocomplete="off"
            />
          </div>
          <div class="block mt-4 flex gap-2">
            <input
              class="flex-1 h-12 px-4 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:border-purple-500 focus:outline-none"
              placeholder="验证码"
              size="large"
              maxlength="30"
              v-model="data.code"
              autocomplete="off"
            />
            <send-msg size="large" :receiver="activeName === 'mobile' ? data.mobile : data.email" :type="activeName" />
          </div>
        </div>

        <div v-if="activeName === 'username'">
          <div class="block">
            <input
              class="w-full h-12 px-4 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              placeholder="用户名"
              size="large"
              v-model="data.username"
              autocomplete="off"
            />
          </div>
        </div>

        <div class="block">
          <input
            class="w-full h-12 px-4 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            placeholder="请输入密码(8-16位)"
            maxlength="16"
            size="large"
            v-model="data.password"
            type="password"
            autocomplete="off"
          />
        </div>

        <div class="block">
          <input
            class="w-full h-12 px-4 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            placeholder="重复密码(8-16位)"
            size="large"
            maxlength="16"
            v-model="data.repass"
            type="password"
            autocomplete="off"
          />
        </div>

        <div class="block">
          <input
            class="w-full h-12 px-4 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            placeholder="邀请码(可选)"
            size="large"
            v-model="data.invite_code"
            autocomplete="off"
          />
        </div>

        <div class="block text-sm">
          <label class="flex items-center">
            <input type="checkbox" v-model="agreeChecked" class="mr-2" />
            我已阅读并同意
            <a href="javascript:void(0)" class="text-blue-500" @click="openAgreement"
              >《用户协议》</a
            >
            和
            <a href="javascript:void(0)" class="text-blue-500" @click="openPrivacy">《隐私政策》</a>
          </label>
        </div>

        <div class="w-full">
          <button
            class="w-full h-12 rounded-xl text-base font-medium text-white bg-gradient-to-r from-violet-500 to-violet-700 hover:from-violet-600 hover:to-violet-800 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 shadow-md"
            type="submit"
          >
            {{ loading ? '注册中...' : '注 册' }}
          </button>
        </div>

        <div
          class="text text-sm flex justify-center items-center w-full pt-3"
          style="color: var(--login-text-color)"
        >
          已有账号？
          <button
            size="small"
            class="ml-2 rounded-md px-2 py-1 transition-colors duration-200"
            style="color: var(--login-link-color)"
            @click="login = true"
            type="button"
            >登录</button
          >
        </div>
      </form>

      <div class="tip-result" v-else>
        <div class="flex gap-4">
          <div class="flex-1 text-center py-8">
            <i class="iconfont icon-close-circle text-5xl text-red-500 mb-4"></i>
            <p class="text-lg font-medium mb-2">注册功能已关闭</p>
            <p class="text-sm text-slate-500 dark:text-slate-400">抱歉，系统已关闭注册功能，请联系管理员添加账号！</p>
          </div>

          <div class="flex-1">
            <img :src="wxImg" class="w-32 h-32 mx-auto" />
          </div>
        </div>
      </div>
    </div>
    <captcha v-if="enableCaptcha" :type="captchaType" @success="submit" ref="captchaRef" />

    <reset-pass @hide="showResetPass = false" :show="showResetPass" />

    <div v-if="showAgreement" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" @click.self="showAgreement = false">
      <div class="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-auto">
        <h3 class="text-lg font-medium mb-4">用户协议</h3>
        <div class="prose" v-html="agreementHtml"></div>
        <button @click="showAgreement = false" class="mt-4 px-4 py-2 bg-violet-500 text-white rounded-lg">关闭</button>
      </div>
    </div>

    <div v-if="showPrivacy" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" @click.self="showPrivacy = false">
      <div class="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-auto">
        <h3 class="text-lg font-medium mb-4">隐私政策</h3>
        <div class="prose" v-html="privacyHtml"></div>
        <button @click="showPrivacy = false" class="mt-4 px-4 py-2 bg-violet-500 text-white rounded-lg">关闭</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import Captcha from '@/components/Captcha.vue'
import ResetPass from '@/components/ResetPass.vue'
import SendMsg from '@/components/SendMsg.vue'
import CustomTabPane from '@/components/ui/CustomTabPane.vue'
import CustomTabs from '@/components/ui/CustomTabs.vue'
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
const loginActiveName = ref('account') // 新增：登录标签页激活状态
const data = ref({
  username: import.meta.env.VITE_USER,
  password: import.meta.env.VITE_PASS,
  mobile: '',
  email: '',
  repass: '',
  code: '',
  invite_code: props.inviteCode,
})

// 微信登录相关变量
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
const captchaRef = ref(null)
// eslint-disable-next-line no-undef
const emits = defineEmits(['hide', 'success', 'changeActive'])
const action = ref('login')
const enableCaptcha = ref(false)
const captchaType = ref('')
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
        // 是否启用注册
        enableRegister.value = res.data['enabled_register']
        // 使用后台上传的客服微信二维码
        if (res.data['wechat_card_url'] !== '') {
          wxImg.value = res.data['wechat_card_url']
        }
      }
    })
    .catch((e) => {
      showMessageError('获取系统配置失败：' + e.message)
    })

  httpGet('/api/captcha/config').then((res) => {
    enableCaptcha.value = res.data['enabled']
    captchaType.value = res.data['type']
  })
})

// 监听登录标签页切换
watch(loginActiveName, (newValue) => {
  if (newValue === 'wechat') {
    getWxLoginURL()
  } else {
    // 其他登录方式，清除定时器
    if (pollingTimer.value) {
      clearInterval(pollingTimer.value)
    }
    if (qrcodeTimer.value) {
      clearTimeout(qrcodeTimer.value)
    }
  }
})

const handleTabClick = (tab) => {
  // CustomTabs组件传递的是tab对象，包含paneName属性
  if (tab.paneName === 'wechat') {
    getWxLoginURL()
  } else {
    // 其他登录方式，清除定时器
    if (pollingTimer.value) {
      clearInterval(pollingTimer.value)
    }
    if (qrcodeTimer.value) {
      clearTimeout(qrcodeTimer.value)
    }
  }
}

const submit = (verifyData) => {
  if (action.value === 'login') {
    doLogin(verifyData)
  } else if (action.value === 'register') {
    doRegister(verifyData)
  }
}

// 获取微信登录 URL
const getWxLoginURL = () => {
  wechatLoginQRCode.value = ''
  qrcodeLoading.value = true
  qrcodeExpired.value = false

  // 清除可能存在的旧定时器
  if (qrcodeTimer.value) {
    clearTimeout(qrcodeTimer.value)
  }

  httpGet('/api/user/login/qrcode')
    .then((res) => {
      // 生成二维码
      QRCode.toDataURL(res.data.url, { width: 200, height: 200, margin: 2 }, (error, url) => {
        if (error) {
          console.error(error)
        } else {
          wechatLoginQRCode.value = url
        }
      })
      wechatLoginState.value = res.data.state
      // 开始轮询状态
      startPolling()

      // 设置1分钟后二维码过期
      qrcodeTimer.value = setTimeout(() => {
        qrcodeExpired.value = true
        // 停止轮询
        if (pollingTimer.value) {
          clearInterval(pollingTimer.value)
        }
      }, 60 * 1000) // 1分钟过期
    })
    .catch((e) => {
      showMessageError('获取微信登录 URL 失败，' + e.message)
    })
    .finally(() => {
      qrcodeLoading.value = false
    })
}

// 开始轮询
const startPolling = () => {
  // 清除可能存在的旧定时器
  if (pollingTimer.value) {
    clearInterval(pollingTimer.value)
  }

  pollingTimer.value = setInterval(() => {
    checkLoginStatus()
  }, 1000) // 每1秒检查一次
}

// 检查登录状态
const checkLoginStatus = () => {
  if (!wechatLoginState.value) return

  httpGet(`/api/user/login/status?state=${wechatLoginState.value}`)
    .then((res) => {
      const status = res.data.status

      switch (status) {
        case 'success':
          // 登录成功
          clearInterval(pollingTimer.value)
          clearTimeout(qrcodeTimer.value)
          setUserToken(res.data.token)
          store.setIsLogin(true)
          showMessageSuccess('登录成功！')
          emits('hide')
          emits('success')
          break

        case 'expired':
          // 二维码过期
          clearInterval(pollingTimer.value)
          clearTimeout(qrcodeTimer.value)
          qrcodeExpired.value = true
          break

        case 'pending':
          // 继续轮询
          break

        default:
          // 其他错误情况
          clearInterval(pollingTimer.value)
          clearTimeout(qrcodeTimer.value)
          showMessageError('登录失败，请重试')
          break
      }
    })
    .catch((e) => {
      // 发生错误时显示过期状态
      clearInterval(pollingTimer.value)
      clearTimeout(qrcodeTimer.value)
      qrcodeExpired.value = true
    })
}

// 登录操作
const submitLogin = () => {
  if (!data.value.username) {
    return showMessageError('请输入用户名')
  }
  if (!data.value.password) {
    return showMessageError('请输入密码')
  }
  if (enableCaptcha.value) {
    captchaRef.value.loadCaptcha()
    action.value = 'login'
  } else {
    doLogin({})
  }
}

const doLogin = (verifyData) => {
  data.value.key = verifyData.key
  data.value.dots = verifyData.dots
  data.value.x = verifyData.x
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

// 注册操作
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
  if (enableCaptcha.value) {
    captchaRef.value.loadCaptcha()
    action.value = 'register'
  } else {
    doRegister({})
  }
}

const doRegister = (verifyData) => {
  data.value.key = verifyData.key
  data.value.dots = verifyData.dots
  data.value.x = verifyData.x
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

// 打开并加载协议
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

// 打开并加载隐私政策
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

// 组件卸载时清除定时器
onUnmounted(() => {
  if (pollingTimer.value) {
    clearInterval(pollingTimer.value)
  }
  if (qrcodeTimer.value) {
    clearTimeout(qrcodeTimer.value)
  }
})
</script>

<style lang="scss">
.login-dialog {
  border-radius: 10px;

  // 微信登录样式
  .wechat-login {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 240px;

    .qr-code-container {
      text-align: center;

      .qr-code-wrapper {
        display: inline-block;
        border: 1px solid var(--el-border-color);
        border-radius: 8px;
        overflow: hidden;
        position: relative;

        .qr-frame {
          display: block;
          width: 100%;
          height: 100%;
        }

        .qr-expired-mask {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;

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

  // CustomTabs 组件样式优化
  :deep(.custom-tabs-header) {
    background: var(--el-fill-color-light);
    border-radius: 8px;
    margin-bottom: 20px;
  }

  :deep(.custom-tab-item) {
    font-weight: 500;
    transition: all 0.3s ease;

    &:hover {
      background: var(--el-fill-color);
    }
  }

  :deep(.custom-tab-active) {
    background: var(--el-color-primary);
    color: white !important;

    &:hover {
      background: var(--el-color-primary);
    }
  }

  :deep(.el-input) {
    .el-input__wrapper {
      background: var(--el-fill-color-blank);
      border-color: var(--el-border-color);

      &.is-focus {
        border-color: var(--el-color-primary);
      }
    }

    .el-input__inner {
      color: var(--el-text-color-primary);

      &::placeholder {
        color: var(--el-text-color-placeholder);
      }
    }

    .el-input__prefix,
    .el-input__suffix {
      color: var(--el-text-color-regular);
    }
  }

  :deep(.el-button) {
    &.el-button--info {
      color: var(--el-text-color-regular);
      background: transparent;
      border: none;

      &:hover {
        background: var(--el-fill-color-light);
      }
    }
  }
}

// 响应式设计
@media (max-width: 576px) {
  .login-dialog {
    .wechat-login {
      .qr-code-wrapper {
        width: 240px !important;
        height: 240px !important;

        .qr-expired-mask {
          .expired-content {
            .expired-icon {
              font-size: 36px;
              margin-bottom: 8px;
            }

            .expired-text {
              font-size: 14px;
              margin: 0 0 12px 0;
            }
          }
        }
      }
    }
  }
}
</style>
