<template>
  <div class="page-invitation p-4">
    <div class="max-w-4xl mx-auto">
      <h2 class="text-2xl p-4 font-bold text-center text-slate-900 dark:text-slate-100">会员推广计划</h2>

      <div class="share-box bg-slate-100 dark:bg-slate-800 rounded-xl p-6 mb-6">
        <div class="info text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
          我们非常欢迎您把此应用分享给您身边的朋友，分享成功注册后您和被邀请人都将获得
          <strong class="text-red-500">{{ invitePower }}</strong>
          算力额度作为奖励。你可以保存下面的二维码或者直接复制分享您的专属推广链接发送给微信好友。
        </div>

        <div class="invite-qrcode text-center py-6">
          <img :src="qrImg" class="inline-block w-64 h-64 rounded-lg" alt="邀请二维码" />
        </div>

        <div class="invite-url flex items-center justify-between gap-4 p-4 border border-slate-300 dark:border-slate-600 rounded-xl">
          <span class="text-sm text-slate-600 dark:text-slate-400 truncate">{{ inviteURL }}</span>
          <button
            class="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg whitespace-nowrap copy-link"
            :data-clipboard-text="inviteURL"
          >
            复制链接
          </button>
        </div>
      </div>

      <div class="invite-stats grid grid-cols-3 gap-4 mb-6">
        <div class="item-box yellow rounded-xl p-4 h-32 flex items-center justify-center">
          <div class="flex items-center gap-4">
            <i class="iconfont icon-role text-6xl"></i>
            <div class="text-center">
              <div class="num text-4xl font-bold">{{ hits }}</div>
              <div class="text text-sm">点击量</div>
            </div>
          </div>
        </div>

        <div class="item-box blue rounded-xl p-4 h-32 flex items-center justify-center">
          <div class="flex items-center gap-4">
            <i class="iconfont icon-order text-6xl"></i>
            <div class="text-center">
              <div class="num text-4xl font-bold">{{ regNum }}</div>
              <div class="text text-sm">注册量</div>
            </div>
          </div>
        </div>

        <div class="item-box bg-green-500 rounded-xl p-4 h-32 flex items-center justify-center text-white">
          <div class="flex items-center gap-4">
            <i class="iconfont icon-chart text-6xl"></i>
            <div class="text-center">
              <div class="num text-4xl font-bold">{{ rate }}%</div>
              <div class="text text-sm">转化率</div>
            </div>
          </div>
        </div>
      </div>

      <div class="box-card">
        <h2 class="text-xl pb-4 text-slate-900 dark:text-slate-100">您推荐的用户</h2>
        <invite-list v-if="isLogin" />
      </div>
    </div>
  </div>
</template>

<script setup>
import InviteList from '@/components/InviteList.vue'
import { checkSession, getSystemInfo } from '@/store/cache'
import { useSharedStore } from '@/store/sharedata'
import { httpGet } from '@/utils/http'
import { showMessageError, showMessageSuccess } from '@/utils/dialog'
import Clipboard from 'qrcode'
import { onMounted, ref } from 'vue'

const inviteURL = ref('')
const qrImg = ref('/images/wx.png')
const invitePower = ref(0)
const hits = ref(0)
const regNum = ref(0)
const rate = ref(0)
const isLogin = ref(false)
const store = useSharedStore()

onMounted(() => {
  initData()
})

const initData = () => {
  checkSession()
    .then(() => {
      isLogin.value = true
      httpGet('/api/invite/code')
        .then((res) => {
          const text = `${location.protocol}//${location.host}/register?invite_code=${res.data.code}`
          hits.value = res.data['hits']
          regNum.value = res.data['reg_num']
          if (hits.value > 0) {
            rate.value = ((regNum.value / hits.value) * 100).toFixed(2)
          }
          import('qrcode').then(({ default: QRCode }) => {
            QRCode.toDataURL(text, { width: 400, height: 400, margin: 2 }, (error, url) => {
              if (!error) {
                qrImg.value = url
              }
            })
          })
          inviteURL.value = text
        })
        .catch((e) => {
          showMessageError('获取邀请码失败：' + e.message)
        })

      getSystemInfo()
        .then((res) => {
          invitePower.value = res.data['invite_power']
        })
        .catch((e) => {
          showMessageError('获取系统配置失败：' + e.message)
        })
    })
    .catch(() => {
      store.setShowLoginDialog(true)
    })
}

// 复制链接
onMounted(() => {
  const clipboard = new Clipboard('.copy-link')
  clipboard.on('success', () => {
    showMessageSuccess('复制成功！')
  })
  clipboard.on('error', () => {
    showMessageError('复制失败！')
  })
})
</script>

<style scoped>
.page-invitation {
  min-height: 100vh;
}

.yellow {
  background-color: #ffeecc;
  color: #d68f00;
}

.dark .yellow {
  background-color: #78350f;
  color: #fcd34d;
}

.blue {
  background-color: #d6e4ff;
  color: #1062fe;
}

.dark .blue {
  background-color: #1e3a8a;
  color: #93c5fd;
}
</style>