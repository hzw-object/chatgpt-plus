<template>
  <div class="power-log custom-scroll p-4">
    <div class="inner">
      <div class="list-box bg-slate-800/50 rounded-xl p-5">
        <div class="handle-box flex flex-wrap gap-3 mb-4">
          <input
            v-model="query.model"
            placeholder="模型"
            class="px-3 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:border-violet-500 outline-none"
          />
          <input
            v-model="query.startDate"
            type="date"
            class="px-3 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:border-violet-500 outline-none"
          />
          <input
            v-model="query.endDate"
            type="date"
            class="px-3 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:border-violet-500 outline-none"
          />
          <button
            @click="fetchData"
            class="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg flex items-center gap-2"
          >
            <i class="iconfont icon-search"></i> 搜索
          </button>
        </div>

        <div v-if="items.length > 0">
          <div class="overflow-x-auto">
            <table class="w-full text-sm text-left">
              <thead>
                <tr class="text-slate-400 border-b border-slate-700">
                  <th class="px-4 py-3">用户</th>
                  <th class="px-4 py-3">模型</th>
                  <th class="px-4 py-3">类型</th>
                  <th class="px-4 py-3">数额</th>
                  <th class="px-4 py-3">余额</th>
                  <th class="px-4 py-3">发生时间</th>
                  <th class="px-4 py-3">备注</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in items"
                  :key="item.id"
                  class="border-b border-slate-700/50 hover:bg-slate-700/30"
                >
                  <td class="px-4 py-3 text-slate-200">{{ item.username }}</td>
                  <td class="px-4 py-3 text-slate-200">{{ item.model }}</td>
                  <td class="px-4 py-3">
                    <span
                      class="px-2 py-0.5 rounded text-xs"
                      :class="tagClass(item.type)"
                    >
                      {{ item.type_str }}
                    </span>
                  </td>
                  <td class="px-4 py-3">
                    <span v-if="item.mark === 1" class="text-green-400 dark:text-green-500">+{{ item.amount }}</span>
                    <span v-else class="text-red-400 dark:text-red-500">-{{ item.amount }}</span>
                  </td>
                  <td class="px-4 py-3 text-slate-200">{{ item.balance }}</td>
                  <td class="px-4 py-3 text-slate-400">{{ dateFormat(item.created_at) }}</td>
                  <td class="px-4 py-3 text-slate-400">{{ item.remark }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="pagination flex justify-center mt-5">
            <div class="flex gap-2">
              <button
                v-for="p in totalPages"
                :key="p"
                @click="page = p; fetchData()"
                :class="page === p ? 'bg-violet-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'"
                class="px-3 py-1.5 rounded-lg"
              >
                {{ p }}
              </button>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-12 text-slate-400">
          <i class="iconfont icon-empty text-5xl mb-3"></i>
          <p>暂无数据</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { checkSession } from '@/store/cache'
import { httpPost } from '@/utils/http'
import { dateFormat } from '@/utils/libs'
import { showMessageInfo } from '@/utils/dialog'
import { onMounted, ref, computed } from 'vue'

const items = ref([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(20)
const loading = ref(false)
const query = ref({
  model: '',
  startDate: '',
  endDate: '',
})
const tagColors = ['bg-violet-500/20 text-violet-400', 'bg-green-500/20 text-green-400', 'bg-violet-500/20 text-violet-400', 'bg-red-500/20 text-red-400', 'bg-slate-500/20 text-slate-400', 'bg-yellow-500/20 text-yellow-400']

const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

const tagClass = (type) => tagColors[type] || tagColors[0]

onMounted(() => {
  checkSession()
    .then(() => {
      fetchData()
    })
    .catch(() => {})
})

// 获取数据
const fetchData = () => {
  loading.value = true
  httpPost('/api/powerLog/list', {
    model: query.value.model,
    date: query.value.startDate && query.value.endDate ? [query.value.startDate, query.value.endDate] : [],
    page: page.value,
    page_size: pageSize.value,
  })
    .then((res) => {
      if (res.data) {
        items.value = res.data.items
        total.value = res.data.total
        page.value = res.data.page
        pageSize.value = res.data.page_size
      }
      loading.value = false
    })
    .catch((e) => {
      loading.value = false
      showMessageInfo('获取数据失败：' + e.message)
    })
}
</script>

<style lang="scss" scoped>
.power-log {
  .inner {
    .list-box {
      .handle-box {
        input[type="date"] {
          max-width: 150px;
        }
      }
    }
  }
}
</style>
