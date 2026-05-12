<template>
  <div class="page-song p-4">
    <div class="inner max-w-2xl mx-auto">
      <h2 class="title text-2xl font-bold text-slate-900 dark:text-slate-50 mb-4">{{ song.title }}</h2>
      <div class="row tags text-slate-500 mb-4" v-if="song.tags">
        <span>{{ song.tags }}</span>
      </div>

      <div class="row author flex items-center gap-3 mb-4">
        <img :src="song.user?.avatar" class="w-8 h-8 rounded-full" alt="avatar" />
        <span class="nickname text-slate-700 dark:text-slate-300">{{ song.user?.nickname }}</span>
        <button class="btn btn-icon px-3 py-1.5 bg-violet-600 text-white rounded-lg flex items-center gap-1" @click="play">
          <i class="iconfont icon-play"></i> {{ song.play_times }}
        </button>

        <button class="btn btn-icon copy-link px-3 py-1.5 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center gap-1" :data-clipboard-text="getShareURL(song)">
          <i class="iconfont icon-share1"></i>
        </button>
      </div>

      <div class="row date text-sm text-slate-400 mb-4">
        <span>{{ dateFormat(song.created_at) }}</span>
        <span class="version ml-2 text-slate-500">{{ song.raw_data?.major_model_version }}</span>
      </div>

      <div class="row">
        <textarea class="prompt w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-300 resize-none" maxlength="2000" rows="18" readonly>{{ song.prompt }}</textarea>
      </div>
    </div>

    <div class="music-player" v-if="playList.length > 0">
      <music-player :songs="playList" ref="playerRef" @play="song.play_times += 1" />
    </div>
  </div>
</template>

<script setup>
import MusicPlayer from '@/components/MusicPlayer.vue'
import { showMessageError } from '@/utils/dialog'
import { httpGet } from '@/utils/http'
import { dateFormat } from '@/utils/libs'
import Clipboard from 'clipboard'
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const id = router.currentRoute.value.params.id
const song = ref({ title: '' })
const playList = ref([])
const playerRef = ref(null)

httpGet('/api/suno/detail', { song_id: id })
  .then((res) => {
    song.value = res.data
    playList.value = [song.value]
    document.title = song.value?.title + ' | By ' + song.value?.user.nickname + ' | Suno音乐'
  })
  .catch((e) => {
    showMessageError('获取歌曲详情失败：' + e.message)
  })

const clipboard = ref(null)
onMounted(() => {
  clipboard.value = new Clipboard('.copy-link')
  clipboard.value.on('success', () => {
    showMessageError('复制歌曲链接成功！')
  })

  clipboard.value.on('error', () => {
    showMessageError('复制失败！')
  })
})

onUnmounted(() => {
  clipboard.value.destroy()
})

// 播放歌曲
const play = () => {
  playerRef.value.play()
}

const getShareURL = (item) => {
  return `${location.protocol}//${location.host}/song/${item.id}`
}
</script>

<style scoped>
.page-song {
  width: 100%;
  min-height: 100vh;
}
</style>
