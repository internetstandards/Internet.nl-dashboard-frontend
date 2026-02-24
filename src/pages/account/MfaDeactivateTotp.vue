<template>
  <section>
    <h2>Deactivate Authenticator App</h2>
    <p>You are about to deactivate authenticator app based authentication.</p>
    <b-button variant="danger" :disabled="loading" @click="submit">Deactivate</b-button>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { deactivateTOTPAuthenticator } from '@/allauth/lib/allauth'

const router = useRouter()
const route = useRoute()
const loading = ref(false)
const mfaOverviewPath = computed(() =>
  route.path.startsWith('/profile/authentication') ? '/profile/authentication/2fa' : '/account/2fa'
)

async function submit() {
  loading.value = true
  try {
    const response = await deactivateTOTPAuthenticator()
    if (response?.status === 200) {
      await router.replace(mfaOverviewPath.value)
    }
  } finally {
    loading.value = false
  }
}
</script>
