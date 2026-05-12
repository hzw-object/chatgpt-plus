<template>
  <div class="page-jimeng flex h-[calc(100vh-60px)]">
    <!-- Left Panel - Settings -->
    <div class="params-panel w-80 flex-shrink-0 overflow-y-auto p-4 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700">
      <!-- Category Buttons -->
      <div class="category-buttons mb-6">
        <div class="category-grid grid grid-cols-2 gap-3">
          <div
            v-for="category in store.categories"
            :key="category.key"
            :class="[
              'category-btn p-4 rounded-xl text-center cursor-pointer transition-all',
              store.activeCategory === category.key
                ? 'bg-violet-600 text-white'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            ]"
            @click="store.switchCategory(category.key)"
          >
            <i :class="getCategoryIcon(category.key) + ' text-2xl mb-2 block'"></i>
            <div class="category-name text-sm">{{ category.name }}</div>
          </div>
        </div>
      </div>

      <!-- Function Switch -->
      <div v-if="store.activeCategory === 'image_generation' || store.activeCategory === 'video_generation'" class="mb-6">
        <div class="flex items-center gap-2 mb-3 text-slate-700 dark:text-slate-300">
          <i class="iconfont icon-switch"></i>
          <span>生成模式</span>
        </div>
        <div class="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
          <div class="flex items-center justify-between">
            <div class="text-sm text-slate-600 dark:text-slate-400">
              {{ store.activeCategory === 'image_generation' ? '图生图人像写真' : '图生视频' }}
            </div>
            <button
              @click="store.useImageInput = !store.useImageInput; store.switchInputMode()"
              :class="store.useImageInput ? 'bg-violet-600' : 'bg-slate-300'"
              class="relative w-12 h-6 rounded-full transition-colors"
            >
              <span
                :class="store.useImageInput ? 'translate-x-6' : 'translate-x-1'"
                class="absolute top-1 w-4 h-4 bg-white rounded-full transition-transform"
              ></span>
            </button>
          </div>
        </div>
      </div>

      <!-- Parameters Container -->
      <div class="params-container space-y-4">
        <!-- Text to Image -->
        <div v-if="store.activeFunction === 'text_to_image'" class="function-panel bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
          <div class="param-line mb-3">
            <span class="label text-slate-700 dark:text-slate-300 font-medium">提示词：</span>
          </div>
          <div class="param-line mb-4">
            <textarea
              v-model="store.currentPrompt"
              :rows="4"
              :maxlength="2000"
              placeholder="请输入图片描述，越详细越好"
              class="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 resize-none"
            />
            <div class="text-xs text-slate-500 text-right mt-1">{{ store.currentPrompt.length }}/2000</div>
          </div>

          <div class="param-line mb-3">
            <span class="label text-slate-700 dark:text-slate-300 font-medium">图片尺寸：</span>
          </div>
          <div class="param-line mb-4">
            <select
              v-model="store.textToImageParams.size"
              class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
            >
              <option v-for="opt in imageSizeOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
            </select>
          </div>

          <div class="param-line mb-3 flex items-center gap-2">
            <span class="label text-slate-700 dark:text-slate-300 font-medium">创意度</span>
            <span class="text-slate-400 cursor-help" title="创意度越高，影响文本描述的程度越高">
              <i class="iconfont icon-tips"></i>
            </span>
          </div>
          <div class="item-group mb-4">
            <input
              type="range"
              v-model="store.textToImageParams.scale"
              min="1"
              max="10"
              step="0.5"
              class="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
            <div class="text-center text-sm text-slate-500">{{ store.textToImageParams.scale }}</div>
          </div>

          <div class="item-group flex justify-between items-center mb-2">
            <span class="label text-slate-700 dark:text-slate-300 font-medium">智能优化提示词</span>
            <button
              @click="store.textToImageParams.use_pre_llm = !store.textToImageParams.use_pre_llm"
              :class="store.textToImageParams.use_pre_llm ? 'bg-violet-600' : 'bg-slate-300'"
              class="relative w-12 h-6 rounded-full transition-colors"
            >
              <span
                :class="store.textToImageParams.use_pre_llm ? 'translate-x-6' : 'translate-x-1'"
                class="absolute top-1 w-4 h-4 bg-white rounded-full transition-transform"
              ></span>
            </button>
          </div>
        </div>

        <!-- Image to Image -->
        <div v-if="store.activeFunction === 'image_to_image'" class="function-panel bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm space-y-4">
          <div class="param-line">
            <span class="label text-slate-700 dark:text-slate-300 font-medium">上传图片：</span>
          </div>
          <div class="param-line">
            <ImageUpload v-model="store.imageToImageParams.image_input" :max-count="1" :multiple="false" />
          </div>

          <div class="param-line">
            <span class="label text-slate-700 dark:text-slate-300 font-medium">提示词：</span>
          </div>
          <div class="param-line">
            <textarea
              v-model="store.currentPrompt"
              :rows="4"
              :maxlength="2000"
              placeholder="描述你想要的图片效果"
              class="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 resize-none"
            />
          </div>

          <div class="param-line">
            <span class="label text-slate-700 dark:text-slate-300 font-medium">图片尺寸：</span>
          </div>
          <div class="param-line">
            <select v-model="store.imageToImageParams.size" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100">
              <option v-for="opt in imageSizeOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
            </select>
          </div>
        </div>

        <!-- Image Edit -->
        <div v-if="store.activeFunction === 'image_edit'" class="function-panel bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm space-y-4">
          <div class="param-line">
            <span class="label text-slate-700 dark:text-slate-300 font-medium">上传图片：</span>
          </div>
          <div class="param-line">
            <ImageUpload v-model="store.imageEditParams.image_input" :max-count="1" :multiple="false" />
          </div>

          <div class="param-line">
            <span class="label text-slate-700 dark:text-slate-300 font-medium">编辑提示词：</span>
          </div>
          <div class="param-line">
            <textarea
              v-model="store.currentPrompt"
              :rows="4"
              placeholder="描述你想要的编辑效果"
              class="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 resize-none"
            />
          </div>

          <div class="item-group">
            <span class="label text-slate-700 dark:text-slate-300 font-medium">编辑强度：</span>
            <input
              type="range"
              v-model="store.imageEditParams.scale"
              min="0"
              max="1"
              step="0.1"
              class="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
            <div class="text-center text-sm text-slate-500">{{ store.imageEditParams.scale }}</div>
          </div>
        </div>

        <!-- Image Effects -->
        <div v-if="store.activeFunction === 'image_effects'" class="function-panel bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm space-y-4">
          <div class="param-line">
            <span class="label text-slate-700 dark:text-slate-300 font-medium">上传图片：</span>
          </div>
          <div class="param-line">
            <ImageUpload v-model="store.imageEffectsParams.image_input" :max-count="1" :multiple="false" />
          </div>

          <div class="param-line">
            <span class="label text-slate-700 dark:text-slate-300 font-medium">特效模板：</span>
          </div>
          <div class="param-line">
            <select
              v-model="store.imageEffectsParams.template_id"
              @change="handleTemplateChange($event)"
              class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
            >
              <option v-for="opt in imageEffectsTemplateOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
            </select>
          </div>

          <div class="param-line">
            <span class="label text-slate-700 dark:text-slate-300 font-medium">输出尺寸：</span>
          </div>
          <div class="param-line">
            <select v-model="store.imageEffectsParams.size" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100">
              <option v-for="opt in imageSizeOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
            </select>
          </div>
        </div>

        <!-- Text to Video -->
        <div v-if="store.activeFunction === 'text_to_video'" class="function-panel bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm space-y-4">
          <div class="param-line">
            <span class="label text-slate-700 dark:text-slate-300 font-medium">提示词：</span>
          </div>
          <div class="param-line">
            <textarea
              v-model="store.currentPrompt"
              :rows="4"
              placeholder="描述你想要的视频内容"
              class="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 resize-none"
            />
          </div>

          <div class="param-line">
            <span class="label text-slate-700 dark:text-slate-300 font-medium">视频比例：</span>
          </div>
          <div class="param-line">
            <select v-model="store.textToVideoParams.aspect_ratio" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100">
              <option v-for="opt in videoAspectRatioOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
            </select>
          </div>
        </div>

        <!-- Image to Video -->
        <div v-if="store.activeFunction === 'image_to_video'" class="function-panel bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm space-y-4">
          <div class="param-line">
            <span class="label text-slate-700 dark:text-slate-300 font-medium">上传图片：</span>
          </div>
          <div class="param-line">
            <ImageUpload v-model="store.imageToVideoParams.image_input" :max-count="2" :multiple="true" />
          </div>

          <div class="param-line">
            <span class="label text-slate-700 dark:text-slate-300 font-medium">提示词：</span>
          </div>
          <div class="param-line">
            <textarea
              v-model="store.currentPrompt"
              :rows="4"
              placeholder="描述你想要的视频效果"
              class="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 resize-none"
            />
          </div>

          <div class="param-line">
            <span class="label text-slate-700 dark:text-slate-300 font-medium">视频比例：</span>
          </div>
          <div class="param-line">
            <select v-model="store.imageToVideoParams.aspect_ratio" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100">
              <option v-for="opt in videoAspectRatioOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
            </select>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="submit-btn pt-4">
          <button
            @click="store.submitTask"
            :disabled="store.submitting"
            class="w-full py-3 bg-gradient-to-r from-violet-500 to-violet-700 text-white rounded-xl disabled:from-slate-400 disabled:to-slate-400 disabled:cursor-not-allowed hover:from-violet-600 hover:to-violet-800 transition-all flex items-center justify-center gap-2"
          >
            <i v-if="store.submitting" class="iconfont icon-loading animate-spin"></i>
            <i v-else class="iconfont icon-chuangzuo"></i>
            <span>立即生成 ({{ store.currentPowerCost }}算力)</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Right Panel - Task List -->
    <div class="main-content flex-1 overflow-y-auto p-4 bg-slate-100 dark:bg-slate-950">
      <div class="works-header flex justify-between items-center mb-4">
        <h2 class="h-title text-xl font-bold text-slate-900 dark:text-slate-100">你的作品</h2>
        <div class="filter-buttons flex gap-2">
          <button
            v-for="filter in ['all', 'image', 'video']"
            :key="filter"
            @click="store.switchTaskFilter(filter)"
            :class="store.taskFilter === filter ? 'bg-violet-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            {{ filter === 'all' ? '全部' : filter === 'image' ? '图片' : '视频' }}
          </button>
        </div>
      </div>

      <div class="task-list">
        <div v-if="store.loading" class="flex items-center justify-center py-20">
          <div class="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
        </div>

        <div v-else-if="store.currentList.length > 0" class="space-y-4">
          <div
            v-for="item in store.currentList"
            :key="item.id"
            class="task-item bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm"
          >
            <div class="flex gap-4 p-4">
              <div class="task-left flex-shrink-0">
                <div class="task-preview w-32 h-32 relative rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700">
                  <img v-if="item.img_url" :src="item.img_url" class="w-full h-full object-cover" />
                  <video v-else-if="item.video_url" :src="item.video_url" muted loop class="w-full h-full object-cover" @click="store.playVideo(item)"></video>
                  <div v-else class="w-full h-full flex flex-col items-center justify-center text-slate-400">
                    <i :class="item.type.includes('video') ? 'iconfont icon-video text-2xl' : 'iconfont icon-dalle text-2xl'"></i>
                    <span class="text-xs mt-1">{{ store.getTaskStatusText(item.status) }}</span>
                  </div>
                </div>
              </div>
              <div class="task-center flex-1 min-w-0">
                <div class="task-info flex justify-between items-start mb-2">
                  <span
                    :class="[
                      'px-2 py-0.5 rounded text-xs font-medium',
                      item.type === 'text_to_image' ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400' :
                      item.type === 'image_to_image' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                      item.type === 'text_to_video' ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400' :
                      'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                    ]"
                  >
                    {{ store.getFunctionName(item.type) }}
                  </span>
                  <div class="flex gap-3 text-slate-400">
                    <i class="iconfont icon-copy cursor-pointer hover:text-violet-600" @click="copyPrompt(item.prompt)" title="复制提示词"></i>
                    <i v-if="item.status === 'failed'" class="iconfont icon-refresh cursor-pointer hover:text-violet-600" @click="store.retryTask(item.id)" title="重试"></i>
                    <i class="iconfont icon-remove cursor-pointer hover:text-red-500" @click="store.removeJob(item)" title="删除"></i>
                    <i v-if="item.video_url || item.img_url" class="iconfont icon-download cursor-pointer hover:text-violet-600" @click="store.downloadFile(item)" title="下载"></i>
                  </div>
                </div>
                <div class="task-prompt text-sm text-slate-600 dark:text-slate-400 mb-2 line-clamp-2">
                  {{ store.substr(item.prompt, 200) }}
                </div>
                <div class="task-meta text-xs text-slate-400 flex gap-4">
                  <span>{{ dateFormat(item.created_at) }}</span>
                  <span v-if="item.power">{{ item.power }}算力</span>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-center py-8">
            <div v-if="store.isOver" class="text-slate-500 flex items-center gap-2">
              <span>没有更多数据了</span>
              <i class="iconfont icon-face"></i>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-20 text-slate-400">
          <i class="iconfont icon-empty text-6xl mb-4"></i>
          <p>暂无记录</p>
        </div>
      </div>
    </div>

    <!-- Video Dialog -->
    <teleport to="body">
      <div v-if="store.showDialog" class="fixed inset-0 bg-black/80 z-50 flex items-center justify-center" @click.self="store.showDialog = false">
        <div class="max-w-4xl w-full mx-4">
          <video
            :src="store.currentVideoUrl"
            autoplay
            controls
            preload="auto"
            loop
            muted
            class="w-full max-h-[80vh] object-contain rounded-lg"
          >
            您的浏览器不支持视频播放
          </video>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import '@/assets/css/jimeng.scss'
import loadingIcon from '@/assets/img/loading.gif'
import ImageUpload from '@/components/ImageUpload.vue'
import Generating from '@/components/ui/Generating.vue'
import {
  imageEffectsTemplateOptions,
  imageSizeOptions,
  useJimengStore,
  videoAspectRatioOptions,
} from '@/store/jimeng'
import { useSharedStore } from '@/store/sharedata'
import { dateFormat } from '@/utils/libs'
import { showMessageSuccess, showMessageError } from '@/utils/dialog'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { Waterfall } from 'vue-waterfall-plugin-next'
import 'vue-waterfall-plugin-next/dist/style.css'

const sharedStore = useSharedStore()
const waterfallOptions = sharedStore.waterfallOptions

const getCategoryIcon = (category) => {
  const iconMap = {
    image_generation: 'iconfont icon-image',
    image_editing: 'iconfont icon-edit',
    image_effects: 'iconfont icon-chuangzuo',
    video_generation: 'iconfont icon-video',
  }
  return iconMap[category] || 'iconfont icon-image'
}

const store = useJimengStore()
const waterfallRendered = ref(false)
const templatePreview = ref('')

onMounted(() => {
  store.init()
})

onUnmounted(() => {
  store.cleanup()
})

watch(
  () => store.loading,
  (val) => {
    if (val) {
      waterfallRendered.value = false
    }
  }
)

watch(
  () => store.isOver,
  (val) => {
    if (val) {
      waterfallRendered.value = true
    }
  }
)

function handleTemplateChange(value) {
  templatePreview.value = imageEffectsTemplateOptions.find((opt) => opt.value === value)?.preview
  store.imageEffectsParams.prompt = imageEffectsTemplateOptions.find((opt) => opt.value === value)?.label
}

function onWaterfallAfterRender() {
  waterfallRendered.value = true
  if (!store.loading && !store.isOver) {
    store.fetchData(store.page + 1)
  }
}

function copyPrompt(prompt) {
  navigator.clipboard.writeText(prompt).then(() => {
    showMessageSuccess('提示词已复制')
  }).catch(() => {
    showMessageError('复制失败')
  })
}
</script>

<style scoped>
.page-jimeng {
  min-height: 100vh;
}
</style>