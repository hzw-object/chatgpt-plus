<template>
  <div class="page-suno flex h-[calc(100vh-60px)]">
    <!-- Left Sidebar - Settings -->
    <div class="left-bar w-80 flex-shrink-0 overflow-y-auto p-4 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700">
      <div class="space-y-6">
        <!-- Custom Mode Toggle -->
        <div class="setting-card bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <span class="card-title text-slate-900 dark:text-slate-100 font-medium">自定义模式</span>
              <p class="card-description text-sm text-slate-500">可以更精确地控制生成内容</p>
            </div>
            <button
              @click="store.custom = !store.custom"
              :class="store.custom ? 'bg-violet-600' : 'bg-slate-300'"
              class="relative w-12 h-6 rounded-full transition-colors"
            >
              <span
                :class="store.custom ? 'translate-x-6' : 'translate-x-1'"
                class="absolute top-1 w-4 h-4 bg-white rounded-full transition-transform"
              ></span>
            </button>
          </div>
        </div>

        <!-- Model Selection -->
        <div class="setting-card bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
          <div class="flex items-center justify-between mb-3">
            <label class="card-label text-slate-700 dark:text-slate-300 font-medium">选择模型</label>
            <span class="help-icon text-slate-400 cursor-help" title="选择不同的模型，可以获得不同的生成效果">
              <i class="iconfont icon-tips"></i>
            </span>
          </div>
          <select
            v-model="store.data.model"
            class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
          >
            <option v-for="model in store.models" :key="model.value" :value="model.value">
              {{ model.label }}
            </option>
          </select>
        </div>

        <!-- Instrumental Toggle -->
        <div class="setting-card bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <span class="card-title text-slate-900 dark:text-slate-100 font-medium">纯音乐</span>
              <p class="card-description text-sm text-slate-500">生成不包含人声的音乐</p>
            </div>
            <button
              @click="store.data.instrumental = !store.data.instrumental"
              :class="store.data.instrumental ? 'bg-violet-600' : 'bg-slate-300'"
              class="relative w-12 h-6 rounded-full transition-colors"
            >
              <span
                :class="store.data.instrumental ? 'translate-x-6' : 'translate-x-1'"
                class="absolute top-1 w-4 h-4 bg-white rounded-full transition-transform"
              ></span>
            </button>
          </div>
        </div>

        <!-- Custom Mode Content -->
        <div v-if="store.custom" class="space-y-6">
          <!-- Lyrics Input -->
          <div v-if="!store.data.instrumental" class="setting-card bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
            <div class="flex items-center justify-between mb-3">
              <label class="card-label text-slate-700 dark:text-slate-300 font-medium">歌词</label>
              <span class="help-icon text-slate-400 cursor-help" title="自己写歌词或寻求 AI 的帮助。使用两节歌词（8 行）可获得最佳效果。">
                <i class="iconfont icon-tips"></i>
              </span>
            </div>
            <div class="relative">
              <textarea
                v-model="store.data.lyrics"
                :rows="8"
                :maxlength="1024"
                :placeholder="store.promptPlaceholder"
                class="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 resize-none mb-3"
              />
              <div class="flex justify-end text-xs text-slate-500 mb-2">
                {{ store.data.lyrics.length }}/1024
              </div>
              <div class="flex justify-end">
                <button
                  @click="store.createLyric"
                  :disabled="store.isGenerating"
                  class="lyric-btn px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg flex items-center gap-2 disabled:bg-slate-400"
                >
                  <i class="iconfont icon-magic text-xs"></i>
                  <span v-if="!store.isGenerating">生成歌词</span>
                  <span v-else class="flex items-center space-x-1">
                    <i class="iconfont icon-loading animate-spin text-xs"></i>
                    <span>生成中...</span>
                  </span>
                </button>
              </div>
            </div>
          </div>

          <!-- Music Style -->
          <div class="setting-card bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
            <div class="flex items-center justify-between mb-3">
              <label class="card-label text-slate-700 dark:text-slate-300 font-medium">音乐风格</label>
              <span class="help-icon text-slate-400 cursor-help" title="描述您想要的音乐风格（例如：原声流行音乐）">
                <i class="iconfont icon-tips"></i>
              </span>
            </div>
            <textarea
              v-model="store.data.tags"
              :rows="3"
              :maxlength="120"
              placeholder="请输入音乐风格，多个风格之间用英文逗号隔开..."
              class="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 resize-none mb-4"
            />
            <div class="flex flex-wrap gap-2">
              <button
                v-for="tag in store.tags"
                :key="tag.value"
                @click="store.selectTag(tag)"
                class="tag-btn px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-sm hover:bg-violet-100 dark:hover:bg-violet-900"
              >
                {{ tag.label }}
              </button>
            </div>
          </div>

          <!-- Song Title -->
          <div class="setting-card bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
            <div class="flex items-center justify-between mb-3">
              <label class="card-label text-slate-700 dark:text-slate-300 font-medium">歌曲名称</label>
              <span class="help-icon text-slate-400 cursor-help" title="给你的歌曲起一个标题">
                <i class="iconfont icon-tips"></i>
              </span>
            </div>
            <input
              v-model="store.data.title"
              type="text"
              placeholder="请输入歌曲名称..."
              maxlength="100"
              class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        <!-- Simple Mode Content -->
        <div v-else class="setting-card bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
          <div class="flex items-center justify-between mb-3">
            <label class="card-label text-slate-700 dark:text-slate-300 font-medium">歌曲描述</label>
          </div>
          <textarea
            v-model="store.data.prompt"
            :rows="8"
            :maxlength="1024"
            placeholder="描述您想要的音乐风格和主题（例如：关于假期的流行音乐）。请使用流派和氛围，而不是特定的艺术家和歌曲风格，AI无法识别。"
            class="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 resize-none"
          />
        </div>

        <!-- Extend Song -->
        <div v-if="store.refSong" class="setting-card bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
          <div class="flex items-center justify-between mb-3">
            <h3 class="card-title text-slate-900 dark:text-slate-100 font-medium">续写歌曲</h3>
            <button @click="store.removeRefSong" class="remove-btn text-red-500 hover:text-red-600">移除</button>
          </div>
          <div class="space-y-3">
            <div class="flex justify-between text-sm">
              <span class="text-slate-500">歌曲名称：</span>
              <span class="text-violet-600 font-medium">{{ store.refSong.title }}</span>
            </div>
            <div>
              <label class="block text-sm text-slate-500 font-medium mb-2">续写开始时间(秒)</label>
              <input
                v-model="store.refSong.extend_secs"
                type="number"
                placeholder="从第几秒开始续写"
                class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>
        </div>

        <!-- Generate Button -->
        <div class="setting-card bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
          <button
            @click="store.create"
            :disabled="store.loading"
            class="w-full py-3 bg-gradient-to-r from-violet-500 to-violet-700 text-white rounded-xl disabled:from-slate-400 disabled:to-slate-400 disabled:cursor-not-allowed hover:from-violet-600 hover:to-violet-800 transition-all flex items-center justify-center gap-2"
          >
            <i v-if="store.loading" class="iconfont icon-loading animate-spin"></i>
            <i v-else class="iconfont icon-chuangzuo"></i>
            <span>{{ store.loading ? '创作中...' : store.btnText }} ({{ store.sunoPower }}算力)</span>
          </button>
        </div>

        <!-- Upload Music -->
        <div class="setting-card bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
          <div class="flex items-center justify-between mb-3">
            <label class="card-label text-slate-700 dark:text-slate-300 font-medium">上传音乐文件</label>
            <span class="help-icon text-slate-400 cursor-help" title="上传你自己的音乐文件，然后进行二次创作">
              <i class="iconfont icon-tips"></i>
            </span>
          </div>

          <div class="w-full py-2">
            <button
              @click="triggerUpload"
              class="w-full py-3 bg-gradient-to-r from-violet-400 to-red-400 text-white rounded-xl hover:from-violet-500 hover:to-red-500 transition-all flex items-center justify-center gap-2"
            >
              <i class="iconfont icon-upload"></i>
              <span>上传音乐</span>
            </button>
            <input ref="fileInput" type="file" accept=".wav,.mp3" class="hidden" @change="handleFileUpload" />
          </div>

          <div class="upload-tips text-xs text-slate-500 mt-3 space-y-1">
            <p>• 上传你自己的音乐文件，然后进行二次创作</p>
            <p>• 请上传6-60秒的原始音频</p>
            <p>• 检测到人声的音频将仅设为私人音频</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Sidebar - Song List -->
    <div class="right-box flex-1 overflow-y-auto p-4 bg-slate-100 dark:bg-slate-950">
      <!-- Loading Overlay -->
      <div v-if="store.loading" class="absolute inset-0 bg-slate-500/30 flex items-center justify-center z-10">
        <div class="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
      </div>

      <div class="list-box space-y-4" v-if="!store.noData">
        <div v-for="item in store.list" :key="item.id" class="song-card bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
          <div class="flex space-x-4">
            <div class="flex-shrink-0">
              <div class="song-cover w-20 h-20 relative rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700">
                <img v-if="item.cover_url" :src="item.cover_url" class="w-full h-full object-cover" />
                <div v-else class="w-full h-full flex items-center justify-center">
                  <i class="iconfont icon-mp3 text-slate-400 dark:text-slate-500 text-xl"></i>
                </div>
                <button v-if="item.progress === 100" @click="play(item)" class="play-overlay absolute inset-0 bg-black/50 flex items-center justify-center">
                  <i class="iconfont icon-play text-white text-xl"></i>
                </button>
                <div v-if="item.progress < 100 && item.progress !== 101" class="progress-overlay absolute inset-0 bg-black/50 flex items-center justify-center">
                  <i class="iconfont icon-loading animate-spin text-violet-500 dark:text-violet-400 text-xl"></i>
                </div>
                <div v-if="item.progress === 101" class="error-overlay absolute inset-0 bg-black/50 flex items-center justify-center">
                  <i class="iconfont icon-warning text-red-500 text-xl"></i>
                </div>
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <h3 class="song-title text-lg font-medium text-slate-900 dark:text-slate-100">
                    <a :href="'/song/' + item.song_id" target="_blank" class="song-link hover:text-violet-600">
                      {{ item.title || '未命名歌曲' }}
                    </a>
                  </h3>
                  <p class="song-description text-sm text-slate-500 dark:text-slate-400 truncate">
                    {{ item.tags || item.prompt }}
                  </p>
                </div>
                <div v-if="item.progress < 100" class="task-status text-sm">
                  <div v-if="item.progress === 101" class="status-error text-red-500 flex items-center gap-1">
                    <i class="iconfont icon-warning"></i>
                    <span>失败</span>
                  </div>
                  <div v-else class="status-loading text-violet-500 dark:text-violet-400 flex items-center gap-1">
                    <div class="w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
                    <span>生成中</span>
                  </div>
                </div>
              </div>
              <div class="song-tags flex flex-wrap gap-2 mt-2">
                <span v-if="item.major_model_version" class="model-tag px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded text-xs">
                  {{ item.major_model_version }}
                </span>
                <span v-if="item.type === 4" class="upload-tag px-2 py-0.5 bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300 rounded text-xs">
                  <i class="iconfont icon-upload mr-1"></i>用户上传
                </span>
                <span v-if="item.type === 3" class="full-song-tag px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 rounded text-xs">
                  <i class="iconfont icon-mp3 mr-1"></i>完整歌曲
                </span>
                <span v-if="item.ref_song" class="extend-tag px-2 py-0.5 bg-violet-100 dark:bg-violet-900 text-violet-600 dark:text-violet-300 rounded text-xs">
                  <i class="iconfont icon-link mr-1"></i>续写
                </span>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="song-actions flex flex-wrap gap-2 mt-4">
            <div class="flex gap-2">
              <button v-if="item.progress === 100" @click="play(item)" class="action-btn play-btn px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm flex items-center gap-1">
                <i class="iconfont icon-play text-xs"></i>
                <span>播放</span>
              </button>
              <button v-if="item.progress === 100" @click="store.download(item)" :disabled="item.downloading" class="action-btn download-btn px-3 py-1.5 bg-violet-500 hover:bg-violet-600 text-white rounded-lg text-sm flex items-center gap-1 disabled:bg-slate-400">
                <i v-if="!item.downloading" class="iconfont icon-download text-xs"></i>
                <i v-else class="iconfont icon-loading animate-spin text-xs"></i>
                <span>{{ item.downloading ? '下载中...' : '下载' }}</span>
              </button>
              <button v-if="item.progress === 100 && item.ref_song" @click="store.merge(item)" class="action-btn merge-btn px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm flex items-center gap-1">
                <i class="iconfont icon-concat text-xs"></i>
                <span>合并</span>
              </button>
              <button v-if="item.progress !== 101" @click="store.extend(item)" class="action-btn extend-btn px-3 py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg text-sm flex items-center gap-1">
                <i class="iconfont icon-edit text-xs"></i>
                <span>续写</span>
              </button>
            </div>
            <div class="flex gap-2">
              <button v-if="item.progress !== 101" @click="store.update(item)" class="action-btn edit-btn px-3 py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg text-sm flex items-center gap-1">
                <i class="iconfont icon-edit text-xs"></i>
                <span>编辑</span>
              </button>
              <button @click="store.removeJob(item)" class="action-btn delete-btn px-3 py-1.5 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-lg text-sm flex items-center gap-1">
                <i class="iconfont icon-remove text-xs"></i>
                <span>删除</span>
              </button>
            </div>
          </div>

          <!-- Progress Bar -->
          <div v-if="item.progress < 100 && item.progress !== 101" class="progress-bar mt-3">
            <div class="progress-info flex justify-between text-xs text-slate-500 mb-1">
              <span>生成进度</span>
              <span>{{ item.progress }}%</span>
            </div>
            <div class="progress-track h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div class="progress-fill h-full bg-violet-500 transition-all" :style="{ width: item.progress + '%' }"></div>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="item.progress === 101" class="error-message mt-3 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <p class="error-text text-sm text-red-600 dark:text-red-400">{{ item.err_msg || '未知错误' }}</p>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-16 text-slate-400">
        <i class="iconfont icon-empty text-6xl mb-4"></i>
        <p class="text-lg">没有任何作品，赶紧去创作吧！</p>
      </div>

      <!-- Pagination -->
      <div v-if="store.total > store.pageSize" class="pagination flex justify-center mt-6">
        <div class="flex gap-2">
          <button
            v-for="p in Math.ceil(store.total / store.pageSize)"
            :key="p"
            @click="store.fetchData(p)"
            :class="store.page === p ? 'bg-violet-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'"
            class="px-3 py-1.5 rounded-lg text-sm"
          >
            {{ p }}
          </button>
        </div>
      </div>

      <!-- Music Player -->
      <div v-if="store.showPlayer" class="music-player fixed bottom-4 right-4 z-50">
        <music-player :songs="store.playList" ref="playerRef" :show-close="true" @close="store.showPlayer = false" />
      </div>
    </div>

    <!-- Edit Dialog -->
    <teleport to="body">
      <div v-if="store.showDialog" class="fixed inset-0 bg-black/50 z-40 flex items-center justify-center" @click.self="store.showDialog = false">
        <div class="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100">修改歌曲</h3>
            <button @click="store.showDialog = false" class="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
              <i class="iconfont icon-close"></i>
            </button>
          </div>
          <form class="form space-y-4">
            <div class="form-item">
              <div class="label text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">歌曲名称</div>
              <input v-model="store.editData.title" type="text" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100" />
            </div>
            <div class="form-item">
              <div class="label text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">封面图片</div>
              <div class="flex items-center gap-4">
                <button @click="triggerCoverUpload" class="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg">
                  上传封面
                </button>
                <img v-if="store.editData.cover" :src="store.editData.cover" class="w-20 h-20 rounded-lg object-cover" />
              </div>
              <input ref="coverInput" type="file" accept=".png,.jpg,.jpeg,.bmp" class="hidden" @change="handleCoverUpload" />
            </div>
          </form>
          <div class="flex justify-end gap-3 mt-6">
            <button @click="store.showDialog = false" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg">取消</button>
            <button @click="store.updateSong" class="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg">确认</button>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import MusicPlayer from '@/components/MusicPlayer.vue'
import { checkSession } from '@/store/cache'
import { useSunoStore } from '@/store/suno'
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

const store = useSunoStore()
const playerRef = ref(null)
const fileInput = ref(null)
const coverInput = ref(null)

const play = (item) => {
  store.playList = [item]
  store.showPlayer = true
  nextTick(() => playerRef.value.play())
}

const triggerUpload = () => {
  fileInput.value?.click()
}

const handleFileUpload = (e) => {
  const file = e.target.files?.[0]
  if (file) {
    store.uploadAudio({ file })
  }
}

const triggerCoverUpload = () => {
  coverInput.value?.click()
}

const handleCoverUpload = (e) => {
  const file = e.target.files?.[0]
  if (file) {
    store.uploadCover({ file })
  }
}

watch(
  () => store.custom,
  (newValue) => {
    if (!newValue) {
      store.removeRefSong()
    }
  }
)

onMounted(() => {
  checkSession()
    .then(() => {
      store.fetchData(1)
      store.startTaskPolling()
    })
    .catch(() => {})
})

onUnmounted(() => {
  store.stopTaskPolling()
})
</script>

<style scoped>
.page-suno {
  @apply min-h-screen;
}

.setting-card {
  transition: box-shadow 0.2s;
}

.setting-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
</style>