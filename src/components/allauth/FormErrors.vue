<template>
  <ul v-if="filteredErrors.length" class="text-danger ps-3 mt-2 mb-2">
    <li v-for="(error, index) in filteredErrors" :key="`${error.param}-${index}`">
      {{ error.message }}
    </li>
  </ul>
</template>

<script setup>
import { computed } from 'vue'

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

const filteredErrors = computed(() => {
  if (!props.param) {
    return (props.errors || []).filter((error) => !error.param)
  }
  return (props.errors || []).filter((error) => error.param === props.param)
})
</script>
