<template>
  <section>
    <h2>{{ $t('authentication.mfa_trust.title') }}</h2>
    <p>{{ $t('authentication.mfa_trust.intro') }}</p>

    <div class="d-flex gap-2">
      <b-button variant="outline-secondary" :disabled="loading" @click="submit(false)">{{ $t('authentication.mfa_trust.dont_trust') }}</b-button>
      <b-button variant="warning" :disabled="loading" @click="submit(true)">{{ $t('authentication.mfa_trust.trust') }}</b-button>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { mfaTrust, Flows } from '@/allauth/lib/allauth'
import { allauthStore } from '@/allauthStore'

const route = useRoute()
const router = useRouter()
const allauth = allauthStore()

const loading = ref(false)

onMounted(async () => {
  await allauth.refreshAuth()
  if (allauth.pendingFlow?.id !== Flows.MFA_TRUST) {
    await router.replace('/account/login')
  }
})

async function submit(value) {
  loading.value = true
  try {
    const response = await mfaTrust(value)
    if (response?.status === 200) {
      await allauth.syncDashboardSession()
      const nextPath = route.query.next || '/domains'
      await router.replace(String(nextPath))
    }
  } finally {
    loading.value = false
  }
}
</script>
