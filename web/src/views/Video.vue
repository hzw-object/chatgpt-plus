<template>
  <div class="page-video flex h-screen">
    <!-- Left Panel - Parameters -->
    <div class="params-panel w-96 flex-shrink-0 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 overflow-y-auto">
      <!-- Video Type Tabs -->
      <div class="video-type-tabs">
        <div class="flex border-b border-slate-200 dark:border-slate-700">
          <button
            @click="store.switchVideoType('luma')"
            :class="store.activeVideoType === 'luma' ? 'border-b-2 border-violet-600 text-violet-600' : 'text-slate-500'"
            class="flex-1 py-3 text-center font-medium transition-colors"
          >
            Luma视频
          </button>
          <button
            @click="store.switchVideoType('keling')"
            :class="store.activeVideoType === 'keling' ? 'border-b-2 border-violet-600 text-violet-600' : 'text-slate-500'"
            class="flex-1 py-3 text-center font-medium transition-colors"
          >
            可灵视频
          </button>
        </div>

        <!-- Luma Parameters -->
        <div v-if="store.activeVideoType === 'luma'" class="params-container p-4 space-y-4">
          <div>
            <textarea
              v-model="store.lumaParams.prompt"
              maxlength="2000"
              rows="4"
              placeholder="请在此输入视频提示词，用逗号分割，您也可以点击下面的提示词助手生成视频提示词"
              class="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 resize-none"
            />
          </div>

          <div class="flex justify-end">
            <button
              @click="store.generatePrompt"
              :disabled="store.isGenerating"
              class="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg flex items-center gap-2 disabled:bg-slate-400"
            >
              <i v-if="store.isGenerating" class="iconfont icon-loading animate-spin"></i>
              <i v-else class="iconfont icon-chuangzuo"></i>
              <span>{{ store.isGenerating ? '生成中...' : '生成提示词' }}</span>
            </button>
          </div>

          <!-- Image Mode Toggle -->
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-slate-700 dark:text-slate-300">使用图片辅助生成</span>
            <button
              @click="store.toggleLumaImageMode"
              :class="store.lumaUseImageMode ? 'bg-violet-600' : 'bg-slate-300 dark:bg-slate-600'"
              class="relative w-10 h-5 rounded-full transition-colors"
            >
              <span
                :class="store.lumaUseImageMode ? 'translate-x-6' : 'translate-x-1'"
                class="absolute top-0.5 left-0 w-4 h-4 bg-white rounded-full transition-transform"
              ></span>
            </button>
          </div>

          <!-- Image Upload Area -->
          <div v-if="store.lumaUseImageMode" class="flex items-center gap-2">
            <div class="relative flex-1">
              <button
                v-if="store.lumaParams.image"
                @click="store.removeLumaImage('start')"
                class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center z-10"
              >
                <i class="iconfont icon-close text-xs"></i>
              </button>
              <label class="img-uploader video-img-box block cursor-pointer">
                <input type="file" accept=".jpg,.png,.jpeg" class="hidden" @change="(e) => store.uploadLumaStartImage(e)" />
                <img v-if="store.lumaParams.image" :src="store.lumaParams.image" class="w-full h-full object-cover rounded-lg" />
                <div v-else class="flex flex-col items-center justify-center py-8 text-slate-400">
                  <i class="iconfont icon-plus text-2xl mb-1"></i>
                  <span class="text-sm">起始帧</span>
                </div>
              </label>
            </div>

            <div v-if="store.lumaParams.image && store.lumaParams.image_tail" class="flex items-center">
              <button @click="store.switchLumaImages" class="p-2 hover:bg-slate-100 rounded" title="交换图片">
                <i class="iconfont icon-exchange"></i>
              </button>
            </div>

            <div class="relative flex-1">
              <button
                v-if="store.lumaParams.image_tail"
                @click="store.removeLumaImage('end')"
                class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center z-10"
              >
                <i class="iconfont icon-close text-xs"></i>
              </button>
              <label class="img-uploader video-img-box block cursor-pointer">
                <input type="file" accept=".jpg,.png,.jpeg" class="hidden" @change="(e) => store.uploadLumaEndImage(e)" />
                <img v-if="store.lumaParams.image_tail" :src="store.lumaParams.image_tail" class="w-full h-full object-cover rounded-lg" />
                <div v-else class="flex flex-col items-center justify-center py-8 text-slate-400">
                  <i class="iconfont icon-plus text-2xl mb-1"></i>
                  <span class="text-sm">结束帧</span>
                </div>
              </label>
            </div>
          </div>

          <!-- Loop Reference Toggle -->
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-slate-700 dark:text-slate-300">循环参考图</span>
            <button
              @click="store.lumaParams.loop = !store.lumaParams.loop"
              :class="store.lumaParams.loop ? 'bg-violet-600' : 'bg-slate-300 dark:bg-slate-600'"
              class="relative w-10 h-5 rounded-full transition-colors"
            >
              <span
                :class="store.lumaParams.loop ? 'translate-x-6' : 'translate-x-1'"
                class="absolute top-0.5 left-0 w-4 h-4 bg-white rounded-full transition-transform"
              ></span>
            </button>
          </div>

          <!-- Prompt Optimization Toggle -->
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-slate-700 dark:text-slate-300">提示词优化</span>
            <button
              @click="store.lumaParams.expand_prompt = !store.lumaParams.expand_prompt"
              :class="store.lumaParams.expand_prompt ? 'bg-violet-600' : 'bg-slate-300 dark:bg-slate-600'"
              class="relative w-10 h-5 rounded-full transition-colors"
            >
              <span
                :class="store.lumaParams.expand_prompt ? 'translate-x-6' : 'translate-x-1'"
                class="absolute top-0.5 left-0 w-4 h-4 bg-white rounded-full transition-transform"
              ></span>
            </button>
          </div>

          <!-- Power Info -->
          <div class="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-violet-50 to-violet-100 border border-violet-200 dark:border-violet-800">
            <div class="flex items-center gap-2">
              <i class="iconfont icon-lightning text-amber-500"></i>
              <span class="font-medium text-slate-700 dark:text-slate-300">当前可用算力：</span>
              <span class="font-bold text-lg text-amber-500">{{ store.availablePower }}</span>
            </div>
            <span class="text-slate-400 cursor-help" title="算力用于生成视频，每次生成会消耗对应算力">
              <i class="iconfont icon-tips"></i>
            </span>
          </div>

          <button
            @click="store.createLumaVideo"
            :disabled="store.generating"
            class="w-full py-3 bg-gradient-to-r from-violet-500 to-violet-700 text-white rounded-xl disabled:from-slate-400 disabled:to-slate-400 disabled:cursor-not-allowed hover:from-violet-600 hover:to-violet-800 transition-all flex items-center justify-center gap-2"
          >
            <i v-if="store.generating" class="iconfont icon-loading animate-spin"></i>
            <i v-else class="iconfont icon-chuangzuo"></i>
            <span>立即生成 ({{ store.lumaPowerCost }}算力)</span>
          </button>
        </div>

        <!-- KeLing Parameters -->
        <div v-if="store.activeVideoType === 'keling'" class="params-container p-4 space-y-4">
          <!-- Aspect Ratio -->
          <div>
            <div class="flex items-center gap-2 mb-2">
              <span class="text-sm font-medium text-slate-700 dark:text-slate-300">画面比例：</span>
              <span class="text-slate-400 cursor-help" title="生成画面的尺寸比例">
                <i class="iconfont icon-tips"></i>
              </span>
            </div>
            <div class="grid grid-cols-3 gap-2">
              <div
                v-for="item in store.rates"
                :key="item.value"
                @click="store.changeRate(item)"
                :class="item.value === store.kelingParams.aspect_ratio ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20' : 'border-slate-200 dark:border-slate-600'"
                class="border rounded-lg p-2 cursor-pointer transition-colors hover:border-violet-400"
              >
                <img :src="item.img" class="w-full aspect-video object-cover rounded mb-1" />
                <div class="text-xs text-center text-slate-600 dark:text-slate-400">{{ item.text }}</div>
              </div>
            </div>
          </div>

          <!-- Model Selection -->
          <div>
            <label class="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-2">模型选择</label>
            <select
              v-model="store.kelingParams.model"
              @change="store.updateModelPower"
              class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            >
              <option v-for="item in store.models" :key="item.value" :value="item.value">{{ item.text }}</option>
            </select>
          </div>

          <!-- Duration -->
          <div>
            <label class="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-2">视频时长</label>
            <select
              v-model="store.kelingParams.duration"
              @change="store.updateModelPower"
              class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            >
              <option value="5">5秒</option>
              <option value="10">10秒</option>
            </select>
          </div>

          <!-- Mode -->
          <div>
            <label class="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-2">生成模式</label>
            <select
              v-model="store.kelingParams.mode"
              @change="store.updateModelPower"
              class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            >
              <option value="std">标准模式</option>
              <option value="pro">专业模式</option>
            </select>
          </div>

          <!-- Creative Level -->
          <div>
            <label class="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-2">创意程度</label>
            <div class="flex items-center gap-3">
              <input
                type="range"
                v-model="store.kelingParams.cfg_scale"
                min="0"
                max="1"
                step="0.1"
                class="flex-1 accent-violet-600"
              />
              <span class="text-sm text-slate-500 w-8">{{ store.kelingParams.cfg_scale }}</span>
            </div>
          </div>

          <!-- Camera Control -->
          <div v-if="store.showCameraControl">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-sm font-medium text-slate-700 dark:text-slate-300">运镜控制：</span>
              <span class="text-slate-400 cursor-help" title="生成画面的运镜效果，仅 1.5的高级模式可用">
                <i class="iconfont icon-tips"></i>
              </span>
            </div>
            <select
              v-model="store.kelingParams.camera_control.type"
              class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 mb-2"
            >
              <option value="">请选择</option>
              <option value="simple">简单运镜</option>
              <option value="down_back">下移拉远</option>
              <option value="forward_up">推进上移</option>
              <option value="right_turn_forward">右旋推进</option>
              <option value="left_turn_forward">左旋推进</option>
            </select>

            <div v-if="store.kelingParams.camera_control.type === 'simple'" class="space-y-3 mt-3 pl-4 border-l-2 border-violet-200">
              <div>
                <label class="text-xs text-slate-500 block mb-1">水平移动</label>
                <input type="range" v-model="store.kelingParams.camera_control.config.horizontal" min="-10" max="10" class="w-full accent-violet-600" />
              </div>
              <div>
                <label class="text-xs text-slate-500 block mb-1">垂直移动</label>
                <input type="range" v-model="store.kelingParams.camera_control.config.vertical" min="-10" max="10" class="w-full accent-violet-600" />
              </div>
              <div>
                <label class="text-xs text-slate-500 block mb-1">左右旋转</label>
                <input type="range" v-model="store.kelingParams.camera_control.config.pan" min="-10" max="10" class="w-full accent-violet-600" />
              </div>
              <div>
                <label class="text-xs text-slate-500 block mb-1">上下旋转</label>
                <input type="range" v-model="store.kelingParams.camera_control.config.tilt" min="-10" max="10" class="w-full accent-violet-600" />
              </div>
              <div>
                <label class="text-xs text-slate-500 block mb-1">横向翻转</label>
                <input type="range" v-model="store.kelingParams.camera_control.config.roll" min="-10" max="10" class="w-full accent-violet-600" />
              </div>
              <div>
                <label class="text-xs text-slate-500 block mb-1">镜头缩放</label>
                <input type="range" v-model="store.kelingParams.camera_control.config.zoom" min="-10" max="10" class="w-full accent-violet-600" />
              </div>
            </div>
          </div>

          <!-- Image Mode Toggle -->
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-slate-700 dark:text-slate-300">使用图片辅助生成</span>
            <button
              @click="store.toggleKelingImageMode"
              :class="store.kelingUseImageMode ? 'bg-violet-600' : 'bg-slate-300 dark:bg-slate-600'"
              class="relative w-10 h-5 rounded-full transition-colors"
            >
              <span
                :class="store.kelingUseImageMode ? 'translate-x-6' : 'translate-x-1'"
                class="absolute top-0.5 left-0 w-4 h-4 bg-white rounded-full transition-transform"
              ></span>
            </button>
          </div>

          <!-- KeLing Image Upload -->
          <div v-if="store.kelingUseImageMode" class="flex items-center gap-2">
            <div class="relative flex-1">
              <button
                v-if="store.kelingParams.image"
                @click="store.removeKelingImage('start')"
                class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center z-10"
              >
                <i class="iconfont icon-close text-xs"></i>
              </button>
              <label class="img-uploader video-img-box block cursor-pointer">
                <input type="file" accept=".jpg,.png,.jpeg" class="hidden" @change="(e) => store.uploadKelingStartImage(e)" />
                <img v-if="store.kelingParams.image" :src="store.kelingParams.image" class="w-full h-full object-cover rounded-lg" />
                <div v-else class="flex flex-col items-center justify-center py-8 text-slate-400">
                  <i class="iconfont icon-plus text-2xl mb-1"></i>
                  <span class="text-sm">起始帧</span>
                </div>
              </label>
            </div>

            <div v-if="store.kelingParams.image && store.kelingParams.image_tail" class="flex items-center">
              <button @click="store.switchKelingImages" class="p-2 hover:bg-slate-100 rounded" title="交换图片">
                <i class="iconfont icon-exchange"></i>
              </button>
            </div>

            <div class="relative flex-1">
              <button
                v-if="store.kelingParams.image_tail"
                @click="store.removeKelingImage('end')"
                class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center z-10"
              >
                <i class="iconfont icon-close text-xs"></i>
              </button>
              <label class="img-uploader video-img-box block cursor-pointer">
                <input type="file" accept=".jpg,.png,.jpeg" class="hidden" @change="(e) => store.uploadKelingEndImage(e)" />
                <img v-if="store.kelingParams.image_tail" :src="store.kelingParams.image_tail" class="w-full h-full object-cover rounded-lg" />
                <div v-else class="flex flex-col items-center justify-center py-8 text-slate-400">
                  <i class="iconfont icon-plus text-2xl mb-1"></i>
                  <span class="text-sm">结束帧</span>
                </div>
              </label>
            </div>
          </div>

          <!-- Prompt -->
          <div>
            <div class="flex items-center gap-2 mb-2">
              <span class="text-sm font-medium text-slate-700 dark:text-slate-300">提示词：</span>
              <span class="text-slate-400 cursor-help" title="输入你想要的内容，用逗号分割">
                <i class="iconfont icon-tips"></i>
              </span>
            </div>
            <textarea
              v-model="store.kelingParams.prompt"
              maxlength="500"
              rows="4"
              :placeholder="store.kelingUseImageMode ? '描述视频画面细节' : '请在此输入视频提示词，您也可以点击下面的提示词助手生成视频提示词'"
              class="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 resize-none"
            />
          </div>

          <div class="flex justify-end">
            <button
              @click="store.generatePrompt"
              :disabled="store.isGenerating"
              class="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg flex items-center gap-2 disabled:bg-slate-400"
            >
              <i v-if="store.isGenerating" class="iconfont icon-loading animate-spin"></i>
              <i v-else class="iconfont icon-chuangzuo"></i>
              <span>{{ store.isGenerating ? '生成中...' : '生成提示词' }}</span>
            </button>
          </div>

          <!-- Negative Prompt -->
          <div>
            <div class="flex items-center gap-2 mb-2">
              <span class="text-sm font-medium text-slate-700 dark:text-slate-300">不希望出现的内容：</span>
              <span class="text-slate-400 cursor-help" title="不想出现在图片上的元素(例如：树，建筑)">
                <i class="iconfont icon-tips"></i>
              </span>
            </div>
            <textarea
              v-model="store.kelingParams.negative_prompt"
              rows="4"
              placeholder="请在此输入你不希望出现在视频上的内容"
              class="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 resize-none"
            />
          </div>

          <!-- Power Info -->
          <div class="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-violet-50 to-violet-100 border border-violet-200 dark:border-violet-800">
            <div class="flex items-center gap-2">
              <i class="iconfont icon-lightning text-amber-500"></i>
              <span class="font-medium text-slate-700 dark:text-slate-300">当前可用算力：</span>
              <span class="font-bold text-lg text-amber-500">{{ store.availablePower }}</span>
            </div>
            <span class="text-slate-400 cursor-help" title="算力用于生成视频，每次生成会消耗对应算力">
              <i class="iconfont icon-tips"></i>
            </span>
          </div>

          <button
            @click="store.createKelingVideo"
            :disabled="store.generating"
            class="w-full py-3 bg-gradient-to-r from-violet-500 to-violet-700 text-white rounded-xl disabled:from-slate-400 disabled:to-slate-400 disabled:cursor-not-allowed hover:from-violet-600 hover:to-violet-800 transition-all flex items-center justify-center gap-2"
          >
            <i v-if="store.generating" class="iconfont icon-loading animate-spin"></i>
            <i v-else class="iconfont icon-chuangzuo"></i>
            <span>立即生成 ({{ store.kelingPowerCost }}算力)</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Right Panel - Task List -->
    <div class="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900">
      <div v-if="store.loading" class="flex items-center justify-center h-full">
        <div class="w-10 h-10 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
      </div>

      <div class="works-header p-4 flex items-center justify-between">
        <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100">你的作品</h2>
        <div class="flex gap-2">
          <button
            @click="store.switchTaskFilter('all')"
            :class="store.taskFilter === 'all' ? 'bg-violet-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'"
            class="px-4 py-1.5 rounded-lg text-sm transition-colors"
          >
            全部
          </button>
          <button
            @click="store.switchTaskFilter('luma')"
            :class="store.taskFilter === 'luma' ? 'bg-violet-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'"
            class="px-4 py-1.5 rounded-lg text-sm transition-colors"
          >
            Luma
          </button>
          <button
            @click="store.switchTaskFilter('keling')"
            :class="store.taskFilter === 'keling' ? 'bg-violet-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'"
            class="px-4 py-1.5 rounded-lg text-sm transition-colors"
          >
            可灵
          </button>
        </div>
      </div>

      <div class="video-list px-4 pb-4">
        <div class="list-box" v-if="!store.noData">
          <div v-for="item in store.currentList" :key="item.id" class="mb-4">
            <div class="bg-white dark:bg-slate-800 rounded-xl p-4 flex gap-4">
              <div class="left w-48 flex-shrink-0">
                <div class="container relative">
                  <video
                    v-if="item.progress === 100"
                    class="w-full rounded-lg"
                    :src="store.replaceImg(item.video_url)"
                    preload="auto"
                    loop
                    muted
                  >
                    您的浏览器不支持视频播放
                  </video>
                  <img v-else-if="item.progress === 101" :src="item.cover_url" class="w-full border rounded-lg" />
                  <div v-else class="w-full aspect-video bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                    <span class="text-slate-400">正在生成视频</span>
                  </div>
                  <button
                    v-if="item.progress === 100"
                    @click="store.playVideo(item)"
                    class="absolute inset-0 flex items-center justify-center bg-black/30"
                  >
                    <img src="/images/play.svg" class="w-12 h-12" alt="" />
                  </button>
                </div>
              </div>

              <div class="center flex-1 min-w-0">
                <div class="flex flex-wrap gap-1 mb-2" v-if="item.raw_data">
                  <span class="px-2 py-0.5 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded text-xs">
                    {{ item.raw_data.task_type || store.activeVideoType }}
                  </span>
                  <span v-if="item.raw_data.model" class="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded text-xs">
                    {{ item.raw_data.model }}
                  </span>
                  <span v-if="item.raw_data.duration" class="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded text-xs">
                    {{ item.raw_data.duration }}秒
                  </span>
                  <span v-if="item.raw_data.mode" class="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded text-xs">
                    {{ item.raw_data.mode }}
                  </span>
                </div>
                <div class="text-red-500 text-sm" v-if="item.progress === 101">
                  任务执行失败：{{ item.err_msg }}
                </div>
                <div class="text-slate-600 dark:text-slate-400 text-sm" v-else>
                  {{ store.substr(item.prompt, 1000) }}
                </div>
              </div>

              <div class="right flex items-center gap-2" v-if="item.progress === 100">
                <button
                  @click="store.copyPrompt(item)"
                  class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center justify-center text-slate-600 dark:text-slate-400"
                  title="复制提示词"
                >
                  <i class="iconfont icon-copy"></i>
                </button>
                <button
                  @click="store.downloadVideo(item)"
                  :disabled="item.downloading"
                  class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center justify-center text-slate-600 dark:text-slate-400 disabled:opacity-50"
                  title="下载视频"
                >
                  <i class="iconfont icon-download"></i>
                </button>
                <button
                  @click="store.removeJob(item)"
                  class="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 flex items-center justify-center text-red-600 dark:text-red-400"
                  title="删除"
                >
                  <i class="iconfont icon-remove"></i>
                </button>
              </div>

              <div class="right flex items-center" v-else>
                <button
                  @click="store.removeJob(item)"
                  class="w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white"
                >
                  <i class="iconfont icon-remove"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-16 text-slate-400">
          <i class="iconfont icon-empty text-6xl mb-4"></i>
          <p>没有任何作品，赶紧去创作吧！</p>
        </div>

        <!-- Pagination -->
        <div class="flex justify-center py-6" v-if="store.total > store.pageSize">
          <div class="flex gap-1">
            <button
              v-for="p in Math.ceil(store.total / store.pageSize)"
              :key="p"
              @click="store.fetchData(p)"
              :class="store.page === p ? 'bg-violet-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'"
              class="w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
            >
              {{ p }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Video Preview Dialog -->
    <teleport to="body">
      <div v-if="store.showDialog" class="fixed inset-0 bg-black/80 z-50 flex items-center justify-center" @click.self="store.showDialog = false">
        <div class="relative">
          <button
            @click="store.showDialog = false"
            class="absolute -top-10 right-0 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white"
          >
            <i class="iconfont icon-close"></i>
          </button>
          <video
            style="max-width: 90vw; max-height: 90vh"
            :src="store.currentVideoUrl"
            preload="auto"
            autoplay
            loop
            muted
          >
            您的浏览器不支持视频播放
          </video>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { useVideoStore } from '@/store/video'
import { onMounted, onUnmounted, ref } from 'vue'

const store = useVideoStore()
const Math = { ceil: (n) => Math.ceil(n) }

onMounted(() => {
  store.init()
})

onUnmounted(() => {
  store.cleanup()
})
</script>

<style lang="scss" scoped>
@use '../assets/css/video.scss' as *;
</style>