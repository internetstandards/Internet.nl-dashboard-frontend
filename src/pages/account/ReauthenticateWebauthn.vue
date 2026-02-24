<template>
  <section>
    <h2>Confirm Access</h2>
    <p>Use your security key.</p>
    <b-alert variant="danger" :model-value="Boolean(errorMessage)">{{ errorMessage }}</b-alert>
    <b-button variant="warning" :disabled="loading" @click="submit">Use security key</b-button>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getWebAuthnRequestOptionsForReauthentication, reauthenticateUsingWebAuthn } from '@/allauth/lib/allauth'
import { pathForPendingFlow } from '@/allauth/flows'
import { getRequestOptionsJSON } from '@/allauth/webauthn'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const errorMessage = ref('')

async function submit() {
  loading.value = true
  try {
    if (!window.PublicKeyCredential?.parseRequestOptionsFromJSON) {
      errorMessage.value = 'This browser does not support passkey reauthentication.'
      return
    }
    const optionsResponse = await getWebAuthnRequestOptionsForReauthentication()
    if (optionsResponse?.status !== 200) {
      const pendingPath = pathForPendingFlow(optionsResponse)
      if (pendingPath) {
        const next = encodeURIComponent(route.fullPath)
        await router.replace(`${pendingPath}?next=${next}`)
        return
      }
      errorMessage.value = 'Passkey reauthentication is currently not available.'
      return
    }
    const optionsJson = getRequestOptionsJSON(optionsResponse.data)
    const options = window.PublicKeyCredential.parseRequestOptionsFromJSON(optionsJson)
    const receivedCredential = await navigator.credentials.get({ publicKey: options })
    const credential = receivedCredential?.toJSON ? receivedCredential.toJSON() : receivedCredential
    const response = await reauthenticateUsingWebAuthn(credential)
    if (response?.status === 200) {
      const nextPath = route.query.next || '/account'
      await router.replace(String(nextPath))
    }
  } catch (error) {
    errorMessage.value = error?.message || 'Unable to complete passkey reauthentication.'
  } finally {
    loading.value = false
  }
}
</script>
