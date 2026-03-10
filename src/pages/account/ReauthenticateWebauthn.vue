<template>
  <section>
    <h2>{{ $t('authentication.reauthenticate_webauthn.title') }}</h2>
    <p>{{ $t('authentication.reauthenticate_webauthn.intro') }}</p>
    <b-alert variant="danger" :model-value="Boolean(errorMessage)">{{ errorMessage }}</b-alert>
    <b-button variant="warning" :disabled="loading" @click="submit">{{ $t('authentication.reauthenticate_webauthn.submit') }}</b-button>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { getWebAuthnRequestOptionsForReauthentication, reauthenticateUsingWebAuthn } from '@/allauth/lib/allauth'
import { pathForPendingFlow } from '@/allauth/flows'
import { getRequestOptionsJSON } from '@/allauth/webauthn'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const loading = ref(false)
const errorMessage = ref('')

async function submit() {
  loading.value = true
  try {
    if (!window.PublicKeyCredential?.parseRequestOptionsFromJSON) {
      errorMessage.value = t('authentication.reauthenticate_webauthn.browser_not_supported')
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
      errorMessage.value = t('authentication.reauthenticate_webauthn.unavailable')
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
    errorMessage.value = error?.message || t('authentication.reauthenticate_webauthn.failed')
  } finally {
    loading.value = false
  }
}
</script>
