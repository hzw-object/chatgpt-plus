<template>
  <div
    :class="[
      'group relative flex flex-col overflow-hidden rounded-2xl border transition-all',
      'hover:shadow-xl hover:-translate-y-0.5',
      borderClass,
      'bg-white dark:bg-slate-900',
    ]"
  >
    <!-- Gradient header block -->
    <div :class="['px-4 pt-4 pb-3', headerClass]">
      <!-- Renewal badge -->
      <div v-if="isRenewal" class="flex justify-end mb-2">
        <span class="rounded-full px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
          {{ t('userSubscriptions.status.active') }}
        </span>
      </div>
      <!-- Plan name + description -->
      <h3 class="text-base font-bold text-slate-900 dark:text-white truncate">{{ plan.name }}</h3>
      <p v-if="plan.description" class="mt-0.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400 line-clamp-2">
        {{ plan.description }}
      </p>
      <!-- Price row -->
      <div class="mt-3 flex items-end justify-between">
        <div class="flex items-baseline gap-1">
          <span class="text-xs text-slate-400 dark:text-slate-500">$</span>
          <span :class="['text-2xl font-extrabold tracking-tight leading-none', textClass]">{{ plan.price }}</span>
          <span class="text-xs text-slate-400 dark:text-slate-500">/ {{ validitySuffix }}</span>
        </div>
        <div v-if="plan.original_price" class="flex items-center gap-1.5">
          <span class="text-xs text-slate-400 line-through dark:text-slate-500">${{ plan.original_price }}</span>
          <span :class="['rounded px-1 py-0.5 text-[10px] font-semibold', discountClass]">{{ discountText }}</span>
        </div>
      </div>
    </div>

    <div class="flex flex-1 flex-col p-4">
      <!-- Data grid -->
      <div class="mb-3 grid grid-cols-2 gap-x-3 gap-y-1 rounded-xl bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs">
        <div class="flex items-center justify-between">
          <span class="text-slate-400 dark:text-slate-500">{{ t('payment.planCard.rate') }}</span>
          <span :class="['font-semibold', textClass]">{{ rateDisplay }}</span>
        </div>
        <div v-if="plan.daily_limit_usd != null" class="flex items-center justify-between">
          <span class="text-slate-400 dark:text-slate-500">{{ t('payment.planCard.dailyLimit') }}</span>
          <span class="font-medium text-slate-700 dark:text-slate-200">${{ plan.daily_limit_usd }}</span>
        </div>
        <div v-if="plan.weekly_limit_usd != null" class="flex items-center justify-between">
          <span class="text-slate-400 dark:text-slate-500">{{ t('payment.planCard.weeklyLimit') }}</span>
          <span class="font-medium text-slate-700 dark:text-slate-200">${{ plan.weekly_limit_usd }}</span>
        </div>
        <div v-if="plan.monthly_limit_usd != null" class="flex items-center justify-between">
          <span class="text-slate-400 dark:text-slate-500">{{ t('payment.planCard.monthlyLimit') }}</span>
          <span class="font-medium text-slate-700 dark:text-slate-200">${{ plan.monthly_limit_usd }}</span>
        </div>
        <div v-if="plan.daily_limit_usd == null && plan.weekly_limit_usd == null && plan.monthly_limit_usd == null"
          class="flex items-center justify-between">
          <span class="text-slate-400 dark:text-slate-500">{{ t('payment.planCard.quota') }}</span>
          <span class="font-medium text-slate-700 dark:text-slate-200">{{ t('payment.planCard.unlimited') }}</span>
        </div>
      </div>

      <!-- Features list -->
      <div v-if="plan.features.length > 0" class="mb-3 space-y-1">
        <div v-for="feature in plan.features" :key="feature" class="flex items-start gap-1.5">
          <svg :class="['mt-0.5 h-3.5 w-3.5 flex-shrink-0', iconClass]" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          <span class="text-xs text-slate-600 dark:text-slate-300">{{ feature }}</span>
        </div>
      </div>

      <div class="flex-1" />

      <!-- Subscribe Button -->
      <button
        type="button"
        :class="['w-full rounded-xl py-2.5 text-sm font-semibold transition-all active:scale-[0.98]', btnClass]"
        @click="emit('select', plan)"
      >
        {{ isRenewal ? t('payment.renewNow') : t('payment.subscribeNow') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { SubscriptionPlan } from '@/types/payment'
import type { UserSubscription } from '@/types'
import {
  platformBorderClass,
  platformTextClass,
  platformIconClass,
  platformButtonClass,
  platformDiscountClass,
} from '@/utils/platformColors'

const props = defineProps<{ plan: SubscriptionPlan; activeSubscriptions?: UserSubscription[] }>()
const emit = defineEmits<{ select: [plan: SubscriptionPlan] }>()
const { t } = useI18n()

const platform = computed(() => props.plan.group_platform || '')
const isRenewal = computed(() =>
  props.activeSubscriptions?.some(s => s.group_id === props.plan.group_id && s.status === 'active') ?? false
)

// Derived color classes from central config
const borderClass = computed(() => platformBorderClass(platform.value))
const textClass = computed(() => platformTextClass(platform.value))
const iconClass = computed(() => platformIconClass(platform.value))
const btnClass = computed(() => platformButtonClass(platform.value))
const discountClass = computed(() => platformDiscountClass(platform.value))

const discountText = computed(() => {
  if (!props.plan.original_price || props.plan.original_price <= 0) return ''
  const pct = Math.round((1 - props.plan.price / props.plan.original_price) * 100)
  return pct > 0 ? `-${pct}%` : ''
})

const rateDisplay = computed(() => {
  const rate = props.plan.rate_multiplier ?? 1
  return `×${Number(rate.toPrecision(10))}`
})

const validitySuffix = computed(() => {
  const u = props.plan.validity_unit || 'day'
  if (u === 'month') return t('payment.perMonth')
  if (u === 'year') return t('payment.perYear')
  return `${props.plan.validity_days}${t('payment.days')}`
})

const headerClass = computed(() => {
  switch (platform.value) {
    case 'anthropic': return 'bg-gradient-to-br from-orange-50 to-orange-100 dark:from-[#2a0800] dark:to-[#1f0500]'
    case 'openai':    return 'bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-[#00200e] dark:to-[#001a09]'
    case 'gemini':    return 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-[#001030] dark:to-[#000d20]'
    case 'antigravity': return 'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-[#180020] dark:to-[#110016]'
    default:          return 'bg-gradient-to-br from-slate-50 to-slate-100 dark:from-[#1a1a1a] dark:to-[#111]'
  }
})
</script>
