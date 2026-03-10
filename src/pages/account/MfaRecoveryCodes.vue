<template>
  <section>
    <h2>{{ $t('authentication.mfa_recovery_codes.title') }}</h2>
    <p class="alert alert-info">
      {{ $t('authentication.mfa_recovery_codes.alert') }}
    </p>

    <template v-if="recoveryCodes?.status === 200">
      <p>
        {{ $t('authentication.mfa_recovery_codes.intro') }}
      </p>
      <p class="text-danger">
        {{ $t('authentication.mfa_recovery_codes.warning') }}
      </p>
      <p>{{ $t('authentication.mfa_recovery_codes.available', { unused: recoveryCodes.data.unused_code_count, total: recoveryCodes.data.total_code_count }) }}</p>
      <pre>{{ (recoveryCodes.data.unused_codes || []).join('\n') }}</pre>
    </template>

    <template v-else>
      <p>{{ $t('authentication.mfa_recovery_codes.none') }}</p>
    </template>

    <b-button variant="outline-secondary" :to="mfaOverviewPath">{{ $t('authentication.mfa_recovery_codes.back') }}</b-button>
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
