<template>
  <section>
    <h2>{{ $t('authentication.reauthenticate_totp.title') }}</h2>
    <p>{{ $t('authentication.reauthenticate_totp.intro') }}</p>

    <form @submit.prevent="submit">
      <label class="form-label" for="reauth-totp-code">{{ $t('authentication.reauthenticate_totp.code') }}</label>
      <input id="reauth-totp-code" v-model="code" class="form-control" required>
      <FormErrors :errors="response?.errors" param="code" />
      <FormErrors :errors="response?.errors" />
      <b-button type="submit" class="mt-3" :disabled="loading" variant="warning">{{ $t('authentication.reauthenticate_totp.submit') }}</b-button>
    </form>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import FormErrors from '@/components/allauth/FormErrors.vue'
import { mfaReauthenticate } from '@/allauth/lib/allauth'

const route = useRoute()
const router = useRouter()

const code = ref('')
const response = ref(null)
const loading = ref(false)

async function submit() {
  loading.value = true
  try {
    response.value = await mfaReauthenticate(code.value)
    if (response.value?.status === 200) {
      const nextPath = route.query.next || '/account'
      await router.replace(String(nextPath))
    }
  } finally {
    loading.value = false
  }
}
</script>
