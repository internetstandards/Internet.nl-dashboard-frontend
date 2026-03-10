<template>
  <section>
    <h2>{{ $t('authentication.login_code_confirm.title') }}</h2>
    <p>{{ $t('authentication.login_code_confirm.intro') }}</p>

    <form @submit.prevent="submit">
      <label class="form-label" for="confirm-login-code">{{ $t('authentication.login_code_confirm.code') }}</label>
      <input id="confirm-login-code" v-model="code" class="form-control" required>
      <FormErrors :errors="response?.errors" param="code" />
      <FormErrors :errors="response?.errors" />

      <div class="d-flex gap-2 mt-3">
        <b-button type="submit" :disabled="loading" variant="warning">{{ $t('authentication.login_code_confirm.submit') }}</b-button>
        <b-button type="button" to="/account/login" variant="outline-secondary">{{ $t('authentication.login_code_confirm.back_to_login') }}</b-button>
      </div>
    </form>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import FormErrors from '@/components/allauth/FormErrors.vue'
import { confirmLoginCode } from '@/allauth/lib/allauth'
import { pathForPendingFlow } from '@/allauth/flows'
import { allauthStore } from '@/allauthStore'

const router = useRouter()
const route = useRoute()
const allauth = allauthStore()

const code = ref('')
const response = ref(null)
const loading = ref(false)

async function submit() {
  loading.value = true
  try {
    response.value = await confirmLoginCode(code.value)

    if (response.value?.status === 200) {
      await allauth.syncDashboardSession()
      const nextPath = route.query.next || '/domains'
      await router.replace(String(nextPath))
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
