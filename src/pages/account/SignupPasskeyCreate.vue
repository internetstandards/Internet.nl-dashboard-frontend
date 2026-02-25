<template>
  <section>
    <h2>Create Passkey</h2>
    <p>Create a passkey for your account.</p>

    <form @submit.prevent="submit">
      <label class="form-label" for="signup-passkey-name">Name</label>
      <input id="signup-passkey-name" v-model="name" class="form-control" required>
      <FormErrors :errors="response?.errors" param="name" />
      <FormErrors :errors="response?.errors" />
      <b-button class="mt-3" type="submit" variant="warning" :disabled="loading">Create</b-button>
    </form>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import FormErrors from '@/components/allauth/FormErrors.vue'
import { Flows, getWebAuthnCreateOptionsAtSignup, signupWebAuthnCredential } from '@/allauth/lib/allauth'
import { allauthStore } from '@/allauthStore'
import { pathForPendingFlow } from '@/allauth/flows'
import { getCreationOptionsJSON } from '@/allauth/webauthn'

const router = useRouter()
const allauth = allauthStore()

const name = ref('')
const response = ref(null)
const loading = ref(false)

onMounted(async () => {
  await allauth.refreshAuth()
  if (allauth.pendingFlow?.id !== Flows.MFA_WEBAUTHN_SIGNUP) {
    await router.replace('/account/signup/passkey')
  }
})

async function submit() {
  loading.value = true
  try {
    const optionsResponse = await getWebAuthnCreateOptionsAtSignup(true)
    if (optionsResponse.status !== 200) {
      response.value = optionsResponse
      const pendingPath = pathForPendingFlow(optionsResponse)
      if (pendingPath) {
        await router.replace(pendingPath)
      }
      return
    }

    if (!window.PublicKeyCredential?.parseCreationOptionsFromJSON) {
      response.value = { errors: [{ param: 'passkey', message: 'This browser does not support passkey setup.' }] }
      return
    }
    const optionsJson = getCreationOptionsJSON(optionsResponse.data)
    const options = window.PublicKeyCredential.parseCreationOptionsFromJSON(optionsJson)
    const createdCredential = await navigator.credentials.create({ publicKey: options })
    const credential = createdCredential?.toJSON ? createdCredential.toJSON() : createdCredential
    response.value = await signupWebAuthnCredential(name.value, credential)
    const pendingPath = pathForPendingFlow(response.value)
    if (pendingPath) {
      await router.replace(pendingPath)
      return
    }

    if (response.value?.status === 200) {
      await allauth.syncDashboardSession()
      await router.replace('/domains')
      return
    }

    if (response.value?.status === 409) {
      await router.replace('/account/signup/passkey')
    }
  } catch (error) {
    response.value = { errors: [{ param: 'passkey', message: error?.message || 'Unable to create passkey.' }] }
  } finally {
    loading.value = false
  }
}
</script>
