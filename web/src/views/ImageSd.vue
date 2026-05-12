<template>
  <div>
    <div class="page-sd">
      <div class="inner custom-scroll">
        <div class="sd-box">
          <h2>Stable Diffusion 创作中心</h2>

          <div class="sd-params space-y-4">
            <!-- Sampler -->
            <div class="param-line flex items-center gap-4">
              <label class="w-20 text-sm font-medium text-slate-700 dark:text-slate-300">采样方法</label>
              <div class="form-item-inner flex items-center gap-2">
                <select
                  v-model="params.sampler"
                  class="w-40 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                >
                  <option v-for="item in samplers" :key="item" :value="item">{{ item }}</option>
                </select>
                <span class="info-icon text-slate-400 cursor-help" title="出图效果比较好的一般是 Euler 和 DPM 系列算法">
                  <i class="iconfont icon-tips"></i>
                </span>
              </div>
            </div>

            <!-- Scheduler -->
            <div class="param-line flex items-center gap-4">
              <label class="w-20 text-sm font-medium text-slate-700 dark:text-slate-300">采样调度</label>
              <div class="form-item-inner flex items-center gap-2">
                <select
                  v-model="params.scheduler"
                  class="w-40 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                >
                  <option v-for="item in schedulers" :key="item" :value="item">{{ item }}</option>
                </select>
                <span class="info-icon text-slate-400 cursor-help" title="推荐自动或者 Karras">
                  <i class="iconfont icon-tips"></i>
                </span>
              </div>
            </div>

            <!-- Image Size -->
            <div class="param-line flex items-center gap-4">
              <label class="w-20 text-sm font-medium text-slate-700 dark:text-slate-300">图片尺寸</label>
              <div class="form-item-inner flex items-center gap-4">
                <input
                  v-model.number="params.width"
                  type="number"
                  placeholder="图片宽度"
                  class="w-24 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
                <span class="text-slate-400">x</span>
                <input
                  v-model.number="params.height"
                  type="number"
                  placeholder="图片高度"
                  class="w-24 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            <!-- Steps -->
            <div class="param-line flex items-center gap-4">
              <label class="w-20 text-sm font-medium text-slate-700 dark:text-slate-300">迭代步数</label>
              <div class="form-item-inner flex items-center gap-2">
                <input
                  v-model.number="params.steps"
                  type="number"
                  class="w-24 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
                <span class="info-icon text-slate-400 cursor-help" title="值越大则代表细节越多，同时也意味着出图速度越慢">
                  <i class="iconfont icon-tips"></i>
                </span>
              </div>
            </div>

            <!-- CFG Scale -->
            <div class="param-line flex items-center gap-4">
              <label class="w-20 text-sm font-medium text-slate-700 dark:text-slate-300">引导系数</label>
              <div class="form-item-inner flex items-center gap-2">
                <input
                  v-model.number="params.cfg_scale"
                  type="number"
                  class="w-24 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
                <span class="info-icon text-slate-400 cursor-help" title="提示词引导系数，图像在多大程度上服从提示词<br/> 较低值会产生更有创意的结果">
                  <i class="iconfont icon-tips"></i>
                </span>
              </div>
            </div>

            <!-- Seed -->
            <div class="param-line flex items-center gap-4">
              <label class="w-20 text-sm font-medium text-slate-700 dark:text-slate-300">随机因子</label>
              <div class="form-item-inner flex items-center gap-2">
                <input
                  v-model.number="params.seed"
                  type="number"
                  class="w-32 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
                <span class="info-icon text-slate-400 cursor-help" title="随机数种子，相同的种子会得到相同的结果<br/> 设置为 -1 则每次随机生成种子">
                  <i class="iconfont icon-tips"></i>
                </span>
                <span @click="params.seed = -1" class="info-icon text-orange-500 cursor-pointer" title="使用随机数">
                  <i class="iconfont icon-refresh"></i>
                </span>
              </div>
            </div>

            <!-- HD Fix -->
            <div class="param-line flex items-center gap-4">
              <label class="w-20 text-sm font-medium text-slate-700 dark:text-slate-300">高清修复</label>
              <div class="form-item-inner flex items-center gap-2">
                <button
                  @click="params.hd_fix = !params.hd_fix"
                  :class="params.hd_fix ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-600'"
                  class="relative w-12 h-6 rounded-full transition-colors"
                >
                  <span
                    :class="params.hd_fix ? 'translate-x-6' : 'translate-x-1'"
                    class="absolute top-1 left-0 w-4 h-4 bg-white rounded-full transition-transform"
                  ></span>
                </button>
                <span class="info-icon text-slate-400 cursor-help ml-2" title="先以较小的分辨率生成图像，接着方法图像<br />然后在不更改构图的情况下再修改细节">
                  <i class="iconfont icon-tips"></i>
                </span>
              </div>
            </div>

            <!-- HD Fix Options -->
            <div v-show="params.hd_fix" class="space-y-4 pl-24">
              <!-- Redraw Rate -->
              <div class="param-line flex items-center gap-4">
                <label class="w-20 text-sm font-medium text-slate-700 dark:text-slate-300">重绘幅度</label>
                <div class="form-item-inner flex items-center gap-2">
                  <input
                    v-model.number="params.hd_redraw_rate"
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    class="w-32 accent-teal-500"
                  />
                  <span class="text-sm text-slate-500 dark:text-slate-400">{{ params.hd_redraw_rate }}</span>
                  <span class="info-icon text-slate-400 cursor-help" title="决定算法对图像内容的影响程度<br />较大的值将得到越有创意的图像">
                    <i class="iconfont icon-tips"></i>
                  </span>
                </div>
              </div>

              <!-- Scale Algorithm -->
              <div class="param-line flex items-center gap-4">
                <label class="w-20 text-sm font-medium text-slate-700 dark:text-slate-300">放大算法</label>
                <div class="form-item-inner flex items-center gap-2">
                  <select
                    v-model="params.hd_scale_alg"
                    class="w-40 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  >
                    <option v-for="item in scaleAlg" :key="item" :value="item">{{ item }}</option>
                  </select>
                  <span class="info-icon text-slate-400 cursor-help" title="高清修复放大算法，主流算法有Latent和ESRGAN_4x">
                    <i class="iconfont icon-tips"></i>
                  </span>
                </div>
              </div>

              <!-- Scale -->
              <div class="param-line flex items-center gap-4">
                <label class="w-20 text-sm font-medium text-slate-700 dark:text-slate-300">放大倍数</label>
                <div class="form-item-inner flex items-center gap-2">
                  <input
                    v-model.number="params.hd_scale"
                    type="number"
                    class="w-24 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                  <span class="info-icon text-slate-400 cursor-help" title="随机数种子，相同的种子会得到相同的结果<br/> 设置为 -1 则每次随机生成种子">
                    <i class="iconfont icon-tips"></i>
                  </span>
                </div>
              </div>

              <!-- HD Steps -->
              <div class="param-line flex items-center gap-4">
                <label class="w-20 text-sm font-medium text-slate-700 dark:text-slate-300">迭代步数</label>
                <div class="form-item-inner flex items-center gap-2">
                  <input
                    v-model.number="params.hd_steps"
                    type="number"
                    class="w-24 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                  <span class="info-icon text-slate-400 cursor-help" title="重绘迭代步数，如果设置为0，则设置跟原图相同的迭代步数">
                    <i class="iconfont icon-tips"></i>
                  </span>
                </div>
              </div>
            </div>

            <!-- Prompt -->
            <div class="param-line pt">
              <textarea
                ref="promptRef"
                v-model="params.prompt"
                rows="4"
                maxlength="1024"
                placeholder="请在此输入绘画提示词，您也可以点击下面的提示词助手生成绘画提示词"
                class="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 resize-none"
              ></textarea>
              <div class="text-xs text-slate-500 dark:text-slate-400 text-right mt-1">{{ params.prompt.length }}/1024</div>
            </div>

            <div class="flex justify-end pt-2 pr-2">
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

            <!-- Negative Prompt -->
            <div class="param-line flex items-center gap-2">
              <span class="text-sm font-medium text-slate-700 dark:text-slate-300">反向提示词：</span>
              <span class="info-icon text-slate-400 cursor-help" title="不希望出现的元素，下面给了默认的起手式">
                <i class="iconfont icon-tips"></i>
              </span>
            </div>
            <div class="param-line">
              <textarea
                v-model="params.neg_prompt"
                rows="4"
                placeholder="反向提示词"
                class="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 resize-none"
              ></textarea>
            </div>

            <!-- Info -->
            <div class="text-info text-sm">
              <span class="text-violet-600">单次绘图消耗 <span class="text-amber-500">{{ sdPower }}算力，</span></span>
              <span class="text-violet-600">当前可用 <span class="text-amber-500">{{ power }}算力</span></span>
            </div>
          </div>
          <div class="py-4">
            <button
              class="w-full py-3 bg-gradient-to-r from-violet-500 to-violet-700 text-white rounded-xl disabled:from-slate-400 disabled:to-slate-400 disabled:cursor-not-allowed hover:from-violet-600 hover:to-violet-800 transition-all duration-200 flex items-center justify-center space-x-2 text-base"
              @click="generate"
              type="button"
            >
              <i v-if="isGenerating" class="iconfont icon-loading animate-spin"></i>
              <i v-else class="iconfont icon-chuangzuo"></i>
              <span>{{ isGenerating ? '创作中...' : '立即生成' }}</span>
            </button>
          </div>
        </div>
        <div class="task-list-box pl-6 pr-6 pb-4 pt-4 h-dvh">
          <div class="task-list-inner" :style="{ height: listBoxHeight + 'px' }">
            <div class="job-list-box">
              <h2 class="text-xl">任务列表</h2>
              <task-list :list="runningJobs" />
              <template v-if="finishedJobs.length > 0">
                <h2 class="text-xl">创作记录</h2>
                <div class="finish-job-list mt-3">
                  <div v-if="finishedJobs.length > 0">
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
                        <div
                          class="bg-slate-900 dark:bg-slate-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-linear hover:shadow-md hover:shadow-violet-800 group"
                        >
                          <div class="overflow-hidden rounded-lg">
                            <LazyImg
                              :url="url"
                              v-if="item.progress === 100"
                              class="cursor-pointer transition-all duration-300 ease-linear group-hover:scale-105"
                              @click="showTask(item)"
                            />
                            <div v-else-if="item.progress === 101" class="image-slot p-4 bg-slate-800">
                              <div class="err-msg-container">
                                <div class="title text-red-400 dark:text-red-500 font-medium mb-2">任务失败</div>
                                <div class="opt flex gap-2">
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
                          <div
                            class="px-4 pt-2 pb-4 border-t border-t-slate-800 dark:border-t-slate-700"
                            v-if="item.progress === 100"
                          >
                            <div
                              class="pt-3 flex justify-center items-center border-t border-t-slate-600 dark:border-t-slate-500 border-opacity-50"
                            >
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

                    <div class="flex justify-center py-10">
                      <img
                        :src="waterfallOptions.loadProps.loading"
                        class="max-w-[50px] max-h-[50px]"
                        v-if="loading"
                      />
                      <div v-else>
                        <button
                          class="px-5 py-2 rounded-full bg-violet-700 text-md text-white cursor-pointer hover:bg-violet-800 transition-all duration-300"
                          @click="fetchFinishJobs"
                          v-if="!isOver"
                        >
                          加载更多
                        </button>
                        <div class="no-more-data" v-else>
                          <span class="text-slate-500 dark:text-slate-400 mr-2">没有更多数据了</span>
                          <i class="iconfont icon-face"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else class="text-center py-12">
                    <img :src="nodata" class="w-24 h-24 mx-auto mb-4 opacity-50" />
                    <p class="text-slate-400">暂无记录</p>
                  </div>
                </div>
              </template>

              <!-- end finish job list-->
            </div>
          </div>
          <back-top :right="30" :bottom="30" />
        </div>
        <!-- end task list box -->
      </div>

      <!-- 任务详情弹框 -->
      <sd-task-view
        v-model="showTaskDialog"
        :data="item"
        @drawSame="copyParams"
        @close="showTaskDialog = false"
      />

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
  </div>
</template>

<script setup>
import nodata from '@/assets/img/no-data.png'
import { onMounted, onUnmounted, ref } from 'vue'

import BackTop from '@/components/BackTop.vue'
import SdTaskView from '@/components/SdTaskView.vue'
import TaskList from '@/components/TaskList.vue'
import { checkSession, getSystemInfo } from '@/store/cache'
import { getSessionId } from '@/store/session'
import { useSharedStore } from '@/store/sharedata'
import { showMessageError, showMessageSuccess, showMessageInfo, showConfirmDialog } from '@/utils/dialog'
import { httpGet, httpPost } from '@/utils/http'
import Clipboard from 'clipboard'
import { useRouter } from 'vue-router'
import { LazyImg, Waterfall } from 'vue-waterfall-plugin-next'
import 'vue-waterfall-plugin-next/dist/style.css'

const listBoxHeight = ref(0)
const showTaskDialog = ref(false)
const item = ref({})
const isLogin = ref(false)
const loading = ref(true)
const showError = ref(false)
const errorDetail = ref('')
const store = useSharedStore()
const waterfallOptions = store.waterfallOptions

const resizeElement = function () {
  listBoxHeight.value = window.innerHeight - 80
  // paramBoxHeight.value = window.innerHeight - 200
}
resizeElement()
window.onresize = () => {
  resizeElement()
}
const samplers = [
  'Euler a',
  'DPM++ 2S a',
  'DPM++ 2M',
  'DPM++ SDE',
  'DPM++ 2M SDE',
  'UniPC',
  'Restart',
]
const schedulers = ['Automatic', 'Karras', 'Exponential', 'Uniform']
const scaleAlg = ['Latent', 'ESRGAN_4x', 'R-ESRGAN 4x+', 'SwinIR_4x', 'LDSR']
const params = ref({
  width: 1024,
  height: 1024,
  sampler: samplers[0],
  scheduler: schedulers[0],
  seed: -1,
  steps: 20,
  cfg_scale: 7,
  hd_fix: false,
  hd_redraw_rate: 0.7,
  hd_scale: 2,
  hd_scale_alg: scaleAlg[0],
  hd_steps: 0,
  prompt: '',
  neg_prompt:
    'nsfw, paintings,low quality,easynegative,ng_deepnegative ,lowres,bad anatomy,bad hands,bad feet',
})

const runningJobs = ref([])
const finishedJobs = ref([])
const allowPulling = ref(true) // 是否允许轮询
const tastPullHandler = ref(null)
const router = useRouter()
// 检查是否有画同款的参数
const _params = router.currentRoute.value.params['copyParams']
if (_params) {
  params.value = JSON.parse(_params)
}
const power = ref(0)
const sdPower = ref(0) // 画一张 SD 图片消耗算力

const userId = ref(0)
const clipboard = ref(null)
onMounted(() => {
  initData()
  clipboard.value = new Clipboard('.copy-prompt-sd')
  clipboard.value.on('success', () => {
    showMessageSuccess('复制成功！')
  })

  clipboard.value.on('error', () => {
    showMessageError('复制失败！')
  })

  getSystemInfo()
    .then((res) => {
      sdPower.value = res.data.sd_power
      params.value.neg_prompt = res.data.sd_neg_prompt
    })
    .catch((e) => {
      showMessageError('获取系统配置失败：' + e.message)
    })
})

onUnmounted(() => {
  clipboard.value.destroy()
  if (tastPullHandler.value) {
    clearInterval(tastPullHandler.value)
  }
})

const initData = () => {
  checkSession()
    .then((user) => {
      power.value = user['power']
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
    })
    .catch(() => {})
}

const fetchRunningJobs = () => {
  if (!isLogin.value) {
    return
  }

  // 获取运行中的任务
  httpGet(`/api/sd/jobs?finish=0`)
    .then((res) => {
      if (runningJobs.value.length !== res.data.items.length) {
        page.value = 0
        fetchFinishJobs()
      }
      if (runningJobs.value.length === 0) {
        allowPulling.value = false
      }
      runningJobs.value = res.data.items
    })
    .catch((e) => {
      showMessageError('获取任务失败：' + e.message)
    })
}

const page = ref(0)
const pageSize = ref(20)
const isOver = ref(false)
// 获取已完成的任务
const fetchFinishJobs = () => {
  if (!isLogin.value || isOver.value === true) {
    return
  }
  loading.value = true
  page.value = page.value + 1

  httpGet(`/api/sd/jobs?finish=1&page=${page.value}&page_size=${pageSize.value}`)
    .then((res) => {
      if (res.data.items.length < pageSize.value) {
        isOver.value = true
        loading.value = false
      }
      const imageList = res.data.items
      for (let i = 0; i < imageList.length; i++) {
        imageList[i]['img_thumb'] = imageList[i]['img_url'] + '?imageView2/4/w/300/h/0/q/75'
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

// 创建绘图任务
const promptRef = ref(null)
const isGenerating = ref(false)
const generate = () => {
  if (isGenerating.value) {
    return
  }

  if (params.value.prompt === '') {
    promptRef.value.focus()
    return showMessageError('请输入绘画提示词！')
  }

  if (!isLogin.value) {
    store.setShowLoginDialog(true)
    return
  }

  if (!params.value.seed) {
    params.value.seed = -1
  }
  params.value.session_id = getSessionId()
  isGenerating.value = true
  httpPost('/api/sd/image', params.value)
    .then(() => {
      showMessageSuccess('绘画任务推送成功，请耐心等待任务执行...')
      power.value -= sdPower.value
      allowPulling.value = true
      runningJobs.value.push({
        progress: 0,
      })
      isOver.value = false
    })
    .catch((e) => {
      showMessageError('任务推送失败：' + e.message)
    })
    .finally(() => {
      isGenerating.value = false
    })
}

const showTask = (row) => {
  item.value = row
  showTaskDialog.value = true
}

const copyParams = (row) => {
  params.value = row.params
  showTaskDialog.value = false
}

const showErrorDetail = (item) => {
  errorDetail.value = item['err_msg'] || '未知错误'
  showError.value = true
}

const copyPrompt = (item) => {
  navigator.clipboard.writeText(item.prompt)
  showMessageSuccess('复制成功！')
}

const removeImage = (item) => {
  showConfirmDialog('此操作将会删除任务和图片，继续操作码?', '删除提示')
    .then(() => {
      httpGet('/api/sd/remove', { id: item.id })
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

// 发布图片到作品墙
const publishImage = (item, action) => {
  let text = '图片发布'
  if (action === false) {
    text = '取消发布'
  }
  httpGet('/api/sd/publish', { id: item.id, action: action })
    .then(() => {
      showMessageSuccess(text + '成功')
      item.publish = action
      page.value = 0
      isOver.value = false
      item.publish = action
    })
    .catch((e) => {
      showMessageError(text + '失败：' + e.message)
    })
}

const promptGenerating = ref(false)
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
</script>

<style lang="scss">
@use '../assets/css/image-sd.scss' as *;
@use '../assets/css/custom-scroll.scss' as *;
</style>
