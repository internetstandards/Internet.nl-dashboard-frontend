<template>
  <section>
    <h2>Passkey Sign Up</h2>
    <p>Already have an account? <router-link to="/account/login">Login</router-link>.</p>

    <form @submit.prevent="submit">
      <label class="form-label" for="signup-passkey-email">Email</label>
      <input id="signup-passkey-email" v-model="email" type="email" class="form-control" required>
      <FormErrors :errors="response?.errors" param="email" />
      <FormErrors :errors="response?.errors" />
      <div class="d-flex gap-2 mt-3">
        <b-button type="submit" variant="primary" :disabled="loading">Sign up</b-button>
        <b-button type="button" variant="outline-secondary" to="/account/signup">Use password signup</b-button>
      </div>
    </form>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import FormErrors from '@/components/allauth/FormErrors.vue'
import { signUpByPasskey } from '@/allauth/lib/allauth'
import { pathForPendingFlow } from '@/allauth/flows'

const router = useRouter()
const email = ref('')
const response = ref(null)
const loading = ref(false)

async function submit() {
  loading.value = true
  try {
    response.value = await signUpByPasskey({ email: email.value })
    const pendingPath = pathForPendingFlow(response.value)
    if (pendingPath) {
      await router.replace(pendingPath)
    }
  } finally {
    loading.value = false
  }
}
</script>
