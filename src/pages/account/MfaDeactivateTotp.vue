<template>
  <section>
    <h2>Deactivate Authenticator App</h2>
    <p>You are about to deactivate authenticator app based authentication.</p>
    <b-button variant="danger" :disabled="loading" @click="submit">Deactivate</b-button>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { deactivateTOTPAuthenticator } from '@/allauth/lib/allauth'

const router = useRouter()
const loading = ref(false)

async function submit() {
  loading.value = true
  try {
    const response = await deactivateTOTPAuthenticator()
    if (response?.status === 200) {
      await router.replace('/account/2fa')
    }
  } finally {
    loading.value = false
  }
}
</script>
