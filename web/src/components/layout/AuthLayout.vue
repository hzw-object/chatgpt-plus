<template>
  <div class="relative flex min-h-screen items-center justify-center overflow-hidden p-4">
    <!-- Background -->
    <div
      class="absolute inset-0 bg-gradient-to-br from-slate-50 via-slate-50/30 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"
    ></div>

    <!-- Animated Background -->
    <div class="pointer-events-none absolute inset-0 overflow-hidden">
      <!-- Animated Gradient Orbs -->
      <div class="auth-orb auth-orb-1"></div>
      <div class="auth-orb auth-orb-2"></div>
      <div class="auth-orb auth-orb-3"></div>

      <!-- Grid Pattern -->
      <div
        class="absolute inset-0 bg-[linear-gradient(rgba(20,184,166,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(20,184,166,0.03)_1px,transparent_1px)] bg-[size:64px_64px]"
      ></div>

      <!-- Floating Particles -->
      <div v-for="p in particles" :key="p.id" class="auth-particle" :style="p.style"></div>
    </div>

    <!-- Content Container -->
    <div class="relative z-10 w-full max-w-md">
      <!-- Logo/Brand -->
      <div class="mb-8 text-center">
        <div
          class="mb-4 inline-flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl shadow-lg shadow-slate-500/30"
        >
          <img :src="siteLogo || '/logo.png'" alt="Logo" class="h-full w-full object-contain" />
        </div>
        <h1 class="text-gradient mb-2 text-3xl font-bold">
          {{ siteName }}
        </h1>
        <p class="text-sm text-slate-500 dark:text-slate-400">
          {{ siteSubtitle }}
        </p>
      </div>

      <!-- Card Container -->
      <div class="card-glass rounded-2xl p-8 shadow-glass">
        <slot />
      </div>

      <!-- Footer Links -->
      <div class="mt-6 text-center text-sm">
        <slot name="footer" />
      </div>

      <!-- Copyright -->
      <div class="mt-8 text-center text-xs text-slate-400 dark:text-slate-500">
        &copy; {{ currentYear }} {{ siteName }}. All rights reserved.
      </div>
    </div>
  </div>
</template>

<script setup>
import { getSystemInfo } from '@/store/cache'
import { ref, onMounted } from 'vue'

const siteName = ref('GeekAI')
const siteLogo = ref('')
const siteSubtitle = ref('集成多种 AI 模型，让创作触手可及')
const currentYear = new Date().getFullYear()

const particles = ref([])

function generateParticles() {
  const items = []
  for (let i = 0; i < 30; i++) {
    const size = Math.random() * 4 + 2
    const x = Math.random() * 100
    const y = Math.random() * 100
    const duration = Math.random() * 20 + 15
    const delay = Math.random() * -20
    const opacity = Math.random() * 0.3 + 0.1
    items.push({
      id: i,
      style: {
        left: `${x}%`,
        top: `${y}%`,
        width: `${size}px`,
        height: `${size}px`,
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
        opacity: `${opacity}`,
      },
    })
  }
  particles.value = items
}

onMounted(() => {
  generateParticles()
  getSystemInfo()
    .then((res) => {
      siteName.value = res.data.title || 'GeekAI'
      siteLogo.value = res.data.logo || '/logo.png'
    })
    .catch(() => {})
})
</script>

<style scoped>
.text-gradient {
  @apply bg-gradient-to-r from-violet-600 to-slate-500 bg-clip-text text-transparent;
}

/* Animated Gradient Orbs */
.auth-orb {
  @apply absolute rounded-full blur-3xl;
}

.auth-orb-1 {
  @apply bg-violet-400/20;
  width: 500px;
  height: 500px;
  animation: orb-float-1 18s ease-in-out infinite;
}

.auth-orb-2 {
  @apply bg-teal-400/15;
  width: 400px;
  height: 400px;
  animation: orb-float-2 22s ease-in-out infinite;
}

.auth-orb-3 {
  @apply bg-indigo-400/10;
  width: 350px;
  height: 350px;
  animation: orb-float-3 25s ease-in-out infinite;
}

@keyframes orb-float-1 {
  0%, 100% { transform: translate(10%, -20%); }
  25% { transform: translate(-15%, 10%); }
  50% { transform: translate(20%, 30%); }
  75% { transform: translate(-10%, -10%); }
}

@keyframes orb-float-2 {
  0%, 100% { transform: translate(-80%, 70%); }
  25% { transform: translate(-30%, 20%); }
  50% { transform: translate(-60%, -10%); }
  75% { transform: translate(-20%, 50%); }
}

@keyframes orb-float-3 {
  0%, 100% { transform: translate(-50%, -50%); }
  25% { transform: translate(10%, -30%); }
  50% { transform: translate(-30%, 20%); }
  75% { transform: translate(20%, -20%); }
}

/* Floating Particles */
.auth-particle {
  @apply absolute rounded-full bg-violet-400/40 dark:bg-violet-300/30;
  animation: particle-drift linear infinite;
}

@keyframes particle-drift {
  0% {
    transform: translateY(0) translateX(0) scale(1);
    opacity: var(--particle-opacity, 0.2);
  }
  25% {
    transform: translateY(-30px) translateX(15px) scale(1.1);
  }
  50% {
    transform: translateY(-10px) translateX(-20px) scale(0.9);
    opacity: calc(var(--particle-opacity, 0.2) * 0.5);
  }
  75% {
    transform: translateY(-40px) translateX(10px) scale(1.05);
  }
  100% {
    transform: translateY(0) translateX(0) scale(1);
    opacity: var(--particle-opacity, 0.2);
  }
}
</style>
