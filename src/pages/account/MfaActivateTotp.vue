<template>
  <section>
    <h2>{{ $t('authentication.mfa_activate_totp.title') }}</h2>

    <template v-if="totp?.status === 200">
      <p>{{ $t('authentication.mfa_activate_totp.already_active') }}</p>
      <b-button variant="outline-secondary" :to="mfaOverviewPath">{{ $t('authentication.mfa_activate_totp.back') }}</b-button>
    </template>

    <template v-else>
      <div v-if="totpUrl" class="mb-3 text-center">
        <p class="mb-2">{{ $t('authentication.mfa_activate_totp.scan_qr') }}</p>
        <qrcode-vue :value="totpUrl" :size="220" level="M" render-as="svg" />
      </div>

      <label class="form-label" for="totp-secret">{{ $t('authentication.mfa_activate_totp.secret') }}</label>
      <input id="totp-secret" :value="totpSecret" class="form-control" disabled>
      <small class="text-muted">{{ $t('authentication.mfa_activate_totp.secret_help') }}</small>

      <form class="mt-3" @submit.prevent="submit">
        <label class="form-label" for="totp-code">{{ $t('authentication.mfa_activate_totp.code') }}</label>
        <input id="totp-code" v-model="code" class="form-control" required>
        <FormErrors :errors="response?.errors" param="code" />
        <FormErrors :errors="totp?.errors || response?.errors" />
        <b-button type="submit" class="mt-3" :disabled="loading" variant="warning">{{ $t('authentication.mfa_activate_totp.submit') }}</b-button>
      </form>
      <b-button class="mt-2" variant="outline-secondary" :to="mfaOverviewPath">{{ $t('authentication.mfa_activate_totp.back') }}</b-button>
    </template>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import QrcodeVue from 'qrcode.vue'
import FormErrors from '@/components/allauth/FormErrors.vue'
import { getTOTPAuthenticator, activateTOTPAuthenticator } from '@/allauth/lib/allauth'

const router = useRouter()
const route = useRoute()

const code = ref('')
const loading = ref(false)
const response = ref(null)
const totp = ref(null)
const totpSecret = computed(() => totp.value?.meta?.secret || '')
const totpUrl = computed(() => totp.value?.meta?.totp_url || '')
const mfaOverviewPath = computed(() =>
  route.path.startsWith('/profile/authentication') ? '/profile/authentication/2fa' : '/account/2fa'
)

onMounted(async () => {
  totp.value = await getTOTPAuthenticator()
})

async function submit() {
  loading.value = true
  try {
    response.value = await activateTOTPAuthenticator(code.value)
    if (response.value?.status === 200) {
      await router.replace(mfaOverviewPath.value)
    }
  } finally {
    loading.value = false
  }
}
</script>
