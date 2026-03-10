<template>
  <section>
    <h2>{{ $t('authentication.reauthenticate.title') }}</h2>
    <p>{{ $t('authentication.reauthenticate.intro') }}</p>

    <form @submit.prevent="submit">
      <label class="form-label" for="reauth-password">{{ $t('authentication.reauthenticate.password') }}</label>
      <input id="reauth-password" v-model="password" type="password" class="form-control" required>
      <FormErrors :errors="response?.errors" param="password" />
      <FormErrors :errors="response?.errors" />
      <b-button type="submit" class="mt-3" :disabled="loading" variant="warning">{{ $t('authentication.reauthenticate.submit') }}</b-button>
    </form>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import FormErrors from '@/components/allauth/FormErrors.vue'
import { reauthenticate } from '@/allauth/lib/allauth'

const router = useRouter()
const route = useRoute()

const password = ref('')
const response = ref(null)
const loading = ref(false)

async function submit() {
  loading.value = true
  try {
    response.value = await reauthenticate({ password: password.value })
    if (response.value?.status === 200) {
      const nextPath = route.query.next || '/account'
      await router.replace(String(nextPath))
    }
  } finally {
    loading.value = false
  }
}
</script>
