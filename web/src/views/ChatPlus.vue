<template>
  <div class="chat-page flex h-screen">
    <!-- Aside - Chat List -->
    <aside
      v-show="store.chatListExtend"
      class="w-72 flex-shrink-0 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col"
    >
      <div class="flex w-full justify-center pt-3 pb-3">
        <img :src="logo" style="max-height: 40px" :alt="title" v-if="logo !== ''" />
        <h2 v-else>{{ title }}</h2>
      </div>

      <div class="chat-list-container flex-1 flex flex-col overflow-hidden">
        <button @click="_newChat" class="new-chat-btn mx-3 mb-3 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg flex items-center justify-center gap-2">
          <i class="iconfont icon-new-chat"></i>
          新建对话
        </button>

        <div class="search-box px-3 mb-3">
          <div class="relative">
            <i class="iconfont icon-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
            <input
              v-model="chatName"
              placeholder="搜索会话"
              @keyup="searchChat($event)"
              class="search-input w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        <div class="flex-1 overflow-y-auto px-3" :style="{ height: chatListHeight + 'px' }">
          <div class="content space-y-2">
            <div
              v-for="chat in chatList"
              :key="chat.chat_id"
              :class="chat.chat_id === chatId ? 'chat-list-item active' : 'chat-list-item'"
              @click="loadChat(chat)"
              class="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <img :src="chat.icon" class="avatar w-10 h-10 rounded-full object-cover" />
              <div class="flex-1 min-w-0">
                <input
                  v-if="chat.edit"
                  v-model="tmpChatTitle"
                  @keydown="titleKeydown($event, chat)"
                  :id="'chat-' + chat.chat_id"
                  @blur="editConfirm(chat)"
                  @click.stop="stopPropagation($event)"
                  placeholder="请输入标题"
                  class="w-full px-2 py-1 text-sm border border-slate-300 rounded"
                />
                <span v-else class="chat-title block truncate">{{ chat.title }}</span>
              </div>
              <div class="chat-opt relative" @click.stop>
                <button @click="toggleDropdown(chat)" class="p-1 hover:bg-slate-200 rounded">
                  <i class="iconfont icon-more text-lg"></i>
                </button>
                <div
                  v-if="activeDropdown === chat.chat_id"
                  class="absolute right-0 top-full mt-1 bg-white dark:bg-slate-700 rounded-lg shadow-lg border border-slate-200 dark:border-slate-600 z-50 py-1 min-w-[100px]"
                >
                  <button @click="editChatTitle(chat)" class="w-full px-4 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-600 flex items-center gap-2">
                    <i class="iconfont icon-edit"></i> 重命名
                  </button>
                  <button @click="removeChat(chat)" class="w-full px-4 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-600 text-red-500 flex items-center gap-2">
                    <i class="iconfont icon-delete"></i> 删除
                  </button>
                  <button @click="shareChat(chat)" class="w-full px-4 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-600 flex items-center gap-2">
                    <i class="iconfont icon-share-bold"></i> 分享
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="tool-box p-3 border-t border-slate-200 dark:border-slate-700">
        <button @click="clearAllChats" class="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg flex items-center justify-center gap-2">
          <i class="iconfont icon-clear"></i> 清除所有对话
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 relative overflow-hidden">
      <div v-if="loading" class="absolute inset-0 bg-slate-500/30 flex items-center justify-center z-10">
        <div class="w-10 h-10 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
      </div>

      <div class="absolute top-2 left-2 cursor-pointer z-20">
        <div @click="store.setChatListExtend(!store.chatListExtend)">
          <span v-if="store.chatListExtend" :title="'隐藏对话列表'" class="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
            <i class="iconfont icon-colspan text-xl"></i>
          </span>
          <span v-else :title="'展开对话列表'" class="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
            <i class="iconfont icon-expand text-xl"></i>
          </span>
        </div>
      </div>

        <div class="chat-container">
          <div class="chat-config flex items-center gap-3">
            <!-- Role Select -->
            <select
              v-model="roleId"
              @change="_newChat"
              class="w-40 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            >
              <option v-for="item in roles" :key="item.id" :value="item.id">
                {{ item.name }}
              </option>
            </select>

            <!-- Model Selector Popover -->
            <div class="relative">
              <button
                @click="showModelSelector = !showModelSelector"
                :disabled="disableModel"
                class="min-w-[180px] max-w-[350px] px-4 py-2 border border-violet-300 dark:border-violet-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-violet-50 dark:hover:bg-violet-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <span class="truncate flex-1">{{ getSelectedModelName() }}</span>
                <span
                  v-if="getSelectedModel()"
                  class="px-2 py-0.5 text-xs bg-slate-100 dark:bg-slate-700 rounded"
                >
                  {{ getSelectedModel().power }}算力
                </span>
                <i class="iconfont icon-arrow-down text-sm"></i>
              </button>

              <!-- Model Selector Dropdown -->
              <div
                v-if="showModelSelector"
                class="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 p-4 w-[820px] max-w-[90vw]"
              >
                <div class="model-search flex items-center gap-3 mb-4">
                  <div class="relative flex-1">
                    <i class="iconfont icon-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                    <input
                      v-model="modelSearchKeyword"
                      placeholder="搜索模型"
                      class="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                  <button
                    @click="toggleFreeModels"
                    :class="showFreeModelsOnly ? 'bg-violet-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'"
                    class="px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <i class="iconfont icon-free"></i>
                    免费模型
                  </button>
                </div>

                <div class="category-tabs flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-700 pb-3 mb-4">
                  <button
                    v-for="category in ['', ...modelCategories]"
                    :key="category"
                    @click="activeCategory = category"
                    :class="activeCategory === category ? 'border-b-2 border-violet-600 text-violet-600' : 'text-slate-500 hover:text-violet-600'"
                    class="px-3 py-1 text-sm transition-colors"
                  >
                    {{ category || '全部' }}
                  </button>
                  <button
                    v-if="activeCategory && modelCategories.length > 0"
                    @click="activeCategory = ''"
                    class="ml-auto px-3 py-1 text-sm text-red-500 hover:text-red-600 flex items-center gap-1"
                  >
                    <i class="iconfont icon-close"></i> 清除筛选
                  </button>
                </div>

                <div v-if="displayedModels.length === 0" class="py-12 text-center text-slate-400">
                  <i class="iconfont icon-empty text-5xl mb-3"></i>
                  <p>没有找到匹配的模型</p>
                </div>

                <div v-else class="models-grid grid grid-cols-3 gap-4 max-h-[450px] overflow-y-auto">
                  <div
                    v-for="model in displayedModels"
                    :key="model.id"
                    @click="selectModel(model)"
                    :class="model.id === modelID ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20' : 'border-slate-200 dark:border-slate-600 hover:border-violet-400'"
                    class="model-card border rounded-lg p-4 cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div class="model-card-header flex justify-between items-start mb-2">
                      <span class="model-name font-bold text-sm truncate max-w-[170px]" :title="model.name">{{ model.name }}</span>
                      <span :class="getTagType(model.power) === 'danger' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : getTagType(model.power) === 'warning' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'" class="px-2 py-0.5 text-xs rounded flex-shrink-0">
                        {{ model.power > 0 ? `${model.power}算力` : '免费' }}
                      </span>
                    </div>
                    <div class="model-description text-xs text-slate-500 dark:text-slate-400 line-clamp-3 mb-3" :title="model.desc || '暂无描述'">
                      {{ model.desc || '暂无描述' }}
                    </div>
                    <div class="model-detail flex justify-between text-xs text-slate-400">
                      <div>响应: {{ model.max_tokens }}</div>
                      <div>上下文: {{ model.max_context }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Tools Dropdown -->
            <div class="relative">
              <button @click="showToolsDropdown = !showToolsDropdown" class="setting p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                <i class="iconfont icon-plugin text-lg"></i>
              </button>
              <div
                v-if="showToolsDropdown"
                class="absolute left-0 top-full mt-1 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-600 z-50 py-2 min-w-[200px]"
              >
                <div v-for="item in tools" :key="item.id" class="flex items-center gap-3 px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700">
                  <input
                    type="checkbox"
                    :value="item.id"
                    v-model="toolSelected"
                    class="w-4 h-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                  />
                  <span class="flex-1">{{ item.label }}</span>
                  <span :title="item.description" class="text-slate-400 cursor-help">
                    <i class="iconfont icon-tips"></i>
                  </span>
                </div>
              </div>
            </div>

            <button @click="showChatSetting = true" class="setting p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
              <i class="iconfont icon-config text-lg"></i>
            </button>
          </div>

          <div class="flex justify-center">
            <div id="container" :style="{ height: mainWinHeight + 'px' }">
              <div class="chat-box" id="chat-box" :style="{ height: chatBoxHeight + 'px' }">
                <div v-if="showHello">
                  <welcome @send="autofillPrompt" />
                </div>
                <div v-for="item in chatData" :key="item.id" v-else>
                  <chat-prompt
                    v-if="item.type === 'prompt'"
                    :data="item"
                    :list-style="listStyle"
                    @edit="editUserPrompt"
                  />
                  <chat-reply
                    v-else-if="item.type === 'reply'"
                    :data="item"
                    @regen="reGenerate"
                    :read-only="false"
                    :list-style="listStyle"
                  />
                </div>

                <back-top :right="30" :bottom="155" />
              </div>

              <div class="input-box">
                <div class="input-box-inner">
                  <div class="input-body">
                    <div ref="textHeightRef" class="hide-div">{{ prompt }}</div>
                    <div class="input-border">
                      <div class="input-inner">
                        <div class="file-list" v-if="files.length > 0">
                          <file-list :files="files" @remove-file="removeFile" />
                        </div>
                        <textarea
                          ref="inputRef"
                          class="prompt-input w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500"
                          :rows="row"
                          v-model="prompt"
                          @keydown="onInput"
                          @input="onInput"
                          placeholder="按 Enter 键发送消息，使用 Shift + Enter 换行"
                          autofocus
                        ></textarea>
                      </div>
                      <div class="flex justify-between items-center mt-2">
                        <div class="flex gap-2">
                          <span class="tool-item-btn" :title="'上传附件'">
                            <file-select
                              :user-id="loginUser && loginUser.id"
                              @selected="insertFile"
                            />
                          </span>
                        </div>
                        <div class="flex gap-2">
                          <span class="send-btn tool-item-btn">
                            <button
                              v-if="isGenerating"
                              @click="stopGenerate"
                              class="px-4 py-2 bg-slate-500 hover:bg-slate-600 text-white rounded-lg flex items-center gap-2"
                            >
                              <i class="iconfont icon-stop"></i>
                            </button>
                            <button
                              v-else
                              @click="sendMessage()"
                              :disabled="isGenerating"
                              class="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                              <i class="iconfont icon-send"></i>
                            </button>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

    <ChatSetting :show="showChatSetting" @hide="showChatSetting = false" />

    <!-- Voice Chat Dialog -->
    <teleport to="body">
      <div v-if="showConversationDialog" class="fixed inset-0 bg-black z-50 flex flex-col">
        <div class="flex justify-end p-4">
          <button @click="showConversationDialog = false" class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white">
            <i class="iconfont icon-close"></i>
          </button>
        </div>
        <div class="flex-1 flex items-center justify-center">
          <div v-if="!frameLoaded" class="w-10 h-10 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
          <iframe
            v-show="frameLoaded"
            style="width: 100%; height: calc(100vh - 100px); border: none"
            :src="voiceChatUrl"
            @load="frameLoaded = true"
            allow="microphone *;camera *;"
          ></iframe>
        </div>
      </div>
    </teleport>

    <!-- Edit Message Dialog -->
    <teleport to="body">
      <div v-if="showEditDialog" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" @click.self="showEditDialog = false">
        <div class="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100">编辑消息</h3>
            <button @click="showEditDialog = false" class="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
              <i class="iconfont icon-close"></i>
            </button>
          </div>
          <textarea
            v-model="editMessageContent"
            rows="4"
            class="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 resize-none"
            placeholder="请输入消息内容"
          ></textarea>
          <div class="flex justify-end gap-3 mt-4">
            <button @click="showEditDialog = false" class="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg">
              取消
            </button>
            <button @click="confirmEdit" class="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg">
              确定
            </button>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>
<script setup>
import BackTop from '@/components/BackTop.vue'
import ChatPrompt from '@/components/ChatPrompt.vue'
import ChatReply from '@/components/ChatReply.vue'
import ChatSetting from '@/components/ChatSetting.vue'
import FileList from '@/components/FileList.vue'
import FileSelect from '@/components/FileSelect.vue'
import Welcome from '@/components/Welcome.vue'
import { closeLoading, showLoading, showMessageError, showMessageInfo, showMessageSuccess, showConfirmDialog } from '@/utils/dialog'
import { httpGet, httpPost } from '@/utils/http'
import { isMobile, randString, removeArrayItem, UUID } from '@/utils/libs'
import { fetchEventSource } from '@microsoft/fetch-event-source'
import Clipboard from 'clipboard'
import 'highlight.js/styles/a11y-dark.css'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getUserToken } from '../store/session'
import { substr } from '../utils/libs'

const title = ref('GeekAI-智能助手')
const logo = ref('')
const models = ref([])
const modelID = ref(0)
const chatData = ref([])
const allChats = ref([]) // 会话列表
const chatList = ref(allChats.value)
const mainWinHeight = ref(0) // 主窗口高度
const chatBoxHeight = ref(0) // 聊天内容框高度
const chatListHeight = ref(0) // 聊天列表高度
const loading = ref(false)
const loginUser = ref(null)
const roles = ref([])
const router = useRouter()
const roleId = ref(0)
const chatId = ref()
const newChatItem = ref(null)
const isLogin = ref(false)
const showHello = ref(true)
const inputRef = ref(null)
const textHeightRef = ref(null)

const store = useSharedStore()
const row = ref(1)
const showChatSetting = ref(false)
const listStyle = ref(store.chatListStyle)
const config = ref({ advance_voice_power: 0 })
const voiceChatUrl = ref('')
const modelSearchKeyword = ref('') // 模型搜索关键词
const selectedCategory = ref('')
const modelCategories = ref([])
const groupedModels = ref([])
const activeCategory = ref('') // 当前激活的分类标签
const showFreeModelsOnly = ref(false) // 是否只显示免费模型

const tools = ref([])
const toolSelected = ref([])
const stream = ref(store.chatStream)
const modelSelectorRef = ref(null)
const showModelSelector = ref(false)
const showToolsDropdown = ref(false)
const activeDropdown = ref(null)
// 过滤后的模型列表
const filteredModels = computed(() => {
  if (!modelSearchKeyword.value && !showFreeModelsOnly.value && !activeCategory.value) {
    return models.value
  }

  return models.value.filter((model) => {
    // 搜索关键词匹配
    const matchesSearch =
      !modelSearchKeyword.value ||
      model.name.toLowerCase().includes(modelSearchKeyword.value.toLowerCase()) ||
      (model.description &&
        model.description.toLowerCase().includes(modelSearchKeyword.value.toLowerCase()))

    // 分类匹配
    const matchesCategory = !activeCategory.value || model.tag === activeCategory.value

    // 免费模型匹配
    const matchesFree = !showFreeModelsOnly.value || model.power <= 0

    return matchesSearch && matchesCategory && matchesFree
  })
})

// 最终展示的模型列表
const displayedModels = computed(() => {
  return filteredModels.value
})

// 切换是否只显示免费模型
const toggleFreeModels = () => {
  showFreeModelsOnly.value = !showFreeModelsOnly.value
  if (showFreeModelsOnly.value) {
    activeCategory.value = ''
  }
}

// 提取所有模型分类
const updateModelCategories = () => {
  const categories = new Set()
  models.value.forEach((model) => {
    if (model.tag) {
      categories.add(model.tag)
    }
  })
  modelCategories.value = Array.from(categories)
}

// 按分类对模型进行分组
const updateGroupedModels = () => {
  const filtered = filteredModels.value

  // 如果已经指定分类，则只显示该分类
  if (selectedCategory.value) {
    groupedModels.value = [
      {
        category: selectedCategory.value,
        models: filtered,
      },
    ]
    return
  }

  // 否则按分类分组展示
  const groups = {}
  filtered.forEach((model) => {
    const category = model.tag || '未分类'
    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push(model)
  })

  groupedModels.value = Object.keys(groups).map((category) => ({
    category,
    models: groups[category],
  }))

  // 对分组进行排序（未分类放最后）
  groupedModels.value.sort((a, b) => {
    if (a.category === '未分类') return 1
    if (b.category === '未分类') return -1
    return a.category.localeCompare(b.category)
  })
}

// 当筛选条件变化时更新分组
watch([filteredModels, selectedCategory], () => {
  updateGroupedModels()
})

// 监听模型数据变化，更新分类列表
watch(
  () => models.value,
  () => {
    updateModelCategories()
    updateGroupedModels()
  },
  { deep: true }
)

// 获取选中的模型名称
const getSelectedModelName = () => {
  const model = getSelectedModel()
  return model ? model.name : '选择模型'
}

// 获取选中的模型
const getSelectedModel = () => {
  return models.value.find((model) => model.id === modelID.value)
}

// 选择模型
const selectModel = (model) => {
  modelID.value = model.id
  showModelSelector.value = false
  _newChat()
}

const toggleDropdown = (chat) => {
  activeDropdown.value = activeDropdown.value === chat.chat_id ? null : chat.chat_id
}

// 根据算力获取标签类型
const getTagType = (power) => {
  const powerNum = Number(power)
  if (powerNum <= 5) return 'info'
  if (powerNum <= 15) return 'warning'
  return 'danger'
}

watch(
  () => store.chatListStyle,
  (newValue) => {
    listStyle.value = newValue
  }
)

watch(
  () => store.chatStream,
  (newValue) => {
    stream.value = newValue
  }
)

if (isMobile()) {
  router.push('/mobile/chat')
}

// 初始化角色ID参数
if (router.currentRoute.value.query.role_id) {
  roleId.value = parseInt(router.currentRoute.value.query.role_id)
}

// 初始化 ChatID
chatId.value = router.currentRoute.value.params.id
if (!chatId.value) {
  chatId.value = UUID()
} else {
  // 查询对话信息
  httpGet('/api/chat/detail', { chat_id: chatId.value })
    .then((res) => {
      document.title = res.data.title
      roleId.value = res.data.role_id
      modelID.value = res.data.model_id
    })
    .catch((e) => {
      console.error('获取对话信息失败：' + e.message)
    })
}

// 获取系统配置
getSystemInfo()
  .then((res) => {
    config.value = res.data
    title.value = config.value.title
    logo.value = res.data.bar_logo
  })
  .catch((e) => {
    showMessageError('获取系统配置失败：' + e.message)
  })

// 获取工具函数
httpGet('/api/function/list')
  .then((res) => {
    tools.value = res.data
  })
  .catch((e) => {
    showMessageError('获取工具函数失败：' + e.message)
  })

const prompt = ref('')
const isGenerating = ref(false)
const lineBuffer = ref('') // 输出缓冲行
const isNewMsg = ref(true)
const abortController = ref(null)

onMounted(() => {
  resizeElement()
  initData()

  const clipboard = new Clipboard('.copy-reply, .copy-code-btn')
  clipboard.on('success', () => {
    showMessageSuccess('复制成功！')
  })

  clipboard.on('error', () => {
    showMessageError('复制失败！')
  })

  window.onresize = () => resizeElement()
})

// 初始化数据
const initData = async () => {
  try {
    // 获取角色列表
    const roleRes = await httpGet('/api/app/list')
    roles.value = roleRes.data
    if (roles.value.length > 0 && !roleId.value) {
      roleId.value = roles.value[0].id
    }

    // 获取模型列表
    const modelRes = await httpGet('/api/model/list')
    models.value = modelRes.data
    if (models.value.length > 0) {
      modelID.value = models.value[0].id
    }

    // 获取用户信息
    const user = await checkSession()
    loginUser.value = user
    isLogin.value = true

    // 获取聊天列表
    const chatRes = await httpGet('/api/chat/list')
    allChats.value = chatRes.data
    chatList.value = allChats.value
    if (chatId.value) {
      loadChatHistory(chatId.value)
    }
  } catch (error) {
    if (error.response?.status === 401) {
      isLogin.value = false
    } else {
      console.warn('初始化数据失败：' + error.message)
    }
  }
}
abortController.value = new AbortController()
// 发送 SSE 请求
const sendSSERequest = async (message) => {
  isGenerating.value = true
  try {
    await fetchEventSource('/api/chat/message', {
      method: 'POST',
      headers: {
        Authorization: getUserToken(),
      },
      body: JSON.stringify(message),
      openWhenHidden: true,
      // 重试机制，避免连接断开后一直重试
      retry: 3000,
      // 设置重试延迟为0，确保不重试
      retryDelay: 3000,
      // 设置最大重试次数为0
      maxRetries: 3,
      signal: abortController.value.signal,
      onopen(response) {
        if (response.ok && response.status === 200) {
          console.log('SSE connection opened')
        } else {
          console.error('SSE connection failed', response)
          isGenerating.value = false
        }
      },
      onmessage(msg) {
        try {
          const data = JSON.parse(msg.data)
          if (data.type === 'error') {
            const reply = chatData.value[chatData.value.length - 1]
            if (reply) {
              reply['content'].text = `<div class="text-red-500 rounded-md">${data.body}</div>`
            }
            isGenerating.value = false
            return
          }

          if (data.type === 'end') {
            isGenerating.value = false
            lineBuffer.value = '' // 清空缓冲

            // 获取 token
            const reply = chatData.value[chatData.value.length - 1]
            httpPost('/api/chat/tokens', {
              text: '',
              model: getModelValue(modelID.value),
              chat_id: chatId.value,
            })
              .then((res) => {
                reply['created_at'] = new Date().getTime()
                reply['tokens'] = res.data
                // 将聊天框的滚动条滑动到最底部
                nextTick(() => {
                  document
                    .getElementById('chat-box')
                    .scrollTo(0, document.getElementById('chat-box').scrollHeight)
                })
              })
              .catch(() => {})
            isNewMsg.value = true
            tmpChatTitle.value = message.prompt
            console.log('chatData.value', chatData.value)
            // 判断 chatlist 中指定的 chat_id 是否存在
            const chat = chatList.value.find((chat) => chat.chat_id === chatId.value)
            if (!chat) {
              const _role = getRoleById(roleId.value)
              chatList.value.unshift({
                chat_id: chatId.value,
                title: substr(message.prompt, 15),
                role_id: roleId.value,
                model_id: modelID.value,
                icon: _role.icon,
                created_at: new Date().getTime(),
                updated_at: new Date().getTime(),
              })
            }
            return
          }

          if (data.type === 'text') {
            if (isNewMsg.value) {
              isNewMsg.value = false
              lineBuffer.value = data.body
              const reply = chatData.value[chatData.value.length - 1]
              if (reply) {
                reply['content'].text = lineBuffer.value
              }
            } else {
              lineBuffer.value += data.body
              const reply = chatData.value[chatData.value.length - 1]
              if (reply) {
                reply['content'].text = lineBuffer.value
              }
            }
          }

          // 回答完毕，更新完整的消息内容
          if (data.type === 'complete') {
            chatData.value[chatData.value.length - 1] = data.body
          }

          // 将聊天框的滚动条滑动到最底部
          nextTick(() => {
            document
              .getElementById('chat-box')
              .scrollTo(0, document.getElementById('chat-box').scrollHeight)
            localStorage.setItem('chat_id', chatId.value)
          })
        } catch (error) {
          console.error('Error processing message:', error)
          isGenerating.value = false
          showMessageError('消息处理出错，请重试')
        }
      },
      onerror(err) {
        console.error('SSE Error:', err)
        try {
          abortController.value && abortController.value.abort()
        } catch (e) {
          console.error('AbortController abort error:', e)
        }
        isGenerating.value = false
        // ElMessage.error('连接已断开，发生错误：' + err.message)
        const reply = chatData.value[chatData.value.length - 1]
        if (reply) {
          reply['content'].text = `<div class="text-red-500 rounded-md">${err.message}</div>`
        }
      },
      onclose() {
        console.log('SSE connection closed')
        isGenerating.value = false
      },
    })
  } catch (error) {
    console.error('Failed to send message:', error)
    isGenerating.value = false
    showMessageError('发送消息失败，请重试')
  }
}

// 发送消息
const sendMessage = (messageId = 0) => {
  if (!isLogin.value) {
    console.log('未登录')
    store.setShowLoginDialog(true)
    return
  }

  if (isGenerating.value) {
    ElMessage.warning('AI 正在作答中，请稍后...')
    return
  }

  if (prompt.value === '') {
    showMessageError('请输入要发送的消息！')
    return false
  }

  // 追加消息
  chatData.value.push({
    type: 'prompt',
    id: 0,
    icon: loginUser.value.avatar,
    content: {
      text: prompt.value,
      files: files.value,
    },
    model: getModelValue(modelID.value),
    created_at: new Date().getTime() / 1000,
  })

  // 添加空回复消息
  const _role = getRoleById(roleId.value)
  chatData.value.push({
    chat_id: chatId,
    role_id: roleId.value,
    type: 'reply',
    id: randString(32),
    icon: _role['icon'],
    content: {
      text: '',
      files: [],
    },
  })

  nextTick(() => {
    document
      .getElementById('chat-box')
      .scrollTo(0, document.getElementById('chat-box').scrollHeight)
  })

  showHello.value = false

  // 异步发送 SSE 请求
  sendSSERequest({
    user_id: loginUser.value.id,
    role_id: roleId.value,
    model_id: modelID.value,
    chat_id: chatId.value,
    prompt: prompt.value,
    tools: toolSelected.value,
    stream: stream.value,
    files: files.value,
    last_msg_id: messageId || 0,
  })

  prompt.value = ''
  files.value = []
  row.value = 1
}

const getRoleById = function (rid) {
  for (let i = 0; i < roles.value.length; i++) {
    if (roles.value[i]['id'] === rid) {
      return roles.value[i]
    }
  }
  return null
}

const resizeElement = function () {
  chatListHeight.value = window.innerHeight - 240
  mainWinHeight.value = window.innerHeight - 50
  chatBoxHeight.value = window.innerHeight - 101 - 82 - 38
}

const _newChat = () => {
  if (isLogin.value) {
    chatId.value = UUID()
    newChat()
  }
}
const disableModel = ref(false)
// 新建会话
const newChat = () => {
  if (!isLogin.value) {
    store.setShowLoginDialog(true)
    return
  }

  const role = getRoleById(roleId.value)
  showHello.value = role.key === 'gpt'
  // if the role bind a model, disable model change
  disableModel.value = false
  if (role.model_id > 0) {
    modelID.value = role.model_id
    disableModel.value = true
  }
  // 已有新开的会话
  if (newChatItem.value !== null && newChatItem.value['role_id'] === roles.value[0]['role_id']) {
    return
  }

  // 获取当前聊天角色图标
  let icon = ''
  roles.value.forEach((item) => {
    if (item['id'] === roleId.value) {
      icon = item['icon']
    }
  })
  newChatItem.value = {
    chat_id: '',
    icon: icon,
    role_id: roleId.value,
    model_id: modelID.value,
    title: '',
    edit: false,
    removing: false,
  }
  isGenerating.value = false
  loadChatHistory(chatId.value)
  router.push(`/chat/${chatId.value}`)
}

// 切换会话
const loadChat = function (chat) {
  if (!isLogin.value) {
    store.setShowLoginDialog(true)
    return
  }

  if (chatId.value === chat.chat_id) {
    return
  }
  newChatItem.value = null
  roleId.value = chat.role_id
  modelID.value = chat.model_id
  chatId.value = chat.chat_id
  isGenerating.value = false
  loadChatHistory(chatId.value)
  router.push(`/chat/${chatId.value}`)
}

// 编辑会话标题
const tmpChatTitle = ref('')
const editChatTitle = (chat) => {
  chat.edit = true
  tmpChatTitle.value = chat.title
  nextTick(() => {
    document.getElementById('chat-' + chat.chat_id).focus()
  })
}

const titleKeydown = (e, chat) => {
  if (e.keyCode === 13) {
    e.stopPropagation()
    editConfirm(chat)
  }
}

const stopPropagation = (e) => {
  e.stopPropagation()
}
// 确认修改
const editConfirm = function (chat) {
  if (tmpChatTitle.value === '') {
    return showMessageError('请输入会话标题！')
  }
  if (!chat.chat_id) {
    return showMessageError('对话 ID 为空，请刷新页面再试！')
  }
  if (tmpChatTitle.value === chat.title) {
    chat.edit = false
    return
  }

  httpPost('/api/chat/update', {
    chat_id: chat.chat_id,
    title: tmpChatTitle.value,
  })
    .then(() => {
      chat.title = tmpChatTitle.value
      chat.edit = false
    })
    .catch((e) => {
      showMessageError('操作失败：' + e.message)
    })
}
// 删除会话
const removeChat = function (chat) {
  showConfirmDialog({
    title: '删除聊天',
    message: `该操作会删除"${chat.title}"`,
  })
    .then(() => {
      httpGet('/api/chat/remove?chat_id=' + chat.chat_id)
        .then(() => {
          chatList.value = removeArrayItem(chatList.value, chat, function (e1, e2) {
            return e1.id === e2.id
          })
          // 重置会话
          _newChat()
        })
        .catch((e) => {
          showMessageError('操作失败：' + e.message)
        })
    })
    .catch(() => {})
}

const onInput = (e) => {
  // 根据输入的内容自动计算输入框的行数
  const lineHeight = parseFloat(window.getComputedStyle(inputRef.value).lineHeight)
  textHeightRef.value.style.width = inputRef.value.clientWidth + 'px' // 设定宽度和 textarea 相同
  const lines = Math.floor(textHeightRef.value.clientHeight / lineHeight)
  inputRef.value.scrollTo(0, inputRef.value.scrollHeight)
  if (prompt.value.length < 10) {
    row.value = 1
  } else if (lines <= 7) {
    row.value = lines
  } else {
    row.value = 7
  }

  // 输入回车自动提交
  if (e.keyCode === 13) {
    // Shift + Enter 换行
    if (e.shiftKey) {
      return
    }
    e.preventDefault()
    sendMessage()
  }
}

// 自动填充 prompt
const autofillPrompt = (text) => {
  prompt.value = text
  inputRef.value.focus()
  sendMessage()
}

const clearAllChats = function () {
  showConfirmDialog({
    title: '警告',
    message: '清除所有对话?此操作不可撤销！',
  })
    .then(() => {
      httpGet('/api/chat/clear')
        .then(() => {
          showMessageSuccess('操作成功！')
          chatData.value = []
          chatList.value = []
          newChat()
        })
        .catch((e) => {
          showMessageError('操作失败：' + e.message)
        })
    })
    .catch(() => {})
}

const loadChatHistory = function (chatId) {
  chatData.value = []
  loading.value = true
  httpGet('/api/chat/history?chat_id=' + chatId)
    .then((res) => {
      loading.value = false
      const data = res.data
      if ((!data || data.length === 0) && chatData.value.length === 0) {
        // 加载打招呼信息
        const _role = getRoleById(roleId.value)
        chatData.value.push({
          chat_id: chatId,
          role_id: roleId.value,
          type: 'reply',
          id: 0,
          icon: _role['icon'],
          isHello: true,
          content: {
            text: _role['hello_msg'],
            files: [],
          },
        })
        return
      }
      showHello.value = false
      for (let i = 0; i < data.length; i++) {
        if (data[i].type === 'reply' && i > 0) {
          data[i].prompt = data[i - 1].content
        }
        chatData.value.push(data[i])
      }

      nextTick(() => {
        document
          .getElementById('chat-box')
          .scrollTo(0, document.getElementById('chat-box').scrollHeight)
      })
    })
    .catch((e) => {
      // TODO: 显示重新加载按钮
      showMessageError('加载聊天记录失败：' + e.message)
    })
}

// 停止生成
const stopGenerate = function () {
  if (abortController.value) {
    abortController.value.abort()
    isGenerating.value = false
    httpGet('/api/chat/stop?session_id=' + getClientId())
      .then(() => {
        showMessageInfo('会话已中断')
      })
      .catch((e) => {
        showMessageError('中断对话失败:' + e.message)
      })
  }
}

// 重新生成
const reGenerate = function (messageId) {
  // 恢复发送按钮状态
  if (isGenerating.value) {
    showMessageInfo('AI 正在作答中，请稍后...')
    return
  }

  console.log('messageId', messageId)
  console.log('chatData.value', chatData.value)

  // 判断 messageId 是整数
  if (messageId !== '' && isNaN(messageId)) {
    showMessageInfo('消息 ID 不合法，无法重新生成')
    return
  }

  chatData.value = chatData.value.filter((item) => item.id < messageId && !item.isHello)
  const userPrompt = chatData.value.pop()
  prompt.value = userPrompt.content.text
  sendMessage(messageId)
  // 将光标定位到输入框并聚焦
  nextTick(() => {
    if (inputRef.value) {
      inputRef.value.focus()
      // 触发输入事件以更新文本高度
      onInput({ keyCode: null })
    }
  })
}

// 编辑用户消息
const editUserPrompt = function (messageId) {
  // 找到要编辑的消息及其索引
  let messageIndex = -1
  let messageContent = ''

  for (let i = 0; i < chatData.value.length; i++) {
    if (chatData.value[i].id === messageId) {
      messageIndex = i
      messageContent = chatData.value[i].content
      break
    }
  }

  if (messageIndex === -1) return

  editMessageIndex.value = messageIndex
  editMessageContent.value = messageContent
  showEditDialog.value = true
}

// 编辑对话框
const showEditDialog = ref(false)
const editMessageIndex = ref(0)
const editMessageContent = ref('')

const confirmEdit = () => {
  if (editMessageContent.value.trim() === '') {
    showMessageInfo('消息内容不能为空')
    return
  }

  // 更新用户消息
  chatData.value[editMessageIndex.value].content = editMessageContent.value

  // 移除该消息之后的所有消息
  chatData.value = chatData.value.slice(0, editMessageIndex.value + 1)

  // 添加空回复消息
  const _role = getRoleById(roleId.value)
  chatData.value.push({
    chat_id: chatId,
    role_id: roleId.value,
    type: 'reply',
    id: randString(32),
    icon: _role['icon'],
    content: '',
  })

  showEditDialog.value = false
}

const chatName = ref('')
// 搜索会话
const searchChat = function (e) {
  if (chatName.value === '') {
    chatList.value = allChats.value
    return
  }
  if (e.keyCode === 13) {
    const items = []
    for (let i = 0; i < allChats.value.length; i++) {
      if (allChats.value[i].title.toLowerCase().indexOf(chatName.value.toLowerCase()) !== -1) {
        items.push(allChats.value[i])
      }
    }
    chatList.value = items
  }
}

// 导出会话
const shareChat = (chat) => {
  if (!chat.chat_id) {
    return showMessageError('请先选中一个会话')
  }

  const url = location.protocol + '//' + location.host + '/chat/export?chat_id=' + chat.chat_id
  window.open(url, '_blank')
}

const getModelValue = (model_id) => {
  for (let i = 0; i < models.value.length; i++) {
    if (models.value[i].id === model_id) {
      return models.value[i].value
    }
  }
  return ''
}

const files = ref([])
// 插入文件
const insertFile = (file) => {
  files.value.push(file)
}
const removeFile = (file) => {
  files.value = removeArrayItem(files.value, file, (v1, v2) => v1.url === v2.url)
}

// 实时语音对话
const showConversationDialog = ref(false)
// const conversationRef = ref(null);
// const dialogHeight = ref(window.innerHeight - 75);
const frameLoaded = ref(false)
const realtimeChat = () => {
  if (!isLogin.value) {
    store.setShowLoginDialog(true)
    return
  }
  showLoading('正在连接...')
  httpPost('/api/realtime/voice')
    .then((res) => {
      voiceChatUrl.value = res.data
      showConversationDialog.value = true
      closeLoading()
    })
    .catch((e) => {
      showMessageError('连接失败：' + e.message)
      closeLoading()
    })
}

// const hangUp = () => {
//   showConversationDialog.value = false;
//   conversationRef.value.hangUp();
// };
</script>

<style scoped lang="scss">
@use '@/assets/css/chat-plus.scss' as *;
</style>

<style lang="scss">
@use '@/assets/css/markdown/vue.css' as *;
</style>
