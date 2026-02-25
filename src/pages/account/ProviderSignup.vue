<template>
  <section>
    <h2>Provider Signup</h2>
    <p>Complete your signup with an email address.</p>

    <form @submit.prevent="submit">
      <label class="form-label" for="provider-signup-email">Email</label>
      <input id="provider-signup-email" v-model="email" type="email" class="form-control" required>
      <FormErrors :errors="response?.errors" param="email" />
      <FormErrors :errors="response?.errors" />

      <div class="d-flex gap-2 mt-3">
        <b-button type="submit" :disabled="loading" variant="warning">Sign up</b-button>
        <b-button type="button" to="/account/login" variant="outline-secondary">Back to login</b-button>
      </div>
    </form>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import FormErrors from '@/components/allauth/FormErrors.vue'
import { providerSignup } from '@/allauth/lib/allauth'
import { pathForPendingFlow } from '@/allauth/flows'
import { allauthStore } from '@/allauthStore'

const router = useRouter()
const allauth = allauthStore()

const email = ref('')
const response = ref(null)
const loading = ref(false)

async function submit() {
  loading.value = true
  try {
    response.value = await providerSignup({ email: email.value })

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
