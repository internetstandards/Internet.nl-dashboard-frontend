<template>
  <section v-if="error">
    <h2>Third-party Login Failure</h2>
    <p>Something went wrong at the identity provider callback stage.</p>
    <b-button variant="outline-secondary" :to="targetPath">Continue</b-button>
  </section>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { allauthStore } from '@/allauthStore'

const route = useRoute()
const router = useRouter()
const allauth = allauthStore()

const error = computed(() => route.query.error)

const targetPath = computed(() => {
  if (allauth.isAuthenticated) {
    return '/domains'
  }
  return allauth.pendingFlowPath || '/account/login'
})

onMounted(async () => {
  await allauth.refreshAuth()
  if (!error.value) {
    await router.replace(targetPath.value)
  }
})
</script>
