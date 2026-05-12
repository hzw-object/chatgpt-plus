<template>
  <div class="page-apps p-4">
    <!-- Category tabs -->
    <div class="flex overflow-x-auto gap-2 pb-4 border-b border-slate-200 dark:border-slate-700">
      <button
        v-for="item in ['', ...appTypes]"
        :key="item.id || 'all'"
        @click="getAppList(item.id || '')"
        :class="typeId === (item.id || '') ? 'bg-violet-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'"
        class="px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition-colors"
      >
        <img v-if="item.icon" :src="item.icon" class="w-5 h-5 inline mr-2 rounded" />
        {{ item.name || '全部分类' }}
      </button>
    </div>

    <!-- App list -->
    <div class="app-list-container mt-4">
      <div v-if="list.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div
          v-for="scope in list"
          :key="scope.id"
          class="item bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        >
          <div class="image h-40 bg-slate-100 dark:bg-slate-700">
            <img :src="scope.item.icon" class="w-full h-full object-cover" />
          </div>

          <div class="inner p-4">
            <div class="info mb-3">
              <div class="info-title font-semibold text-slate-900 dark:text-slate-100">{{ scope.item.name }}</div>
              <div class="info-text text-sm text-slate-500 dark:text-slate-400 mt-1">{{ scope.item.hello_msg }}</div>
            </div>
            <div class="btn flex gap-2">
              <button class="px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm" @click="useRole(scope.item)">
                使用
              </button>
              <button v-if="hasRole(scope.item.key)" class="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm" @click="updateRole(scope.item, 'remove')">
                移除
              </button>
              <button v-else class="px-3 py-1.5 bg-teal-500 hover:bg-teal-600 text-white rounded-lg text-sm" @click="updateRole(scope.item, 'add')">
                添加
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
  </div>
</template>

<script setup>
import ItemList from '@/components/ItemList.vue'
import { checkSession } from '@/store/cache'
import { useSharedStore } from '@/store/sharedata'
import { httpGet, httpPost } from '@/utils/http'
import { arrayContains, removeArrayItem, substr } from '@/utils/libs'
import { showMessageError, showMessageSuccess } from '@/utils/dialog'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const typeId = ref('')
const appTypes = ref([])
const list = ref([])
const roles = ref([])
const store = useSharedStore()
const router = useRouter()

onMounted(() => {
  getAppType()
  getAppList()
  getRoles()
})

const getRoles = () => {
  checkSession()
    .then((user) => {
      roles.value = user.chat_roles
    })
    .catch(() => {})
}

const getAppType = () => {
  httpGet('/api/app/type/list')
    .then((res) => {
      appTypes.value = res.data
    })
    .catch((e) => {
      showMessageError('获取分类失败：' + e.message)
    })
}

const getAppList = (tid = '') => {
  typeId.value = tid
  httpGet('/api/app/list', { tid })
    .then((res) => {
      const items = res.data
      for (let i = 0; i < items.length; i++) {
        items[i].intro = substr(items[i].hello_msg, 80)
      }
      list.value = items
    })
    .catch((e) => {
      showMessageError('获取应用失败：' + e.message)
    })
}

const updateRole = (row, opt) => {
  checkSession()
    .then(() => {
      if (opt === 'add') {
        const exists = arrayContains(roles.value, row.key)
        if (exists) return
        roles.value.push(row.key)
      } else {
        const exists = arrayContains(roles.value, row.key)
        if (!exists) return
        roles.value = removeArrayItem(roles.value, row.key)
      }
      httpPost('/api/app/update', { keys: roles.value })
        .then(() => {
          showMessageSuccess(opt === 'add' ? '添加应用成功！' : '移除应用成功！')
        })
        .catch((e) => {
          showMessageError((opt === 'add' ? '添加应用' : '移除应用') + '失败：' + e.message)
        })
    })
    .catch(() => {
      store.setShowLoginDialog(true)
    })
}

const hasRole = (roleKey) => {
  return arrayContains(roles.value, roleKey, (v1, v2) => v1 === v2)
}

const useRole = (role) => {
  router.push(`/chat?role_id=${role.id}`)
}
</script>

<style scoped>
.page-apps {
  min-height: 100vh;
}
</style>
