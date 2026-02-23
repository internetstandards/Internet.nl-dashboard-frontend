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

      <b-button class="mt-3" type="submit" variant="primary" :disabled="loading">Add key</b-button>
    </form>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import FormErrors from '@/components/allauth/FormErrors.vue'
import { getWebAuthnCreateOptions, addWebAuthnCredential } from '@/allauth/lib/allauth'

const router = useRouter()

const name = ref('')
const passwordless = ref(false)
const response = ref(null)
const loading = ref(false)

async function submit() {
  loading.value = true
  try {
    const optionsResponse = await getWebAuthnCreateOptions(passwordless.value)
    if (optionsResponse.status !== 200) {
      response.value = optionsResponse
      return
    }

    if (!window.PublicKeyCredential?.parseCreationOptionsFromJSON) {
      response.value = { errors: [{ param: 'passkey', message: 'This browser does not support passkey setup.' }] }
      return
    }
    const options = window.PublicKeyCredential.parseCreationOptionsFromJSON(optionsResponse.data.creation_options)
    const createdCredential = await navigator.credentials.create({ publicKey: options })
    const credential = createdCredential?.toJSON ? createdCredential.toJSON() : createdCredential
    response.value = await addWebAuthnCredential(name.value, credential)

    if (response.value?.status === 200) {
      const destination = response.value.meta?.recovery_codes_generated
        ? '/account/2fa/recovery-codes'
        : '/account/2fa/webauthn'
      await router.replace(destination)
    }
  } finally {
    loading.value = false
  }
}
</script>
