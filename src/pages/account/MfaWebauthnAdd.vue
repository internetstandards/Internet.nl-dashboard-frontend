<template>
  <section>
    <h2>Add Security Key</h2>

    <form @submit.prevent="submit">
      <label class="form-label" for="webauthn-name">Name</label>
      <input id="webauthn-name" v-model="name" class="form-control" required>

      <div class="form-check mt-2">
        <input id="webauthn-passwordless" v-model="passwordless" type="checkbox" class="form-check-input">
        <label class="form-check-label" for="webauthn-passwordless">Passwordless (passkey)</label>
      </div>

      <FormErrors :errors="response?.errors" param="name" />
      <FormErrors :errors="response?.errors" />

      <div class="d-flex gap-2 mt-3">
        <b-button type="submit" variant="warning" :disabled="loading">Add key</b-button>
        <b-button type="button" variant="outline-secondary" :to="mfaBasePath">Back to 2FA</b-button>
      </div>
    </form>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import FormErrors from '@/components/allauth/FormErrors.vue'
import { getWebAuthnCreateOptions, addWebAuthnCredential } from '@/allauth/lib/allauth'
import { pathForPendingFlow } from '@/allauth/flows'
import { getCreationOptionsJSON } from '@/allauth/webauthn'

const router = useRouter()
const route = useRoute()

const name = ref('')
const passwordless = ref(false)
const response = ref(null)
const loading = ref(false)
const mfaBasePath = computed(() =>
  route.path.startsWith('/profile/authentication') ? '/profile/authentication/2fa' : '/account/2fa'
)
const recoveryCodesPath = computed(() => `${mfaBasePath.value}/recovery-codes`)
const webauthnListPath = computed(() => `${mfaBasePath.value}/webauthn`)

async function redirectIfPendingFlow(authResponse) {
  const pendingPath = pathForPendingFlow(authResponse)
  if (pendingPath) {
    const next = encodeURIComponent(route.fullPath)
    await router.replace(`${pendingPath}?next=${next}`)
    return true
  }
  return false
}

async function submit() {
  loading.value = true
  try {
    const optionsResponse = await getWebAuthnCreateOptions(passwordless.value)
    if (optionsResponse.status !== 200) {
      response.value = optionsResponse
      if (await redirectIfPendingFlow(optionsResponse)) {
        return
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
    response.value = await addWebAuthnCredential(name.value, credential)

    if (await redirectIfPendingFlow(response.value)) {
      return
    }

    if (response.value?.status === 200) {
      const destination = response.value.meta?.recovery_codes_generated
        ? recoveryCodesPath.value
        : webauthnListPath.value
      await router.replace(destination)
    }
  } catch (error) {
    response.value = { errors: [{ param: 'passkey', message: error?.message || 'Unable to add security key.' }] }
  } finally {
    loading.value = false
  }
}
</script>
