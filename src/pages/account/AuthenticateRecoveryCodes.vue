<template>
  <section>
    <h2>Two-Factor Authentication</h2>
    <p>Enter one of your recovery codes.</p>

    <form @submit.prevent="submit">
      <label class="form-label" for="auth-recovery-code">Recovery code</label>
      <input id="auth-recovery-code" v-model="code" class="form-control" required>
      <FormErrors :errors="response?.errors" param="code" />
      <FormErrors :errors="response?.errors" />
      <b-button type="submit" class="mt-3" :disabled="loading" variant="primary">Sign in</b-button>
    </form>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import FormErrors from '@/components/allauth/FormErrors.vue'
import { mfaAuthenticate, Flows } from '@/allauth/lib/allauth'
import { allauthStore } from '@/allauthStore'

const allauth = allauthStore()
const route = useRoute()
const router = useRouter()

const code = ref('')
const response = ref(null)
const loading = ref(false)

onMounted(async () => {
  await allauth.refreshAuth()
  if (allauth.pendingFlow?.id !== Flows.MFA_AUTHENTICATE) {
    await router.replace('/account/login')
  }
})

async function submit() {
  loading.value = true
  try {
    response.value = await mfaAuthenticate(code.value)
    if (response.value?.status === 200) {
      await allauth.syncDashboardSession()
      const nextPath = route.query.next || '/domains'
      await router.replace(String(nextPath))
    }
  } finally {
    loading.value = false
  }
}
</script>
