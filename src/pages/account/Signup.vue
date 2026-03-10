<template>
  <section>
    <h2>{{ $t('authentication.signup.title') }}</h2>
    <p>{{ $t('authentication.signup.already_have_account') }} <router-link to="/account/login">{{ $t('authentication.signup.login') }}</router-link>.</p>

    <form @submit.prevent="submit" class="mb-3">
      <template v-if="usernameEnabled">
        <label class="form-label" for="signup-username">{{ $t('authentication.signup.username') }}</label>
        <input id="signup-username" v-model="username" type="text" class="form-control" required>
        <FormErrors :errors="response?.errors" param="username" />
      </template>

      <label class="form-label" for="signup-email">{{ $t('authentication.signup.email') }}</label>
      <input id="signup-email" v-model="email" type="email" class="form-control" required>
      <FormErrors :errors="response?.errors" param="email" />

      <label class="form-label mt-2" for="signup-password">{{ $t('authentication.signup.password') }}</label>
      <input id="signup-password" v-model="password1" type="password" class="form-control" autocomplete="new-password" required>
      <FormErrors :errors="response?.errors" param="password" />

      <label class="form-label mt-2" for="signup-password-2">{{ $t('authentication.signup.password_again') }}</label>
      <input id="signup-password-2" v-model="password2" type="password" class="form-control" required>
      <FormErrors :errors="password2Errors" param="password2" />

      <FormErrors :errors="nonFieldErrors" />

      <div class="d-flex gap-2 mt-3">
        <b-button type="submit" variant="warning" :disabled="loading">{{ $t('authentication.signup.submit') }}</b-button>
        <b-button type="button" variant="outline-secondary" to="/account/signup/passkey">{{ $t('authentication.signup.passkey_signup') }}</b-button>
      </div>
    </form>

    <ProviderButtons callback-url="/account/provider/callback" />
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import FormErrors from '@/components/allauth/FormErrors.vue'
import ProviderButtons from '@/components/allauth/ProviderButtons.vue'
import { signUp } from '@/allauth/lib/allauth'
import { pathForPendingFlow } from '@/allauth/flows'
import { allauthStore } from '@/allauthStore'

const router = useRouter()
const allauth = allauthStore()
const { t } = useI18n()

const username = ref('')
const email = ref('')
const password1 = ref('')
const password2 = ref('')
const password2Errors = ref([])
const response = ref(null)
const loading = ref(false)
const fieldErrorParams = new Set(['username', 'email', 'password', 'password2'])
const nonFieldErrors = computed(() =>
  (response.value?.errors || []).filter((error) => !fieldErrorParams.has(error?.param))
)
const usernameEnabled = computed(() => {
  const methods = allauth.config?.data?.account?.login_methods
  if (Array.isArray(methods) && methods.includes('username')) {
    return true
  }
  return allauth.config?.data?.account?.authentication_method === 'username'
})

async function submit() {
  if (password1.value !== password2.value) {
    password2Errors.value = [{ param: 'password2', message: t('authentication.signup.password_mismatch') }]
    return
  }

  password2Errors.value = []
  loading.value = true
  try {
    const payload = {
      email: email.value,
      password: password1.value
    }
    if (usernameEnabled.value) {
      payload.username = username.value
    }
    response.value = await signUp(payload)

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
