<template>
  <section>
    <h2>{{ $t('authentication.authenticate_webauthn.title') }}</h2>
    <p>{{ $t('authentication.authenticate_webauthn.intro') }}</p>
    <b-alert variant="danger" :model-value="Boolean(errorMessage)">{{ errorMessage }}</b-alert>
    <b-button variant="warning" :disabled="loading" @click="submit">{{ $t('authentication.authenticate_webauthn.submit') }}</b-button>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Flows, getWebAuthnRequestOptionsForAuthentication, authenticateUsingWebAuthn } from '@/allauth/lib/allauth'
import { pathForPendingFlow } from '@/allauth/flows'
import { allauthStore } from '@/allauthStore'
import { getRequestOptionsJSON } from '@/allauth/webauthn'

const route = useRoute()
const router = useRouter()
const allauth = allauthStore()
const { t } = useI18n()
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
      errorMessage.value = t('authentication.authenticate_webauthn.browser_not_supported')
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
      errorMessage.value = t('authentication.authenticate_webauthn.unavailable')
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
    errorMessage.value = error?.message || t('authentication.authenticate_webauthn.failed')
  } finally {
    loading.value = false
  }
}
</script>
