<template>
  <div class="page-images-wall p-4">
    <div class="header mb-4">
      <h2 class="text-xl pt-4 pb-4 text-slate-900 dark:text-slate-100">AI 绘画作品墙</h2>
      <div class="settings flex gap-2">
        <button
          v-for="type in ['mj', 'sd', 'dall']"
          :key="type"
          @click="changeImgType(type)"
          :class="imgType === type ? 'bg-violet-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'"
          class="px-4 py-2 rounded-lg flex items-center gap-1 text-sm font-medium"
        >
          <i :class="'iconfont icon-' + (type === 'mj' ? 'mj' : type === 'sd' ? 'sd' : 'dalle')"></i>
          {{ type === 'mj' ? 'MidJourney' : type === 'sd' ? 'StableDiffusion' : 'Dalle' }}
        </button>
      </div>
    </div>

    <div class="waterfall" :style="{ height: listBoxHeight + 'px' }" id="waterfall-box">
      <Waterfall
        v-if="imgType === 'mj'"
        id="waterfall-mj"
        :list="data['mj']"
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
                :url="url"
                class="cursor-pointer transition-all duration-300 ease-linear group-hover:scale-105"
                @click="previewImg(item)"
              />
            </div>
            <div class="px-4 pt-2 pb-4 border-t border-t-slate-800 dark:border-t-slate-700">
              <div class="pt-3 flex justify-center items-center border-t border-t-slate-600 dark:border-t-slate-500 border-opacity-50">
                <div class="opt flex gap-2">
                  <button
                    class="w-8 h-8 rounded-full bg-slate-600 hover:bg-slate-500 flex items-center justify-center copy-prompt-wall"
                    :data-clipboard-text="item.prompt"
                    title="复制提示词"
                  >
                    <i class="iconfont icon-file"></i>
                  </button>
                  <button
                    class="w-8 h-8 rounded-full bg-violet-600 hover:bg-violet-500 flex items-center justify-center"
                    @click="drawSameMj(item)"
                    title="画同款"
                  >
                    <i class="iconfont icon-palette"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </template>
      </Waterfall>

      <Waterfall
        v-if="imgType === 'sd'"
        id="waterfall-sd"
        :list="data['sd']"
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
                :url="url"
                class="cursor-pointer transition-all duration-300 ease-linear group-hover:scale-105"
                @click="showTask(item)"
              />
            </div>
            <div class="px-4 pt-2 pb-4 border-t border-t-slate-800 dark:border-t-slate-700">
              <div class="pt-3 flex justify-center items-center border-t border-t-slate-600 dark:border-t-slate-500 border-opacity-50">
                <div class="opt flex gap-2">
                  <button
                    class="w-8 h-8 rounded-full bg-slate-600 hover:bg-slate-500 flex items-center justify-center copy-prompt-wall"
                    :data-clipboard-text="item.prompt"
                    title="复制提示词"
                  >
                    <i class="iconfont icon-file"></i>
                  </button>
                  <button
                    class="w-8 h-8 rounded-full bg-violet-600 hover:bg-violet-500 flex items-center justify-center"
                    @click="drawSameSd(item)"
                    title="画同款"
                  >
                    <i class="iconfont icon-palette"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </template>
      </Waterfall>

      <Waterfall
        v-if="imgType === 'dall'"
        id="waterfall-dall"
        :list="data['dall']"
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
                :url="url"
                class="cursor-pointer transition-all duration-300 ease-linear group-hover:scale-105"
                @click="previewImg(item)"
              />
            </div>
            <div class="px-4 pt-2 pb-4 border-t border-t-slate-800 dark:border-t-slate-700">
              <div class="pt-3 flex justify-center items-center border-t border-t-slate-600 dark:border-t-slate-500 border-opacity-50">
                <div class="opt flex gap-2">
                  <button
                    class="w-8 h-8 rounded-full bg-slate-600 hover:bg-slate-500 flex items-center justify-center copy-prompt-wall"
                    :data-clipboard-text="item.prompt"
                    title="复制提示词"
                  >
                    <i class="iconfont icon-file"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </template>
      </Waterfall>

      <div class="flex flex-col items-center justify-center py-10">
        <img
          :src="waterfallOptions.loadProps.loading"
          class="max-w-[50px] max-h-[50px]"
          v-if="loading"
        />
        <div v-else>
          <button
            class="px-5 py-2 rounded-full bg-violet-600 text-md text-white cursor-pointer hover:bg-violet-700 transition-all duration-300"
            @click="getNext"
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

      <back-top :right="30" :bottom="30" />
    </div>

    <!-- 任务详情弹框 -->
    <sd-task-view
      v-model="showTaskDialog"
      :data="item"
      @drawSame="drawSameSd"
      @close="showTaskDialog = false"
    />

    <!-- 图片预览 -->
    <teleport to="body">
      <div v-if="previewURL" class="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" @click="previewURL = ''">
        <img :src="previewURL" class="max-w-[90vw] max-h-[90vh] object-contain" />
        <button
          class="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white"
          @click="previewURL = ''"
        >
          <i class="iconfont icon-close"></i>
        </button>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import BackTop from '@/components/BackTop.vue'
import SdTaskView from '@/components/SdTaskView.vue'
import { useSharedStore } from '@/store/sharedata'
import { httpGet } from '@/utils/http'
import { showMessageError, showMessageSuccess } from '@/utils/dialog'
import Clipboard from 'clipboard'
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { LazyImg, Waterfall } from 'vue-waterfall-plugin-next'
import 'vue-waterfall-plugin-next/dist/style.css'

const store = useSharedStore()
const waterfallOptions = store.waterfallOptions

const data = ref({
  mj: [],
  sd: [],
  dall: [],
})
const loading = ref(true)
const isOver = ref(false)
const imgType = ref('mj')
const listBoxHeight = window.innerHeight - 124
const showTaskDialog = ref(false)
const item = ref({})
const previewURL = ref('')

const previewImg = (imgItem) => {
  previewURL.value = imgItem.img_url
}

const page = ref(0)
const pageSize = ref(15)

const getNext = () => {
  if (isOver.value) return

  loading.value = true
  page.value = page.value + 1
  let url = ''
  switch (imgType.value) {
    case 'mj': url = '/api/mj/imgWall'; break
    case 'sd': url = '/api/sd/imgWall'; break
    case 'dall': url = '/api/dall/imgWall'; break
  }
  httpGet(`${url}?page=${page.value}&page_size=${pageSize.value}`)
    .then((res) => {
      if (!res.data.items || res.data.items.length === 0) {
        isOver.value = true
        loading.value = false
        return
      }
      const imageList = res.data.items
      for (let i = 0; i < imageList.length; i++) {
        imageList[i]['img_thumb'] = imageList[i]['img_url'] + '?imageView2/4/w/300/h/0/q/75'
      }
      if (data.value[imgType.value].length === 0) {
        data.value[imgType.value] = imageList
        return
      }
      if (imageList.length < pageSize.value) {
        isOver.value = true
      }
      data.value[imgType.value] = data.value[imgType.value].concat(imageList)
    })
    .catch((e) => {
      showMessageError('获取图片失败：' + e.message)
      loading.value = false
    })
}

getNext()

const clipboard = ref(null)
onMounted(() => {
  clipboard.value = new Clipboard('.copy-prompt-wall')
  clipboard.value.on('success', () => {
    showMessageSuccess('复制成功！')
  })
  clipboard.value.on('error', () => {
    showMessageError('复制失败！')
  })
})

onUnmounted(() => {
  clipboard.value?.destroy()
})

const changeImgType = (type) => {
  imgType.value = type
  document.getElementById('waterfall-box').scrollTo(0, 0)
  page.value = 0
  data.value = { mj: [], sd: [], dall: [] }
  loading.value = true
  isOver.value = false
  nextTick(() => getNext())
}

const showTask = (row) => {
  item.value = row
  showTaskDialog.value = true
}

const router = useRouter()
const drawSameSd = (row) => {
  router.push({
    name: 'image-sd',
    params: { copyParams: JSON.stringify(row.params) },
  })
}

const drawSameMj = (row) => {
  router.push({ name: 'image-mj', params: { prompt: row.prompt } })
}
</script>

<style scoped>
.page-images-wall {
  min-height: 100vh;
}
</style>