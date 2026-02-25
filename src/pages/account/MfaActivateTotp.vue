<template>
  <section>
    <h2>Activate TOTP</h2>

    <template v-if="totp?.status === 200">
      <p>TOTP is already active.</p>
      <b-button variant="outline-secondary" :to="mfaOverviewPath">Back to 2FA</b-button>
    </template>

    <template v-else>
      <div v-if="totpUrl" class="mb-3 text-center">
        <p class="mb-2">Scan this QR code with your authenticator app:</p>
        <qrcode-vue :value="totpUrl" :size="220" level="M" render-as="svg" />
      </div>

      <label class="form-label" for="totp-secret">Authenticator secret</label>
      <input id="totp-secret" :value="totpSecret" class="form-control" disabled>
      <small class="text-muted">Store this secret to reconfigure your authenticator later.</small>

      <form class="mt-3" @submit.prevent="submit">
        <label class="form-label" for="totp-code">Authenticator code</label>
        <input id="totp-code" v-model="code" class="form-control" required>
        <FormErrors :errors="response?.errors" param="code" />
        <FormErrors :errors="totp?.errors || response?.errors" />
        <b-button type="submit" class="mt-3" :disabled="loading" variant="warning">Activate</b-button>
      </form>
      <b-button class="mt-2" variant="outline-secondary" :to="mfaOverviewPath">Back to 2FA</b-button>
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
