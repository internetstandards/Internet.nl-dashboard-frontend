<template>
  <section>
    <h2>Reset Password</h2>
    <p>Validating reset link...</p>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

onMounted(async () => {
  await router.replace({ path: '/account/password/reset/complete', query: { key: String(route.params.key || '') } })
})
</script>
