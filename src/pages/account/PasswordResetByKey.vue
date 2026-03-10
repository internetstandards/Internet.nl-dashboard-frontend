<template>
  <section>
    <h2>{{ $t('authentication.password_reset_by_key.title') }}</h2>
    <p>{{ $t('authentication.password_reset_by_key.validating') }}</p>
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
