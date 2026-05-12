<template>
  <div class="member p-4">
    <div class="inner max-w-6xl mx-auto">
      <!-- Profile Card -->
      <div class="bg-white dark:bg-slate-800 rounded-xl p-6 mb-6 shadow-sm">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            @click="showBindEmailDialog = true"
            class="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
          >
            <i class="iconfont icon-email text-xl text-violet-600"></i>
            <span class="text-slate-700 dark:text-slate-300">绑定邮箱</span>
          </button>
          <button
            @click="showBindMobileDialog = true"
            class="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
          >
            <i class="iconfont icon-mobile text-xl text-violet-600"></i>
            <span class="text-slate-700 dark:text-slate-300">绑定手机</span>
          </button>
          <button
            @click="showPasswordDialog = true"
            class="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
          >
            <i class="iconfont icon-password text-xl text-violet-600"></i>
            <span class="text-slate-700 dark:text-slate-300">修改密码</span>
          </button>
          <button
            @click="showRedeemVerifyDialog = true"
            class="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
          >
            <i class="iconfont icon-redeem text-xl text-violet-600"></i>
            <span class="text-slate-700 dark:text-slate-300">卡密兑换</span>
          </button>
        </div>
      </div>

      <!-- Product List -->
      <div class="product-box">
        <div v-if="list.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          <div
            v-for="item in list"
            :key="item.id"
            class="product-item bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <div class="product-header relative">
              <div class="image-container h-40 bg-slate-100 dark:bg-slate-700">
                <img :src="vipImg" class="w-full h-full object-cover" />
                <div class="image-overlay absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span class="vip-badge bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium">热销</span>
                </div>
              </div>
              <div class="product-title p-4">
                <h3 class="name font-semibold text-slate-900 dark:text-slate-100">{{ item.name }}</h3>
                <p class="description text-sm text-slate-500 dark:text-slate-400">算力值：{{ item.power }}</p>
              </div>
            </div>

            <div class="product-content p-4 pt-0">
              <div class="price-section mb-4">
                <div class="price-info">
                  <span class="currency text-lg text-slate-500">￥</span>
                  <span class="price-value text-2xl font-bold text-slate-900 dark:text-slate-100">{{ item.price }}</span>
                </div>
              </div>

              <div class="features-list space-y-2 mb-4" v-if="item.features">
                <div class="feature-item flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400" v-for="feature in item.features" :key="feature">
                  <i class="iconfont icon-check text-green-500"></i>
                  <span>{{ feature }}</span>
                </div>
              </div>

              <div class="payment-buttons flex gap-2">
                <button class="flex-1 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center justify-center gap-1" @click="wxPay(item)">
                  <i class="iconfont icon-wechat-pay"></i>
                  <span>微信</span>
                </button>
                <button class="flex-1 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-lg flex items-center justify-center gap-1" @click="alipay(item)">
                  <i class="iconfont icon-alipay"></i>
                  <span>支付宝</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-12 text-slate-400">
          <i class="iconfont icon-empty text-5xl mb-3"></i>
          <p>暂无数据</p>
        </div>
      </div>

      <!-- Orders -->
      <div class="box-card mt-8">
        <h2 class="text-xl pb-4 text-slate-900 dark:text-slate-100">消费账单</h2>
        <user-order v-if="isLogin" :key="userOrderKey" />
      </div>
    </div>

    <!-- Dialogs -->
    <password-dialog v-if="isLogin" :show="showPasswordDialog" @hide="showPasswordDialog = false" />

    <teleport to="body">
      <div v-if="showBindMobileDialog" class="fixed inset-0 bg-black/50 z-40 flex items-center justify-center" @click.self="showBindMobileDialog = false">
        <div class="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-md mx-4">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100">绑定手机</h3>
            <button @click="showBindMobileDialog = false" class="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
              <i class="iconfont icon-close"></i>
            </button>
          </div>
          <bind-mobile @hide="showBindMobileDialog = false" />
        </div>
      </div>
    </teleport>

    <teleport to="body">
      <div v-if="showBindEmailDialog" class="fixed inset-0 bg-black/50 z-40 flex items-center justify-center" @click.self="showBindEmailDialog = false">
        <div class="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-md mx-4">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100">绑定邮箱</h3>
            <button @click="showBindEmailDialog = false" class="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
              <i class="iconfont icon-close"></i>
            </button>
          </div>
          <bind-email @hide="showBindEmailDialog = false" />
        </div>
      </div>
    </teleport>

    <teleport to="body">
      <div v-if="showRedeemVerifyDialog" class="fixed inset-0 bg-black/50 z-40 flex items-center justify-center" @click.self="showRedeemVerifyDialog = false">
        <div class="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-md mx-4">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100">卡密兑换</h3>
            <button @click="showRedeemVerifyDialog = false" class="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
              <i class="iconfont icon-close"></i>
            </button>
          </div>
          <redeem-verify @hide="redeemCallback" />
        </div>
      </div>
    </teleport>

    <!-- QR Code Dialog -->
    <teleport to="body">
      <div v-if="showQrCode" class="fixed inset-0 bg-black/50 z-40 flex items-center justify-center" @click.self="showQrCode = false">
        <div class="bg-white dark:bg-slate-800 rounded-xl p-6 w-80 mx-4">
          <div class="text-center mb-4">
            <span class="text-slate-700 dark:text-slate-300">{{ title }}</span>
          </div>
          <div class="qr-container">
            <img :src="qrImg" class="w-64 h-64 mx-auto" />
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import BindEmail from '@/components/BindEmail.vue'
import BindMobile from '@/components/BindMobile.vue'
import PasswordDialog from '@/components/PasswordDialog.vue'
import RedeemVerify from '@/components/RedeemVerify.vue'
import UserOrder from '@/components/UserOrder.vue'
import { checkSession, getSystemInfo } from '@/store/cache'
import { useSharedStore } from '@/store/sharedata'
import { showLoading, closeLoading, showMessageInfo, showMessageError } from '@/utils/dialog'
import { httpGet, httpPost } from '@/utils/http'
import { isMobile } from '@/utils/libs'
import QRCode from 'qrcode'
import { onMounted, onUnmounted, ref } from 'vue'

const list = ref([])
const vipImg = ref('/images/menu/member.png')
const enableReward = ref(false)
const rewardImg = ref('/images/reward.png')
const showPasswordDialog = ref(false)
const showBindMobileDialog = ref(false)
const showBindEmailDialog = ref(false)
const showRedeemVerifyDialog = ref(false)
const user = ref(null)
const isLogin = ref(false)
const orderTimeout = ref(1800)
const loading = ref(false)
const loadingText = ref('加载中...')

const store = useSharedStore()
const userOrderKey = ref(0)
const showQrCode = ref(false)
const qrImg = ref('')
const title = ref('')
const handler = ref(null)

onMounted(() => {
  checkSession()
    .then((_user) => {
      user.value = _user
      isLogin.value = true
    })
    .catch(() => {
      store.setShowLoginDialog(true)
    })

  httpGet('/api/product/list')
    .then((res) => {
      list.value = res.data
      loading.value = false
    })
    .catch((e) => {
      showMessageError('获取产品套餐失败：' + e.message)
    })

  getSystemInfo()
    .then((res) => {
      rewardImg.value = res.data['reward_img']
      enableReward.value = res.data['enabled_reward']
      if (res.data['order_pay_timeout'] > 0) {
        orderTimeout.value = res.data['order_pay_timeout']
      }
    })
    .catch((e) => {
      showMessageError('获取系统配置失败：' + e.message)
    })
})

const selectedPid = ref(0)
const wxPay = (product) => {
  selectedPid.value = product.id
  title.value = '请打开微信扫码支付'
  generateOrder('wxpay')
}

const alipay = (product) => {
  selectedPid.value = product.id
  title.value = '请打开支付宝扫码支付'
  generateOrder('alipay')
}

const generateOrder = (payWay) => {
  showLoading('正在生成支付订单...')
  httpPost('/api/payment/create', {
    pid: selectedPid.value,
    pay_way: payWay,
    domain: `${window.location.protocol}//${window.location.host}`,
    device: isMobile() ? 'mobile' : 'pc',
  })
    .then((res) => {
      closeLoading()

      if (isMobile()) {
        window.location.href = res.data.pay_url
      } else {
        QRCode.toDataURL(res.data.pay_url, { width: 300, height: 300, margin: 2 }, (error, url) => {
          if (!error) {
            qrImg.value = url
          }
        })
        if (handler.value) {
          clearTimeout(handler.value)
        }
        handler.value = setTimeout(() => queryOrder(res.data.order_no), 3000)
        showQrCode.value = true
      }
    })
    .catch((e) => {
      closeLoading()
      showMessageError('生成支付订单失败：' + e.message)
    })
}

const queryOrder = async (orderNo) => {
  const res = await httpGet('/api/order/query?order_no=' + orderNo)
  if (res?.data.status === 2) {
    clearTimeout(handler.value)
    showMessageInfo('支付成功')
    showQrCode.value = false
    user.value.scores += res.data.credit
  } else {
    handler.value = setTimeout(() => queryOrder(orderNo), 3000)
  }
}

const redeemCallback = (success) => {
  showRedeemVerifyDialog.value = false
  if (success) {
    userOrderKey.value += 1
  }
}

onUnmounted(() => {
  if (handler.value) {
    clearTimeout(handler.value)
    handler.value = null
  }
})
</script>

<style scoped>
.member {
  min-height: 100vh;
}

.vip-badge {
  position: absolute;
  top: 8px;
  right: 8px;
}
</style>