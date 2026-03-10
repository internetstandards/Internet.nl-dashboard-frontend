<template>
  <section>
    <h2>{{ $t('authentication.mfa_deactivate_totp.title') }}</h2>
    <p>{{ $t('authentication.mfa_deactivate_totp.intro') }}</p>
    <b-button variant="danger" :disabled="loading" @click="submit">{{ $t('authentication.mfa_deactivate_totp.submit') }}</b-button>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { deactivateTOTPAuthenticator } from '@/allauth/lib/allauth'

const router = useRouter()
const route = useRoute()
const loading = ref(false)
const mfaOverviewPath = computed(() =>
  route.path.startsWith('/profile/authentication') ? '/profile/authentication/2fa' : '/account/2fa'
)

async function submit() {
  loading.value = true
  try {
    const response = await deactivateTOTPAuthenticator()
    if (response?.status === 200) {
      await router.replace(mfaOverviewPath.value)
    }
  } finally {
    loading.value = false
  }
}
</script>
