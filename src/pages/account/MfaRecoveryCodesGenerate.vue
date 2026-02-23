<template>
  <section>
    <h2>Generate Recovery Codes</h2>

    <p>
      You are about to generate a new set of recovery codes.
      <span v-if="hasCodes"> This invalidates your current recovery codes.</span>
    </p>

    <FormErrors :errors="response?.errors" />

    <b-button variant="danger" :disabled="loading" @click="submit">Generate</b-button>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import FormErrors from '@/components/allauth/FormErrors.vue'
import { getRecoveryCodes, generateRecoveryCodes } from '@/allauth/lib/allauth'

const router = useRouter()
const loading = ref(false)
const response = ref(null)
const recoveryCodes = ref(null)

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
      await router.replace('/account/2fa/recovery-codes')
    }
  } finally {
    loading.value = false
  }
}
</script>
