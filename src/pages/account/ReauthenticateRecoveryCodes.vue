<template>
  <section>
    <h2>Confirm Access</h2>
    <p>Use a recovery code.</p>

    <form @submit.prevent="submit">
      <label class="form-label" for="reauth-recovery-code">Recovery code</label>
      <input id="reauth-recovery-code" v-model="code" class="form-control" required>
      <FormErrors :errors="response?.errors" param="code" />
      <FormErrors :errors="response?.errors" />
      <b-button type="submit" class="mt-3" :disabled="loading" variant="warning">Confirm</b-button>
    </form>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import FormErrors from '@/components/allauth/FormErrors.vue'
import { mfaReauthenticate } from '@/allauth/lib/allauth'

const route = useRoute()
const router = useRouter()

const code = ref('')
const response = ref(null)
const loading = ref(false)

async function submit() {
  loading.value = true
  try {
    response.value = await mfaReauthenticate(code.value)
    if (response.value?.status === 200) {
      const nextPath = route.query.next || '/account'
      await router.replace(String(nextPath))
    }
  } finally {
    loading.value = false
  }
}
</script>
