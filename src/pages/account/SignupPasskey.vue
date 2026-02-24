<template>
  <section>
    <h2>Passkey Sign Up</h2>
    <p>Already have an account? <router-link to="/account/login">Login</router-link>.</p>

    <form @submit.prevent="submit">
      <template v-if="usernameEnabled">
        <label class="form-label" for="signup-passkey-username">Username</label>
        <input id="signup-passkey-username" v-model="username" type="text" class="form-control" required>
        <FormErrors :errors="response?.errors" param="username" />
      </template>

      <label class="form-label" for="signup-passkey-email">Email</label>
      <input id="signup-passkey-email" v-model="email" type="email" class="form-control" required>
      <FormErrors :errors="response?.errors" param="email" />
      <FormErrors :errors="response?.errors" />
      <div class="d-flex gap-2 mt-3">
        <b-button type="submit" variant="warning" :disabled="loading">Sign up</b-button>
        <b-button type="button" variant="outline-secondary" to="/account/signup">Use password signup</b-button>
      </div>
    </form>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import FormErrors from '@/components/allauth/FormErrors.vue'
import { signUpByPasskey } from '@/allauth/lib/allauth'
import { pathForPendingFlow } from '@/allauth/flows'
import { allauthStore } from '@/allauthStore'

const router = useRouter()
const allauth = allauthStore()
const username = ref('')
const email = ref('')
const response = ref(null)
const loading = ref(false)
const usernameEnabled = computed(() => {
  const methods = allauth.config?.data?.account?.login_methods
  if (Array.isArray(methods) && methods.includes('username')) {
    return true
  }
  return allauth.config?.data?.account?.authentication_method === 'username'
})

async function submit() {
  loading.value = true
  try {
    const payload = { email: email.value }
    if (usernameEnabled.value) {
      payload.username = username.value
    }
    response.value = await signUpByPasskey(payload)
    const pendingPath = pathForPendingFlow(response.value)
    if (pendingPath) {
      await router.replace(pendingPath)
    }
  } finally {
    loading.value = false
  }
}
</script>
