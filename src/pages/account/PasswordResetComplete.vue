<template>
  <section>
    <h2>Reset Password</h2>
    <p>Choose a new password.</p>

    <FormErrors :errors="response?.errors" />

    <template v-if="hasKeyError">
      <FormErrors :errors="keyErrors" param="key" />
    </template>

    <form v-else @submit.prevent="submit">
      <label class="form-label" for="password-reset-new-1">Password</label>
      <input id="password-reset-new-1" v-model="password1" type="password" autocomplete="new-password" class="form-control" required>
      <FormErrors :errors="response?.errors" param="password" />

      <label class="form-label mt-2" for="password-reset-new-2">Password (again)</label>
      <input id="password-reset-new-2" v-model="password2" type="password" class="form-control" required>
      <FormErrors :errors="password2Errors" param="password2" />

      <b-button type="submit" class="mt-3" :disabled="loading" variant="primary">Reset</b-button>
    </form>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import FormErrors from '@/components/allauth/FormErrors.vue'
import { getPasswordReset, resetPassword } from '@/allauth/lib/allauth'

const route = useRoute()
const router = useRouter()

const key = ref(String(route.query.key || ''))
const keyErrors = ref([])
const hasKeyError = ref(false)
const response = ref(null)
const loading = ref(false)
const password1 = ref('')
const password2 = ref('')
const password2Errors = ref([])

onMounted(async () => {
  if (!key.value) {
    hasKeyError.value = true
    keyErrors.value = [{ param: 'key', message: 'Missing password reset key.' }]
    return
  }

  const resetInfo = await getPasswordReset(key.value)
  if (resetInfo.status !== 200) {
    hasKeyError.value = true
    keyErrors.value = resetInfo.errors || [{ param: 'key', message: 'Invalid or expired reset key.' }]
  }
})

async function submit() {
  if (password1.value !== password2.value) {
    password2Errors.value = [{ param: 'password2', message: 'Password does not match.' }]
    return
  }

  password2Errors.value = []
  loading.value = true
  try {
    response.value = await resetPassword({ key: key.value, password: password1.value })
    if ([200, 401].includes(response.value?.status)) {
      await router.replace('/account/login')
    }
  } finally {
    loading.value = false
  }
}

</script>
