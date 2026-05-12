<template>
  <div class="page-dall p-4">
    <div class="inner flex gap-6">
      <!-- Left Panel - Parameters -->
      <div class="sd-box w-80 flex-shrink-0">
        <h2 class="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">DALL-E 创作中心</h2>

        <div class="space-y-4">
          <!-- Model Selection -->
          <div class="flex items-center gap-3">
            <label class="text-sm font-medium text-slate-700 dark:text-slate-300 w-20">生图模型</label>
            <select
              v-model="selectedModel"
              @change="changeModel"
              class="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            >
              <option v-for="v in models" :key="v.value" :value="v">{{ v.name }}</option>
            </select>
          </div>

          <!-- Quality -->
          <div class="flex items-center gap-3">
            <label class="text-sm font-medium text-slate-700 dark:text-slate-300 w-20">图片质量</label>
            <select
              v-model="params.quality"
              class="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            >
              <option v-for="v in qualities" :key="v.value" :value="v.value">{{ v.name }}</option>
            </select>
          </div>

          <!-- Size -->
          <div class="flex items-center gap-3">
            <label class="text-sm font-medium text-slate-700 dark:text-slate-300 w-20">图片尺寸</label>
            <select
              v-model="params.size"
              class="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            >
              <option v-for="v in sizes" :key="v" :value="v">{{ v }}</option>
            </select>
          </div>

          <!-- Style -->
          <div class="flex items-center gap-3">
            <label class="text-sm font-medium text-slate-700 dark:text-slate-300 w-20">图片样式</label>
            <select
              v-model="params.style"
              class="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            >
              <option v-for="v in styles" :key="v.value" :value="v.value">{{ v.name }}</option>
            </select>
            <span class="text-slate-400 cursor-help" title="生动使模型倾向于生成超真实和戏剧性的图像">
              <i class="iconfont icon-tips"></i>
            </span>
          </div>

          <!-- Prompt -->
          <div>
            <textarea
              v-model="params.prompt"
              :rows="6"
              :maxlength="1024"
              placeholder="请在此输入绘画提示词，您也可以点击下面的提示词助手生成绘画提示词"
              class="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 resize-none"
            />
            <div class="text-xs text-slate-500 text-right mt-1">{{ params.prompt.length }}/1024</div>
          </div>

          <!-- Generate Prompt Button -->
          <div class="flex justify-end">
            <button
              @click="generatePrompt"
              :disabled="promptGenerating"
              class="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg flex items-center gap-2 disabled:bg-slate-400"
            >
              <i v-if="promptGenerating" class="iconfont icon-loading animate-spin"></i>
              <i v-else class="iconfont icon-chuangzuo"></i>
              <span>{{ promptGenerating ? '生成中...' : '生成专业绘画指令' }}</span>
            </button>
          </div>

          <!-- Reference Image -->
          <div>
            <label class="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-2">参考图(可选)</label>
            <ImageUpload v-model="params.image" :max-count="5" :multiple="true" />
          </div>

          <!-- Generate Button -->
          <button
            @click="generate"
            :disabled="isGenerating"
            class="w-full py-3 bg-gradient-to-r from-violet-500 to-violet-700 text-white rounded-xl disabled:from-slate-400 disabled:to-slate-400 disabled:cursor-not-allowed hover:from-violet-600 hover:to-violet-800 transition-all flex items-center justify-center gap-2"
          >
            <i v-if="isGenerating" class="iconfont icon-loading animate-spin"></i>
            <i v-else class="iconfont icon-chuangzuo"></i>
            <span>{{ isGenerating ? '创作中...' : '立即生成(' + dallPower + '算力)' }}</span>
          </button>
        </div>
      </div>

      <!-- Right Panel - Task List -->
      <div class="task-list-box flex-1 overflow-y-auto">
        <div class="task-list-inner space-y-4">
          <h2 class="text-xl font-bold text-slate-900 dark:text-slate-100">任务列表</h2>
          <task-list :list="runningJobs" />

          <template v-if="finishedJobs.length > 0">
            <h2 class="text-xl font-bold text-slate-900 dark:text-slate-100">创作记录</h2>
            <div class="finish-job-list mt-3">
              <Waterfall
                :list="finishedJobs"
                :row-key="waterfallOptions.rowKey"
                :gutter="waterfallOptions.gutter"
                :has-around-gutter="waterfallOptions.hasAroundGutter"
                :width="waterfallOptions.width"
                :breakpoints="waterfallOptions.breakpoints"
                :img-selector="waterfallOptions.imgSelector"
                :background-color="waterfallOptions.backgroundColor"
                :animation-effect="waterfallOptions.animationEffect"
                :animation-duration="waterfallOptions.animationDuration"
                :animation-delay="waterfallOptions.animationDelay"
                :animation-cancel="waterfallOptions.animationCancel"
                :lazyload="waterfallOptions.lazyload"
                :load-props="waterfallOptions.loadProps"
                :cross-origin="waterfallOptions.crossOrigin"
                :align="waterfallOptions.align"
                :is-loading="loading"
                :is-over="isOver"
                @afterRender="loading = false"
              >
                <template #default="{ item, url }">
                  <div class="bg-slate-900 dark:bg-slate-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-linear hover:shadow-violet-800 group">
                    <div class="overflow-hidden rounded-lg">
                      <LazyImg
                        v-if="item.progress === 100"
                        :url="url"
                        class="cursor-pointer transition-all duration-300 ease-linear group-hover:scale-105"
                        @click="previewImg(item)"
                      />
                      <div v-else-if="item.progress === 101" class="image-slot p-4 bg-slate-800">
                        <div class="err-msg-container">
                          <div class="title text-red-400 dark:text-red-500 font-medium mb-2">任务失败</div>
                          <div class="flex gap-2">
                            <button
                              @click="showErrorDetail(item)"
                              class="px-3 py-1 bg-slate-600 hover:bg-slate-500 text-white rounded text-sm"
                            >
                              详情
                            </button>
                            <button
                              @click="removeImage(item)"
                              class="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-sm"
                            >
                              删除
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-if="item.progress === 100" class="px-4 pt-2 pb-4 border-t border-t-slate-800 dark:border-t-slate-700">
                      <div class="pt-3 flex justify-center items-center border-t border-t-slate-600 dark:border-t-slate-500 border-opacity-50">
                        <div class="flex gap-2">
                          <button
                            v-if="item.publish"
                            @click="publishImage(item, false)"
                            class="w-8 h-8 rounded-full bg-amber-500 hover:bg-amber-600 flex items-center justify-center text-white"
                            title="取消分享"
                          >
                            <i class="iconfont icon-cancel-share"></i>
                          </button>
                          <button
                            v-else
                            @click="publishImage(item, true)"
                            class="w-8 h-8 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center text-white"
                            title="分享"
                          >
                            <i class="iconfont icon-share-bold"></i>
                          </button>
                          <button
                            @click="copyPrompt(item)"
                            class="w-8 h-8 rounded-full bg-slate-600 hover:bg-slate-500 flex items-center justify-center text-white copy-prompt"
                            :data-clipboard-text="item.prompt"
                            title="复制提示词"
                          >
                            <i class="iconfont icon-file"></i>
                          </button>
                          <button
                            @click="removeImage(item)"
                            class="w-8 h-8 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center text-white"
                            title="删除"
                          >
                            <i class="iconfont icon-remove"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </Waterfall>

              <div class="flex flex-col items-center justify-center py-10">
                <img
                  v-if="loading"
                  :src="waterfallOptions.loadProps.loading"
                  class="max-w-[50px] max-h-[50px]"
                />
                <button
                  v-else-if="!isOver"
                  @click="fetchFinishJobs"
                  class="px-5 py-2 rounded-full bg-violet-600 hover:bg-violet-700 text-white transition-all"
                >
                  加载更多
                </button>
                <div v-else class="text-slate-500 flex items-center gap-2">
                  <span>没有更多数据了</span>
                  <i class="iconfont icon-face"></i>
                </div>
              </div>
            </div>
          </template>

          <div v-if="finishedJobs.length === 0 && !loading" class="text-center py-16 text-slate-400">
            <i class="iconfont icon-empty text-6xl mb-4"></i>
            <p>暂无记录</p>
          </div>
        </div>
        <back-top :right="30" :bottom="30" />
      </div>
    </div>

    <!-- Image Preview -->
    <teleport to="body">
      <div v-if="previewURL" class="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" @click="previewURL = ''">
        <img :src="previewURL" class="max-w-[90vw] max-h-[90vh] object-contain" />
        <button class="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white" @click="previewURL = ''">
          <i class="iconfont icon-close"></i>
        </button>
      </div>
    </teleport>

    <!-- Error Detail Dialog -->
    <teleport to="body">
      <div v-if="showError" class="fixed inset-0 bg-black/50 z-40 flex items-center justify-center" @click.self="showError = false">
        <div class="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100">错误详情</h3>
            <button @click="showError = false" class="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
              <i class="iconfont icon-close"></i>
            </button>
          </div>
          <p class="text-slate-600 dark:text-slate-400">{{ errorDetail }}</p>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import BackTop from '@/components/BackTop.vue'
import TaskList from '@/components/TaskList.vue'
import ImageUpload from '@/components/ImageUpload.vue'
import { checkSession, getSystemInfo } from '@/store/cache'
import { useSharedStore } from '@/store/sharedata'
import { showMessageError, showMessageSuccess, showConfirmDialog } from '@/utils/dialog'
import { httpGet, httpPost } from '@/utils/http'
import Clipboard from 'clipboard'
import { onMounted, onUnmounted, ref } from 'vue'
import { LazyImg, Waterfall } from 'vue-waterfall-plugin-next'
import 'vue-waterfall-plugin-next/dist/style.css'

const listBoxHeight = ref(0)
const isLogin = ref(false)
const loading = ref(true)
const isOver = ref(false)
const previewURL = ref('')
const store = useSharedStore()
const models = ref([])
const waterfallOptions = store.waterfallOptions
const qualities = [
  { name: '标准', value: 'standard' },
  { name: '高清', value: 'hd' },
]
const dalleSizes = ['1024x1024', '1792x1024', '1024x1792']
const fluxSizes = ['1024x1024', '1152x896', '896x1152', '1280x960', '1024x576']
const sizes = ref(dalleSizes)
const styles = [
  { name: '生动', value: 'vivid' },
  { name: '自然', value: 'natural' },
]
const params = ref({
  quality: 'standard',
  size: '1024x1024',
  style: 'vivid',
  prompt: '',
})

const finishedJobs = ref([])
const runningJobs = ref([])
const allowPulling = ref(true)
const downloadPulling = ref(false)
const tastPullHandler = ref(null)
const downloadPullHandler = ref(null)
const userPower = ref(0)
const dallPower = ref(0)
const clipboard = ref(null)
const userId = ref(0)
const selectedModel = ref(null)

const showError = ref(false)
const errorDetail = ref('')

const page = ref(1)
const pageSize = ref(15)

const fetchRunningJobs = () => {
  if (!isLogin.value) return
  httpGet(`/api/dall/jobs?finish=false`)
    .then((res) => {
      if (res.data.items && res.data.items.length !== runningJobs.value.length) {
        page.value = 0
        fetchFinishJobs()
      }
      if (res.data.items.length > 0) {
        runningJobs.value = res.data.items
      } else {
        allowPulling.value = false
        runningJobs.value = []
      }
    })
    .catch((e) => {
      showMessageError('获取任务失败：' + e.message)
    })
}

const fetchFinishJobs = () => {
  if (!isLogin.value) return

  loading.value = true
  page.value = page.value + 1

  httpGet(`/api/dall/jobs?finish=true&page=${page.value}&page_size=${pageSize.value}`)
    .then((res) => {
      if (res.data.items.length < pageSize.value) {
        isOver.value = true
        loading.value = false
      }
      const imageList = res.data.items
      let needPulling = false
      for (let i = 0; i < imageList.length; i++) {
        if (imageList[i]['img_url']) {
          imageList[i]['img_thumb'] = imageList[i]['img_url'] + '?imageView2/4/w/300/h/0/q/75'
        } else if (imageList[i].progress === 100) {
          needPulling = true
          imageList[i]['img_thumb'] = waterfallOptions.loadProps.loading
        }
      }
      if (page.value === 1) {
        downloadPulling.value = needPulling
      }

      if (page.value === 1) {
        finishedJobs.value = imageList
      } else {
        finishedJobs.value = finishedJobs.value.concat(imageList)
      }
    })
    .catch((e) => {
      showMessageError('获取任务失败：' + e.message)
      loading.value = false
    })
}

const initData = () => {
  checkSession()
    .then((user) => {
      userPower.value = user['power']
      userId.value = user.id
      isLogin.value = true
      page.value = 0
      fetchRunningJobs()
      fetchFinishJobs()

      tastPullHandler.value = setInterval(() => {
        if (allowPulling.value) {
          fetchRunningJobs()
        }
      }, 5000)

      downloadPullHandler.value = setInterval(() => {
        if (downloadPulling.value) {
          page.value = 0
          fetchFinishJobs()
        }
      }, 5000)
    })
    .catch(() => {})
}

const promptRef = ref(null)
const isGenerating = ref(false)
const promptGenerating = ref(false)

const generate = () => {
  if (isGenerating.value) return
  if (params.value.prompt === '') {
    promptRef.value?.focus()
    return showMessageError('请输入绘画提示词！')
  }

  if (!isLogin.value) {
    store.setShowLoginDialog(true)
    return
  }
  isGenerating.value = true
  httpPost('/api/dall/image', params.value)
    .then(() => {
      showMessageSuccess('任务执行成功！')
      userPower.value -= dallPower.value
      runningJobs.value.push({ prompt: params.value.prompt, progress: 0 })
      allowPulling.value = true
      isOver.value = false
    })
    .catch((e) => {
      showMessageError('任务执行失败：' + e.message)
    })
    .finally(() => {
      isGenerating.value = false
    })
}

const removeImage = (item) => {
  showConfirmDialog('此操作将会删除任务和图片，继续操作码?', '删除提示')
    .then(() => {
      httpGet('/api/dall/remove', { id: item.id })
        .then(() => {
          showMessageSuccess('任务删除成功')
          page.value = 0
          isOver.value = false
          fetchFinishJobs()
        })
        .catch((e) => {
          showMessageError('任务删除失败：' + e.message)
        })
    })
    .catch(() => {})
}

const previewImg = (item) => {
  previewURL.value = item.img_url
}

const showErrorDetail = (item) => {
  errorDetail.value = item['err_msg'] || '未知错误'
  showError.value = true
}

const publishImage = (item, action) => {
  const text = action === false ? '取消发布' : '图片发布'
  httpGet('/api/dall/publish', { id: item.id, action: action })
    .then(() => {
      showMessageSuccess(text + '成功')
      item.publish = action
      page.value = 0
      isOver.value = false
    })
    .catch((e) => {
      showMessageError(text + '失败：' + e.message)
    })
}

const copyPrompt = (item) => {
  navigator.clipboard.writeText(item.prompt)
  showMessageSuccess('复制成功！')
}

const generatePrompt = () => {
  if (params.value.prompt === '') {
    return showMessageError('请输入原始提示词')
  }
  promptGenerating.value = true
  httpPost('/api/prompt/image', { prompt: params.value.prompt })
    .then((res) => {
      params.value.prompt = res.data
      promptGenerating.value = false
    })
    .catch((e) => {
      showMessageError('生成提示词失败：' + e.message)
      promptGenerating.value = false
    })
}

const changeModel = (model) => {
  dallPower.value = model.power
  if (model.name.startsWith('dall')) {
    sizes.value = dalleSizes
  } else {
    sizes.value = fluxSizes
  }
  params.value.model_id = selectedModel.value.id
}

onMounted(() => {
  initData()

  clipboard.value = new Clipboard('.copy-prompt')
  clipboard.value.on('success', () => {
    showMessageSuccess('复制成功！')
  })
  clipboard.value.on('error', () => {
    showMessageError('复制失败！')
  })

  httpGet('/api/dall/models')
    .then((res) => {
      models.value = res.data
      selectedModel.value = models.value[0]
      params.value.model_id = selectedModel.value.id
      changeModel(selectedModel.value)
    })
    .catch((e) => {
      showMessageError('获取模型列表失败：' + e.message)
    })

  const resizeElement = () => {
    listBoxHeight.value = window.innerHeight - 58
  }
  resizeElement()
  window.onresize = resizeElement
})

onUnmounted(() => {
  clipboard.value?.destroy()
  if (tastPullHandler.value) clearInterval(tastPullHandler.value)
  if (downloadPullHandler.value) clearInterval(downloadPullHandler.value)
})
</script>

<style scoped>
.page-dall {
  min-height: 100vh;
}
</style>