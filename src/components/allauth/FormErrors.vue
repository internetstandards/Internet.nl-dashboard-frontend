<template>
  <ul v-if="filteredErrors.length" class="text-danger ps-3 mt-2 mb-2">
    <li v-for="(error, index) in filteredErrors" :key="`${error.param}-${index}`">
      {{ formatErrorMessage(error) }}
    </li>
  </ul>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  errors: {
    type: Array,
    default: () => []
  },
  param: {
    type: String,
    default: ''
  }
})

const { t } = useI18n()
const preferBackendMessageCodes = new Set([
  'email_taken',
  'max_email_addresses',
  'unknown_email',
  'invalid'
])

const filteredErrors = computed(() => {
  if (!props.param) {
    return (props.errors || []).filter((error) => !error.param)
  }
  return (props.errors || []).filter((error) => error.param === props.param)
})

function formatErrorMessage(error) {
  if (preferBackendMessageCodes.has(error?.code)) {
    return error?.message || ''
  }

  if (!error?.code) {
    return error?.message || ''
  }

  const key = `authentication.error.${error.code}`
  const translated = t(key)
  return translated !== key ? translated : (error?.message || '')
}
</script>
