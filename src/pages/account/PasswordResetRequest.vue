<template>
  <section>
    <h2>{{ $t('authentication.password_reset_request.title') }}</h2>
    <p>{{ $t('authentication.password_reset_request.remember_password') }} <router-link to="/account/login">{{ $t('authentication.password_reset_request.back_to_login') }}</router-link>.</p>

    <div v-if="response?.status === 200" class="alert alert-success">{{ $t('authentication.password_reset_request.success') }}</div>

    <form v-else @submit.prevent="submit">
      <label class="form-label" for="password-reset-email">{{ $t('authentication.password_reset_request.email') }}</label>
      <input id="password-reset-email" v-model="email" type="email" class="form-control" required>
      <FormErrors :errors="response?.errors" param="email" />
      <FormErrors :errors="response?.errors" />

      <b-button type="submit" class="mt-3" :disabled="loading" variant="warning">{{ $t('authentication.password_reset_request.submit') }}</b-button>
    </form>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import FormErrors from '@/components/allauth/FormErrors.vue'
import { requestPasswordReset } from '@/allauth/lib/allauth'

const router = useRouter()
const email = ref('')
const response = ref(null)
const loading = ref(false)

async function submit() {
  loading.value = true
  try {
    response.value = await requestPasswordReset(email.value)
    if (response.value?.status === 401) {
      await router.replace('/account/password/reset/confirm')
    }
  } finally {
    loading.value = false
  }
}
</script>
