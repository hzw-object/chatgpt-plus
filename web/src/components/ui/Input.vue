<template>
  <div class="w-full">
    <label v-if="label" :for="inputId" class="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
      {{ label }}
    </label>
    <div class="relative">
      <div v-if="$slots.prefix" class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <slot name="prefix" />
      </div>
      <input
        :id="inputId"
        v-model="modelValue"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        class="block w-full rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all duration-200 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
        :class="[
          inputClasses,
          $slots.prefix ? 'pl-10' : 'pl-4',
          $slots.suffix ? 'pr-10' : 'pr-4',
          error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-slate-300 dark:border-slate-600 focus:ring-violet-500 focus:border-violet-500',
        ]"
      />
      <div v-if="$slots.suffix" class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <slot name="suffix" />
      </div>
    </div>
    <p v-if="error" class="mt-1 text-sm text-red-500">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: string | number
  type?: string
  label?: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  error?: string
}>(), {
  modelValue: '',
  type: 'text',
  placeholder: '',
  disabled: false,
  readonly: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const inputId = useId()
const modelValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const inputClasses = computed(() => [
  'py-2 bg-white dark:bg-slate-900 border-2 text-base',
])
</script>