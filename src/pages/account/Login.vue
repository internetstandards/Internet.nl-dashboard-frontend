<template>
  <section>
    <h2>Login</h2>
    <p>No account yet? <router-link to="/account/signup">Create one</router-link>.</p>

    <form @submit.prevent="submit" class="mb-3">
      <label class="form-label" for="login-identifier">{{ identifierLabel }}</label>
      <input id="login-identifier" v-model="identifier" :type="identifierInputType" class="form-control" required>
      <FormErrors :errors="response?.errors" :param="selectedLoginMethod" />
      <div v-if="loginMethods.length > 1" class="mt-2">
        <label class="form-label" for="login-method">Login method</label>
        <select id="login-method" v-model="selectedLoginMethod" class="form-select">
          <option v-for="method in loginMethods" :key="method" :value="method">{{ methodLabel(method) }}</option>
        </select>
      </div>

      <label class="form-label mt-2" for="login-password">Password</label>
      <input id="login-password" v-model="password" type="password" class="form-control" required>
      <FormErrors :errors="response?.errors" param="password" />

      <FormErrors :errors="response?.errors" />

      <div class="d-flex gap-2 mt-3">
        <b-button type="submit" variant="primary" :disabled="loading">Login</b-button>
        <b-button type="button" variant="outline-secondary" to="/account/password/reset">Forgot password</b-button>
        <b-button v-if="loginByCodeEnabled" type="button" variant="outline-secondary" to="/account/login/code">Send login code</b-button>
        <b-button type="button" variant="outline-secondary" :disabled="loadingPasskey" @click="submitPasskey">Sign in with a passkey</b-button>
      </div>
      <b-alert variant="danger" :model-value="Boolean(passkeyError)" class="mt-3">{{ passkeyError }}</b-alert>
    </form>

    <ProviderButtons callback-url="/account/provider/callback" />
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import FormErrors from '@/components/allauth/FormErrors.vue'
import ProviderButtons from '@/components/allauth/ProviderButtons.vue'
import { getWebAuthnRequestOptionsForLogin, login, loginUsingWebAuthn } from '@/allauth/lib/allauth'
import { pathForPendingFlow } from '@/allauth/flows'
import { allauthStore } from '@/allauthStore'

const router = useRouter()
const route = useRoute()
const allauth = allauthStore()

const identifier = ref('')
const password = ref('')
const loading = ref(false)
const loadingPasskey = ref(false)
const response = ref(null)
const passkeyError = ref('')

const loginMethods = computed(() => {
  const methods = allauth.config?.data?.account?.login_methods
  return Array.isArray(methods) && methods.length ? methods : ['email']
})

const selectedLoginMethod = ref('email')
const preferredLoginMethod = computed(() => allauth.config?.data?.account?.authentication_method)

watch(
  [loginMethods, preferredLoginMethod],
  (methods) => {
    if (methods.includes(preferredLoginMethod.value)) {
      selectedLoginMethod.value = preferredLoginMethod.value
      return
    }
    if (!methods.includes(selectedLoginMethod.value)) {
      selectedLoginMethod.value = methods[0]
    }
  },
  { immediate: true }
)

const identifierLabel = computed(() => methodLabel(selectedLoginMethod.value))
const identifierInputType = computed(() => {
  if (selectedLoginMethod.value === 'email') {
    return 'email'
  }
  if (selectedLoginMethod.value === 'phone') {
    return 'tel'
  }
  return 'text'
})

const loginByCodeEnabled = computed(() => Boolean(allauth.config?.data?.account?.login_by_code_enabled))

function methodLabel(method) {
  if (method === 'username') {
    return 'Username'
  }
  if (method === 'phone') {
    return 'Phone'
  }
  return 'Email'
}

async function submit() {
  loading.value = true
  try {
    response.value = await login({
      [selectedLoginMethod.value]: identifier.value,
      password: password.value
    })
    const pendingPath = pathForPendingFlow(response.value)

    if (response.value?.status === 200) {
      await allauth.syncDashboardSession()
      const nextPath = route.query.next || '/domains'
      await router.replace(String(nextPath))
      return
    }

    if (pendingPath) {
      await router.replace(pendingPath)
      return
    }
  } finally {
    loading.value = false
  }
}

async function submitPasskey() {
  loadingPasskey.value = true
  passkeyError.value = ''

  try {
    if (!window.PublicKeyCredential?.parseRequestOptionsFromJSON || !navigator.credentials?.get) {
      passkeyError.value = 'This browser does not support passkey login.'
      return
    }

    const optionsResponse = await getWebAuthnRequestOptionsForLogin()
    const options = window.PublicKeyCredential.parseRequestOptionsFromJSON(optionsResponse.data.request_options)
    const rawCredential = await navigator.credentials.get({ publicKey: options })
    const credential = rawCredential?.toJSON ? rawCredential.toJSON() : rawCredential

    response.value = await loginUsingWebAuthn(credential)
    const pendingPath = pathForPendingFlow(response.value)

    if (response.value?.status === 200) {
      await allauth.syncDashboardSession()
      const nextPath = route.query.next || '/domains'
      await router.replace(String(nextPath))
      return
    }

    if (pendingPath) {
      await router.replace(pendingPath)
    }
  } catch (error) {
    passkeyError.value = error?.message || 'Passkey login failed.'
  } finally {
    loadingPasskey.value = false
  }
}
</script>
