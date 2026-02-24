<template>
  <section>
    <h2>Two-Factor Authentication</h2>
    <p>Use your security key.</p>
    <b-alert variant="danger" :model-value="Boolean(errorMessage)">{{ errorMessage }}</b-alert>
    <b-button variant="warning" :disabled="loading" @click="submit">Use security key</b-button>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Flows, getWebAuthnRequestOptionsForAuthentication, authenticateUsingWebAuthn } from '@/allauth/lib/allauth'
import { pathForPendingFlow } from '@/allauth/flows'
import { allauthStore } from '@/allauthStore'
import { getRequestOptionsJSON } from '@/allauth/webauthn'

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
    if (optionsResponse?.status !== 200) {
      const pendingPath = pathForPendingFlow(optionsResponse)
      if (pendingPath) {
        const next = encodeURIComponent(route.fullPath)
        await router.replace(`${pendingPath}?next=${next}`)
        return
      }
      errorMessage.value = 'Passkey authentication is currently not available.'
      return
    }
    const optionsJson = getRequestOptionsJSON(optionsResponse.data)
    const options = window.PublicKeyCredential.parseRequestOptionsFromJSON(optionsJson)
    const receivedCredential = await navigator.credentials.get({ publicKey: options })
    const credential = receivedCredential?.toJSON ? receivedCredential.toJSON() : receivedCredential
    const response = await authenticateUsingWebAuthn(credential)
    if (response?.status === 200) {
      await allauth.syncDashboardSession()
      const nextPath = route.query.next || '/domains'
      await router.replace(String(nextPath))
    }
  } catch (error) {
    errorMessage.value = error?.message || 'Unable to complete passkey authentication.'
  } finally {
    loading.value = false
  }
}
</script>
