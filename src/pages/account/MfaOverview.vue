<template>
  <section>
    <h2>Two-Factor Authentication</h2>

    <h3 class="h5">Authenticator App</h3>
    <p v-if="totp">Authenticator app is active.</p>
    <p v-else>Authenticator app is not active.</p>
    <b-button v-if="totp" size="sm" variant="outline-secondary" :to="`${mfaBasePath}/totp/deactivate`">Deactivate</b-button>
    <b-button v-else size="sm" variant="outline-secondary" :to="`${mfaBasePath}/totp/activate`">Activate</b-button>

    <h3 class="h5 mt-3">Security Keys</h3>
    <p v-if="webauthnCount">{{ webauthnCount }} security keys configured.</p>
    <p v-else>No security keys configured.</p>
    <b-button v-if="webauthnCount" size="sm" variant="outline-secondary" :to="`${mfaBasePath}/webauthn`">Manage</b-button>
    <b-button v-else size="sm" variant="outline-secondary" :to="`${mfaBasePath}/webauthn/add`">Add</b-button>

    <h3 class="h5 mt-3">Recovery Codes</h3>
    <p v-if="recoveryCodes">{{ recoveryCodes.unused_code_count }} of {{ recoveryCodes.total_code_count }} codes available.</p>
    <p v-else>No recovery codes configured.</p>
    <div class="d-flex gap-2">
      <b-button size="sm" variant="outline-secondary" :to="`${mfaBasePath}/recovery-codes`">View</b-button>
      <b-button size="sm" variant="outline-secondary" :to="`${mfaBasePath}/recovery-codes/generate`">Generate</b-button>
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
