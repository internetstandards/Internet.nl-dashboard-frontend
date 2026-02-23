<template>
  <section>
    <h2>Confirm Email Address</h2>

    <template v-if="emailVerificationByCodeEnabled">
      <p>Enter the verification code sent to your email.</p>
      <form @submit.prevent="submitByCode">
        <label class="form-label" for="verify-email-code">Code</label>
        <input id="verify-email-code" v-model="code" class="form-control" required>
        <FormErrors :errors="response?.errors" param="key" />
        <FormErrors :errors="response?.errors" />
        <b-button type="submit" class="mt-3" variant="primary" :disabled="loading">Confirm</b-button>
      </form>
    </template>

    <template v-else>
      <p>Please confirm your email address from the link sent to your mailbox.</p>
    </template>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import FormErrors from '@/components/allauth/FormErrors.vue'
import { verifyEmail } from '@/allauth/lib/allauth'
import { allauthStore } from '@/allauthStore'

const router = useRouter()
const allauth = allauthStore()

const loading = ref(false)
const code = ref('')
const response = ref(null)

const emailVerificationByCodeEnabled = computed(() => Boolean(allauth.config?.data?.account?.email_verification_by_code_enabled))

async function submitByCode() {
  loading.value = true
  try {
    response.value = await verifyEmail(code.value)
    if ([200, 401].includes(response.value?.status)) {
      await router.replace('/account/email')
    }
  } finally {
    loading.value = false
  }
}
</script>
