<template>
  <section>
    <h2>Reset Password</h2>
    <p>Remember your password? <router-link to="/account/login">Back to login</router-link>.</p>

    <div v-if="response?.status === 200" class="alert alert-success">Password reset instructions were sent.</div>

    <form v-else @submit.prevent="submit">
      <label class="form-label" for="password-reset-email">Email</label>
      <input id="password-reset-email" v-model="email" type="email" class="form-control" required>
      <FormErrors :errors="response?.errors" param="email" />
      <FormErrors :errors="response?.errors" />

      <b-button type="submit" class="mt-3" :disabled="loading" variant="primary">Reset</b-button>
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
