<template>
  <section>
    <h2>{{ $t('authentication.authenticate_totp.title') }}</h2>
    <p>{{ $t('authentication.authenticate_totp.intro') }}</p>

    <form @submit.prevent="submit">
      <label class="form-label" for="auth-totp-code">{{ $t('authentication.authenticate_totp.code') }}</label>
      <input id="auth-totp-code" v-model="code" class="form-control" required>
      <FormErrors :errors="response?.errors" param="code" />
      <FormErrors :errors="response?.errors" />
      <b-button type="submit" class="mt-3" :disabled="loading" variant="warning">{{ $t('authentication.authenticate_totp.submit') }}</b-button>
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
