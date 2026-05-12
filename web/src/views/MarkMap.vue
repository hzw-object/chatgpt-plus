<template>
  <div class="page-mark-map p-4">
    <div class="inner flex gap-4 h-[calc(100vh-100px)]">
      <!-- Left Panel - Controls -->
      <div class="mark-map-box w-80 flex-shrink-0 overflow-y-auto">
        <h2 class="text-xl font-bold mb-4 text-slate-900 dark:text-slate-100">思维导图创作中心</h2>

        <div class="space-y-4">
          <div class="param-line text-sm font-medium text-slate-700 dark:text-slate-300">你的需求？</div>
          <textarea
            v-model="prompt"
            rows="4"
            class="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-violet-500 outline-none resize-none"
            placeholder="请给AI输入提示词，让AI帮你完善"
          />

          <div class="param-line text-sm font-medium text-slate-700 dark:text-slate-300">请选择生成思维导图的AI模型</div>
          <select
            v-model="modelID"
            class="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-violet-500 outline-none"
          >
            <option v-for="item in models" :key="item.id" :value="item.id">
              {{ item.name }} ({{ item.power }}算力)
            </option>
          </select>

          <div class="text-sm text-slate-600 dark:text-slate-400">
            当前可用算力：<span class="text-amber-500 font-medium">{{ loginUser.power }}</span>
          </div>

          <button
            class="w-full py-3 bg-gradient-to-r from-violet-500 to-violet-700 text-white rounded-xl disabled:from-slate-400 disabled:to-slate-400 disabled:cursor-not-allowed hover:from-violet-600 hover:to-violet-800 transition-all flex items-center justify-center gap-2"
            @click="generateAI"
            :disabled="loading"
          >
            <i v-if="loading" class="iconfont icon-loading animate-spin"></i>
            <i v-else class="iconfont icon-chuangzuo"></i>
            <span>生成思维导图</span>
          </button>

          <div class="param-line text-sm font-medium text-slate-700 dark:text-slate-300">使用已有内容生成？</div>
          <textarea
            v-model="content"
            rows="4"
            class="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-violet-500 outline-none resize-none"
            placeholder="请用markdown语法输入您想要生成思维导图的内容！"
          />

          <button
            class="w-full py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-xl hover:from-green-500 hover:to-blue-600 transition-all flex items-center justify-center gap-2"
            @click="generate"
          >
            <i class="iconfont icon-chuangzuo"></i>
            <span>直接生成（免费）</span>
          </button>
        </div>
      </div>

      <!-- Right Panel - Markmap View -->
      <div class="chat-box flex-1 flex flex-col">
        <div class="body flex-1 relative" id="markmap">
          <svg ref="svgRef" class="w-full" :style="{ height: rightBoxHeight + 'px' }" />
          <div id="toolbar" class="absolute top-2 right-2"></div>
          <button
            @click="downloadImage"
            class="absolute bottom-4 right-4 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg flex items-center gap-2"
          >
            <i class="iconfont icon-download"></i>
            <span>下载图片</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { checkSession, getSystemInfo } from '@/store/cache'
import { useSharedStore } from '@/store/sharedata'
import { httpGet, httpPost } from '@/utils/http'
import { showMessageError } from '@/utils/dialog'
import { Transformer } from 'markmap-lib'
import { Toolbar } from 'markmap-toolbar'
import { Markmap } from 'markmap-view'
import { nextTick, onMounted, ref } from 'vue'

const leftBoxHeight = ref(window.innerHeight - 105)
const rightBoxHeight = ref(window.innerHeight)

const prompt = ref('')
const text = ref('')
const content = ref(text.value)
const html = ref('')

const isLogin = ref(false)
const loginUser = ref({ power: 0 })
const transformer = new Transformer()
const store = useSharedStore()
const loading = ref(false)

const svgRef = ref(null)
const markMap = ref(null)
const models = ref([])
const modelID = ref(0)
const cacheKey = ref('MarkMapCache')

onMounted(async () => {
  const cache = localStorage.getItem(cacheKey.value)
  if (cache) {
    text.value = cache
  } else {
    const res = await httpGet('/api/config/get?key=mark_map')
    text.value = res.data?.content || ''
    content.value = text.value
  }

  initData()
  nextTick(() => {
    try {
      markMap.value = Markmap.create(svgRef.value)
      const { el } = Toolbar.create(markMap.value)
      document.getElementById('toolbar').append(el)
      update()
    } catch (e) {
      console.error(e)
    }
  })
})

const initData = () => {
  httpGet('/api/model/list')
    .then((res) => {
      for (let v of res.data) {
        models.value.push(v)
      }
      modelID.value = models.value[0].id
    })
    .catch((e) => {
      showMessageError('获取模型失败：' + e.message)
    })

  checkSession()
    .then((user) => {
      loginUser.value = user
      isLogin.value = true
    })
    .catch(() => {})
}

const update = () => {
  try {
    const { root } = transformer.transform(processContent(text.value))
    markMap.value.setData(root)
    markMap.value.fit()
  } catch (e) {
    console.error(e)
  }
}

const processContent = (text) => {
  if (!text) {
    return text
  }

  const arr = []
  const lines = text.split('\n')
  for (let line of lines) {
    if (line.indexOf('```') !== -1) {
      continue
    }
    line = line.replace(/([*_~`>])|(\d+\.)\s/g, '')
    arr.push(line)
  }
  return arr.join('\n')
}

window.onresize = () => {
  leftBoxHeight.value = window.innerHeight - 145
  rightBoxHeight.value = window.innerHeight - 85
}

const generate = () => {
  text.value = content.value
  update()
}

// 使用 AI 智能生成
const generateAI = () => {
  html.value = ''
  text.value = ''
  if (prompt.value === '') {
    return showMessageError('请输入你的需求')
  }
  if (!isLogin.value) {
    store.setShowLoginDialog(true)
    return
  }
  loading.value = true
  httpPost('/api/markMap/gen', {
    prompt: prompt.value,
    model_id: modelID.value,
  })
    .then((res) => {
      text.value = res.data
      content.value = processContent(text.value)
      const model = getModelById(modelID.value)
      loginUser.value.power -= model.power
      nextTick(() => update())
      loading.value = false
      localStorage.setItem(cacheKey.value, text.value)
    })
    .catch((e) => {
      showMessageError('生成思维导图失败：' + e.message)
      loading.value = false
    })
}

const getModelById = (modelId) => {
  for (let m of models.value) {
    if (m.id === modelId) {
      return m
    }
  }
}

// download SVG to png file
const downloadImage = async () => {
  await markMap.value.fit()

  const svgElement = document.getElementById('markmap')
  const serializer = new XMLSerializer()
  const source =
    '<?xml version="1.0" standalone="no"?>\r\n' + serializer.serializeToString(svgRef.value)
  const image = new Image()
  image.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(source)

  const scale = 4
  const canvas = document.createElement('canvas')
  canvas.width = svgElement.offsetWidth * scale
  canvas.height = svgElement.offsetHeight * scale

  let context = canvas.getContext('2d')
  context.clearRect(0, 0, canvas.width, canvas.height)
  context.fillStyle = 'white'
  context.fillRect(0, 0, canvas.width, canvas.height)

  image.onload = function () {
    context.setTransform(scale, 0, 0, scale, 0, 0)
    context.drawImage(image, 0, 0)
    const a = document.createElement('a')
    a.download = 'geek-ai-xmind.png'
    a.href = canvas.toDataURL('image/png')
    a.click()
  }
}
</script>

<style scoped>
.page-mark-map {
  min-height: 100vh;
}
</style>