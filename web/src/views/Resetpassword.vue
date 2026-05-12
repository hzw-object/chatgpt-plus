<template>
  <div class="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-950">
    <div class="left w-full max-w-md p-8">
      <div class="login-box bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8">
        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100">重置密码</h2>
        </div>

        <!-- Tab switcher -->
        <div class="flex mb-6 border-b border-slate-200 dark:border-slate-700">
          <button
            @click="form.type = 'mobile'"
            :class="form.type === 'mobile' ? 'border-b-2 border-violet-600 text-violet-600' : 'text-slate-500'"
            class="flex-1 pb-3 text-center font-medium transition-colors"
          >
            手机号验证
          </button>
          <button
            @click="form.type = 'email'"
            :class="form.type === 'email' ? 'border-b-2 border-violet-600 text-violet-600' : 'text-slate-500'"
            class="flex-1 pb-3 text-center font-medium transition-colors"
          >
            邮箱验证
          </button>
        </div>

        <div class="space-y-4">
          <!-- Mobile tab -->
          <template v-if="form.type === 'mobile'">
            <div>
              <div class="form-title text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">手机号码</div>
              <input
                v-model="form.mobile"
                type="tel"
                placeholder="请输入手机号"
                class="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-violet-500 outline-none"
              />
            </div>
            <div>
              <div class="form-title text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">验证码</div>
              <div class="flex gap-2">
                <input
                  v-model="form.code"
                  type="text"
                  maxlength="6"
                  placeholder="请输入验证码"
                  class="flex-1 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-violet-500 outline-none"
                />
                <send-msg :receiver="form.mobile" type="mobile" />
              </div>
            </div>
          </template>

          <!-- Email tab -->
          <template v-if="form.type === 'email'">
            <div>
              <div class="form-title text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">邮箱</div>
              <input
                v-model="form.email"
                type="email"
                placeholder="请输入邮箱"
                class="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-violet-500 outline-none"
              />
            </div>
            <div>
              <div class="form-title text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">验证码</div>
              <div class="flex gap-2">
                <input
                  v-model="form.code"
                  type="text"
                  maxlength="6"
                  placeholder="请输入验证码"
                  class="flex-1 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-violet-500 outline-none"
                />
                <send-msg :receiver="form.email" type="email" />
              </div>
            </div>
          </template>

          <!-- Password fields -->
          <div>
            <div class="form-title text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">新密码</div>
            <input
              v-model="form.password"
              type="password"
              placeholder="请输入新密码(8-16位)"
              class="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-violet-500 outline-none"
            />
          </div>
          <div>
            <div class="form-title text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">重复密码</div>
            <input
              v-model="form.repass"
              type="password"
              placeholder="请再次输入密码(8-16位)"
              class="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-violet-500 outline-none"
            />
          </div>

          <button
            @click="save"
            class="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-colors"
          >
            重置密码
          </button>
        </div>
      </div>
    </div>
    <account-bg class="hidden lg:block" />
  </div>
</template>

<script setup>
import AccountTop from '@/components/AccountTop.vue'
import SendMsg from '@/components/SendMsg.vue'
import AccountBg from '@/components/AccountBg.vue'
import { httpPost } from '@/utils/http'
import { showMessageError, showMessageSuccess } from '@/utils/dialog'
import { ref } from 'vue'

const form = ref({
  mobile: '',
  email: '',
  type: 'mobile',
  code: '',
  password: '',
  repass: '',
})

const save = () => {
  if (form.value.code === '') {
    return showMessageError('请输入验证码')
  }
  if (form.value.password.length < 8) {
    return showMessageError('密码长度必须大于8位')
  }
  if (form.value.repass !== form.value.password) {
    return showMessageError('两次输入密码不一致')
  }

  httpPost('/api/user/resetPass', form.value)
    .then(() => {
      showMessageSuccess('重置密码成功')
    })
    .catch((e) => {
      showMessageError('重置密码失败：' + e.message)
    })
}
</script>

<style scoped>
.loginPage {
  @apply min-h-screen;
}
</style>