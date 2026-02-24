<template>
  <section>
    <h2>Request Login Code</h2>
    <p>Enter your email and we will send a sign-in code.</p>

    <form @submit.prevent="submit">
      <label class="form-label" for="request-login-code-email">Email</label>
      <input id="request-login-code-email" v-model="email" type="email" class="form-control" required>
      <FormErrors :errors="response?.errors" param="email" />
      <FormErrors :errors="response?.errors" />

      <div class="d-flex gap-2 mt-3">
        <b-button type="submit" :disabled="loading" variant="warning">Send code</b-button>
        <b-button type="button" to="/account/login" variant="outline-secondary">Back to login</b-button>
      </div>
    </form>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import FormErrors from '@/components/allauth/FormErrors.vue'
import { requestLoginCode } from '@/allauth/lib/allauth'

const router = useRouter()

const email = ref('')
const response = ref(null)
const loading = ref(false)

async function submit() {
  loading.value = true
  try {
    response.value = await requestLoginCode(email.value)
    if (response.value?.status === 401) {
      await router.replace('/account/login/code/confirm')
    }
  } finally {
    loading.value = false
  }
}
</script>
