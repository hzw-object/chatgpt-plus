<template>
  <div class="chat-export dark:bg-gray-900" v-loading="loading">
    <div class="chat-box dark:bg-gray-900" id="chat-box">
      <div class="title pt-4 dark:text-white">
        <h2 class="dark:text-white">{{ chatTitle }}</h2>
      </div>

      <div v-for="item in chatData" :key="item.id">
        <chat-prompt v-if="item.type === 'prompt'" :data="item" list-style="list" />
        <chat-reply
          v-else-if="item.type === 'reply'"
          :data="item"
          :read-only="true"
          list-style="list"
        />
      </div>
    </div>
    <!-- end chat box -->
  </div>
</template>
<script setup>
import ChatPrompt from '@/components/ChatPrompt.vue'
import ChatReply from '@/components/ChatReply.vue'
import { httpGet } from '@/utils/http'
import Clipboard from 'clipboard'
import { ElMessage } from 'element-plus'
import hl from 'highlight.js'
import 'highlight.js/styles/a11y-dark.css'
import { nextTick, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const chatData = ref([])
const router = useRouter()
const chatId = router.currentRoute.value.query['chat_id']
const loading = ref(true)
const chatTitle = ref('')

httpGet('/api/chat/history?chat_id=' + chatId)
  .then((res) => {
    const data = res.data
    if (!data) {
      loading.value = false
      return
    }

    for (let i = 0; i < data.length; i++) {
      if (data[i].type === 'prompt') {
        chatData.value.push(data[i])
        continue
      } else if (data[i].type === 'mj') {
        data[i].content = JSON.parse(data[i].content)
        data[i].content.content = data[i].content?.content
        chatData.value.push(data[i])
        continue
      }

      data[i].orgContent = data[i].content
      data[i].content = data[i].content
      chatData.value.push(data[i])
    }

    nextTick(() => {
      hl.configure({ ignoreUnescapedHTML: true })
      const blocks = document.querySelector('#chat-box').querySelectorAll('pre code')
      blocks.forEach((block) => {
        hl.highlightElement(block)
      })
    })
    loading.value = false
  })
  .catch((e) => {
    ElMessage.error('加载聊天记录失败：' + e.message)
  })

httpGet('/api/chat/detail?chat_id=' + chatId)
  .then((res) => {
    chatTitle.value = res.data.title
  })
  .catch((e) => {
    ElMessage.error('加载会失败： ' + e.message)
  })

onMounted(() => {
  const clipboard = new Clipboard('.copy-reply')
  clipboard.on('success', () => {
    ElMessage.success('复制成功！')
  })

  clipboard.on('error', () => {
    ElMessage.error('复制失败！')
  })
})
</script>
<style lang="scss">
.chat-export {
  display: flex;
  justify-content: center;
  padding: 0 20px;

  .chat-box {
    width: 100%;
    max-width: 800px;
    // 变量定义
    --content-font-size: 16px;
    --content-color: #c1c1c1;

    font-family: 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
    padding: 0 0 50px 0;

    .title {
      text-align: center;
      color: #374151;
    }

    .chat-line {
      font-size: 14px;
      display: flex;
      align-items: center;
      color: #374151;

      .chat-line-inner {
        max-width: 800px;
      }
    }
  }
}

@media (prefers-color-scheme: dark) {
  .chat-export {
    --content-color: #e5e7eb;
  }
}

// 移动端适配
@media (max-width: 768px) {
  .chat-export {
    padding: 0 10px;

    .chat-box {
      padding: 0 0 30px 0;

      .title h2 {
        font-size: 18px;
      }

      .chat-line {
        font-size: 13px;
      }
    }
  }
}
</style>
