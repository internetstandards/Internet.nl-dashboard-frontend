<template>
  <section>
    <h2>Recovery Codes</h2>

    <template v-if="recoveryCodes?.status === 200">
      <p>{{ recoveryCodes.data.unused_code_count }} of {{ recoveryCodes.data.total_code_count }} recovery codes available.</p>
      <pre>{{ (recoveryCodes.data.unused_codes || []).join('\n') }}</pre>
    </template>

    <template v-else>
      <p>No recovery codes configured.</p>
    </template>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { getRecoveryCodes } from '@/allauth/lib/allauth'

const recoveryCodes = ref(null)

onMounted(async () => {
  recoveryCodes.value = await getRecoveryCodes()
})
</script>
