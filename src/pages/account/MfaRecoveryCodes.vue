<template>
  <section>
    <h2>Recovery Codes</h2>
    <p class="alert alert-info">
      When using security keys, you can still sign in with your password, but only if you also provide a recovery code.
    </p>

    <template v-if="recoveryCodes?.status === 200">
      <p>
        Recovery codes let you sign in when your authenticator app or passkey is unavailable,
        for example when using another device or after losing access to your usual device.
      </p>
      <p class="text-danger">
        Store these codes in a secure place. Each code can be used once.
      </p>
      <p>{{ recoveryCodes.data.unused_code_count }} of {{ recoveryCodes.data.total_code_count }} recovery codes available.</p>
      <pre>{{ (recoveryCodes.data.unused_codes || []).join('\n') }}</pre>
    </template>

    <template v-else>
      <p>No recovery codes configured.</p>
    </template>

    <b-button variant="outline-secondary" :to="mfaOverviewPath">Back to 2FA</b-button>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getRecoveryCodes } from '@/allauth/lib/allauth'

const route = useRoute()
const recoveryCodes = ref(null)
const mfaOverviewPath = computed(() =>
  route.path.startsWith('/profile/authentication') ? '/profile/authentication/2fa' : '/account/2fa'
)

onMounted(async () => {
  recoveryCodes.value = await getRecoveryCodes()
})
</script>
