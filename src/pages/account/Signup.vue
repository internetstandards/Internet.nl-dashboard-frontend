<template>
  <section>
    <h2>Sign up</h2>
    <p>Already have an account? <router-link to="/account/login">Login</router-link>.</p>

    <form @submit.prevent="submit" class="mb-3">
      <label class="form-label" for="signup-email">Email</label>
      <input id="signup-email" v-model="email" type="email" class="form-control" required>
      <FormErrors :errors="response?.errors" param="email" />

      <label class="form-label mt-2" for="signup-password">Password</label>
      <input id="signup-password" v-model="password1" type="password" class="form-control" autocomplete="new-password" required>
      <FormErrors :errors="response?.errors" param="password" />

      <label class="form-label mt-2" for="signup-password-2">Password (again)</label>
      <input id="signup-password-2" v-model="password2" type="password" class="form-control" required>
      <FormErrors :errors="password2Errors" param="password2" />

      <FormErrors :errors="response?.errors" />

      <div class="d-flex gap-2 mt-3">
        <b-button type="submit" variant="primary" :disabled="loading">Sign up</b-button>
        <b-button type="button" variant="outline-secondary" to="/account/signup/passkey">Sign up with passkey</b-button>
      </div>
    </form>

    <ProviderButtons callback-url="/account/provider/callback" />
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import FormErrors from '@/components/allauth/FormErrors.vue'
import ProviderButtons from '@/components/allauth/ProviderButtons.vue'
import { signUp } from '@/allauth/lib/allauth'
import { pathForPendingFlow } from '@/allauth/flows'
import { allauthStore } from '@/allauthStore'

const router = useRouter()
const allauth = allauthStore()

const email = ref('')
const password1 = ref('')
const password2 = ref('')
const password2Errors = ref([])
const response = ref(null)
const loading = ref(false)

async function submit() {
  if (password1.value !== password2.value) {
    password2Errors.value = [{ param: 'password2', message: 'Password does not match.' }]
    return
  }

  password2Errors.value = []
  loading.value = true
  try {
    response.value = await signUp({ email: email.value, password: password1.value })

    if (response.value?.status === 200) {
      await allauth.syncDashboardSession()
      await router.replace('/domains')
      return
    }

    const pendingPath = pathForPendingFlow(response.value)
    if (pendingPath) {
      await router.replace(pendingPath)
    }
  } finally {
    loading.value = false
  }
}
</script>
