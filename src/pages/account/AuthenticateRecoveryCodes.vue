<template>
  <section>
    <h2>{{ $t('authentication.authenticate_recovery_codes.title') }}</h2>
    <p>{{ $t('authentication.authenticate_recovery_codes.intro') }}</p>

    <form @submit.prevent="submit">
      <label class="form-label" for="auth-recovery-code">{{ $t('authentication.authenticate_recovery_codes.code') }}</label>
      <input id="auth-recovery-code" v-model="code" class="form-control" required>
      <FormErrors :errors="response?.errors" param="code" />
      <FormErrors :errors="nonFieldErrors" />
      <b-button type="submit" class="mt-3" :disabled="loading" variant="warning">{{ $t('authentication.authenticate_recovery_codes.submit') }}</b-button>
    </form>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
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
const nonFieldErrors = computed(() =>
  (response.value?.errors || []).filter((error) => error?.param !== 'code')
)

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
