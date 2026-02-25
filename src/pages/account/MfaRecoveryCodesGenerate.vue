<template>
  <section>
    <h2>Generate Recovery Codes</h2>

    <p>
      You are about to generate a new set of recovery codes.
      <span v-if="hasCodes"> This invalidates your current recovery codes.</span>
    </p>

    <FormErrors :errors="response?.errors" />

    <div class="d-flex gap-2">
      <b-button variant="danger" :disabled="loading" @click="submit">Generate</b-button>
      <b-button variant="outline-secondary" :to="mfaOverviewPath">Back to 2FA</b-button>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import FormErrors from '@/components/allauth/FormErrors.vue'
import { getRecoveryCodes, generateRecoveryCodes } from '@/allauth/lib/allauth'

const router = useRouter()
const route = useRoute()
const loading = ref(false)
const response = ref(null)
const recoveryCodes = ref(null)
const recoveryCodesPath = computed(() =>
  route.path.startsWith('/profile/authentication')
    ? '/profile/authentication/2fa/recovery-codes'
    : '/account/2fa/recovery-codes'
)
const mfaOverviewPath = computed(() =>
  route.path.startsWith('/profile/authentication') ? '/profile/authentication/2fa' : '/account/2fa'
)

onMounted(async () => {
  recoveryCodes.value = await getRecoveryCodes()
})

const hasCodes = computed(() => {
  return recoveryCodes.value?.status === 200 && recoveryCodes.value?.data?.unused_code_count > 0
})

async function submit() {
  loading.value = true
  try {
    response.value = await generateRecoveryCodes()
    if (response.value?.status === 200) {
      await router.replace(recoveryCodesPath.value)
    }
  } finally {
    loading.value = false
  }
}
</script>
