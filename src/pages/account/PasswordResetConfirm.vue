<template>
  <section>
    <h2>{{ $t('authentication.password_reset_confirm.title') }}</h2>
    <p>{{ $t('authentication.password_reset_confirm.intro') }}</p>

    <form @submit.prevent="submit">
      <label class="form-label" for="password-reset-code">{{ $t('authentication.password_reset_confirm.code') }}</label>
      <input id="password-reset-code" v-model="code" class="form-control" required>
      <FormErrors :errors="response?.errors" param="key" />
      <FormErrors :errors="response?.errors" />

      <b-button type="submit" class="mt-3" :disabled="loading" variant="warning">{{ $t('authentication.password_reset_confirm.submit') }}</b-button>
    </form>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import FormErrors from '@/components/allauth/FormErrors.vue'
import { getPasswordReset } from '@/allauth/lib/allauth'

const router = useRouter()

const code = ref('')
const response = ref(null)
const loading = ref(false)

async function submit() {
  loading.value = true
  try {
    response.value = await getPasswordReset(code.value)
    if (response.value?.status === 200) {
      await router.replace({ path: '/account/password/reset/complete', query: { key: code.value } })
    }
    if (response.value?.status === 409) {
      await router.replace('/account/password/reset')
    }
  } finally {
    loading.value = false
  }
}
</script>
