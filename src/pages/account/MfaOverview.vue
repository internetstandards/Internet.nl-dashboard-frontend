<template>
  <section>
    <h2>{{ $t('authentication.mfa_overview.title') }}</h2>

    <h3 class="h5">{{ $t('authentication.mfa_overview.authenticator_app') }}</h3>
    <p v-if="totp">{{ $t('authentication.mfa_overview.authenticator_active') }}</p>
    <p v-else>{{ $t('authentication.mfa_overview.authenticator_inactive') }}</p>
    <b-button v-if="totp" size="sm" variant="outline-secondary" :to="`${mfaBasePath}/totp/deactivate`">{{ $t('authentication.mfa_overview.deactivate') }}</b-button>
    <b-button v-else size="sm" variant="outline-secondary" :to="`${mfaBasePath}/totp/activate`">{{ $t('authentication.mfa_overview.activate') }}</b-button>

    <h3 class="h5 mt-3">{{ $t('authentication.mfa_overview.security_keys') }}</h3>
    <p v-if="webauthnCount">{{ $t('authentication.mfa_overview.security_keys_configured', { count: webauthnCount }) }}</p>
    <p v-else>{{ $t('authentication.mfa_overview.security_keys_none') }}</p>
    <b-button v-if="webauthnCount" size="sm" variant="outline-secondary" :to="`${mfaBasePath}/webauthn`">{{ $t('authentication.mfa_overview.manage') }}</b-button>
    <b-button v-else size="sm" variant="outline-secondary" :to="`${mfaBasePath}/webauthn/add`">{{ $t('authentication.mfa_overview.add') }}</b-button>

    <h3 class="h5 mt-3">{{ $t('authentication.mfa_overview.recovery_codes') }}</h3>
    <p v-if="recoveryCodes">{{ $t('authentication.mfa_overview.recovery_codes_available', { unused: recoveryCodes.unused_code_count, total: recoveryCodes.total_code_count }) }}</p>
    <p v-else>{{ $t('authentication.mfa_overview.recovery_codes_none') }}</p>
    <div class="d-flex gap-2">
      <b-button size="sm" variant="outline-secondary" :to="`${mfaBasePath}/recovery-codes`">{{ $t('authentication.mfa_overview.view') }}</b-button>
      <b-button size="sm" variant="outline-secondary" :to="`${mfaBasePath}/recovery-codes/generate`">{{ $t('authentication.mfa_overview.generate') }}</b-button>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getAuthenticators, AuthenticatorType } from '@/allauth/lib/allauth'

const route = useRoute()
const authenticators = ref([])

onMounted(async () => {
  const response = await getAuthenticators()
  if (response.status === 200) {
    authenticators.value = response.data
  }
})

const totp = computed(() => authenticators.value.find((entry) => entry.type === AuthenticatorType.TOTP))
const webauthnCount = computed(() => authenticators.value.filter((entry) => entry.type === AuthenticatorType.WEBAUTHN).length)
const recoveryCodes = computed(() => authenticators.value.find((entry) => entry.type === AuthenticatorType.RECOVERY_CODES))
const mfaBasePath = computed(() =>
  route.path.startsWith('/profile/authentication') ? '/profile/authentication/2fa' : '/account/2fa'
)
</script>
