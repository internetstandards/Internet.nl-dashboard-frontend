<template>
  <section>
    <h2>Two-Factor Authentication</h2>
    <p>Use your security key.</p>
    <b-alert variant="danger" :model-value="Boolean(errorMessage)">{{ errorMessage }}</b-alert>
    <b-button variant="primary" :disabled="loading" @click="submit">Use security key</b-button>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Flows, getWebAuthnRequestOptionsForAuthentication, authenticateUsingWebAuthn } from '@/allauth/lib/allauth'
import { allauthStore } from '@/allauthStore'

const route = useRoute()
const router = useRouter()
const allauth = allauthStore()
const loading = ref(false)
const errorMessage = ref('')

onMounted(async () => {
  await allauth.refreshAuth()
  if (allauth.pendingFlow?.id !== Flows.MFA_AUTHENTICATE) {
    await router.replace('/account/login')
  }
})

async function submit() {
  loading.value = true
  try {
    if (!window.PublicKeyCredential?.parseRequestOptionsFromJSON) {
      errorMessage.value = 'This browser does not support passkey authentication.'
      return
    }
    const optionsResponse = await getWebAuthnRequestOptionsForAuthentication()
    const options = window.PublicKeyCredential.parseRequestOptionsFromJSON(optionsResponse.data.request_options)
    const receivedCredential = await navigator.credentials.get({ publicKey: options })
    const credential = receivedCredential?.toJSON ? receivedCredential.toJSON() : receivedCredential
    const response = await authenticateUsingWebAuthn(credential)
    if (response?.status === 200) {
      await allauth.syncDashboardSession()
      const nextPath = route.query.next || '/domains'
      await router.replace(String(nextPath))
    }
  } finally {
    loading.value = false
  }
}
</script>
