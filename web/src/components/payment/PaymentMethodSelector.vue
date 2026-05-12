<template>
  <div>
    <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
      {{ t('payment.paymentMethod') }}
    </label>
    <div class="grid grid-cols-2 gap-3 sm:flex">
      <button
        v-for="method in sortedMethods"
        :key="method.type"
        type="button"
        :disabled="!method.available"
        :class="[
          'relative flex h-[60px] flex-col items-center justify-center rounded-xl border px-3 transition-all sm:flex-1',
          !method.available
            ? 'cursor-not-allowed border-slate-200 bg-slate-50 opacity-50 dark:border-slate-700 dark:bg-slate-800/50'
            : selected === method.type
              ? methodSelectedClass(method.type)
              : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-slate-500',
        ]"
        @click="method.available && emit('select', method.type)"
      >
        <span class="flex items-center gap-2">
          <img :src="methodIcon(method)" :alt="t(`payment.methods.${method.type}`)" class="h-7 w-7" />
          <span class="flex flex-col items-start leading-none">
            <span class="text-base font-semibold">{{ t(`payment.methods.${method.type}`) }}</span>
            <span
              v-if="method.fee_rate > 0"
              class="text-[10px] tracking-wide text-slate-500 dark:text-slate-400"
            >
              {{ t('payment.fee') }} {{ method.fee_rate }}%
            </span>
          </span>
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { METHOD_ORDER } from './providerConfig'
import alipayIcon from '@/assets/icons/alipay.svg'
import wxpayIcon from '@/assets/icons/wxpay.svg'
import stripeIcon from '@/assets/icons/stripe.svg'

export interface PaymentMethodOption {
  type: string
  fee_rate: number
  available: boolean
  icon_url?: string
}

const props = defineProps<{
  methods: PaymentMethodOption[]
  selected: string
}>()

const emit = defineEmits<{
  select: [type: string]
}>()

const { t } = useI18n()

const METHOD_ICONS: Record<string, string> = {
  alipay: alipayIcon,
  wxpay: wxpayIcon,
  stripe: stripeIcon,
}

const sortedMethods = computed(() => {
  const order: readonly string[] = METHOD_ORDER
  return [...props.methods].sort((a, b) => {
    const ai = order.indexOf(a.type)
    const bi = order.indexOf(b.type)
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi)
  })
})

function methodIcon(method: PaymentMethodOption): string {
  if (method.icon_url) return method.icon_url
  const type = method.type
  if (type.includes('alipay')) return METHOD_ICONS.alipay
  if (type.includes('wxpay')) return METHOD_ICONS.wxpay
  return METHOD_ICONS[type] || alipayIcon
}

function methodSelectedClass(type: string): string {
  if (type.includes('alipay')) return 'border-[#02A9F1] bg-blue-50 text-slate-900 shadow-sm dark:bg-blue-950 dark:text-slate-100'
  if (type.includes('wxpay')) return 'border-[#09BB07] bg-green-50 text-slate-900 shadow-sm dark:bg-green-950 dark:text-slate-100'
  if (type === 'stripe') return 'border-[#676BE5] bg-indigo-50 text-slate-900 shadow-sm dark:bg-indigo-950 dark:text-slate-100'
  return 'border-slate-500 bg-slate-50 text-slate-900 shadow-sm dark:bg-slate-950 dark:text-slate-100'
}
</script>
