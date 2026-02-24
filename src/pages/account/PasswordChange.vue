<template>
  <section>
    <h2>Change Password</h2>

    <form @submit.prevent="submit">
      <label class="form-label" for="password-change-current">Current password</label>
      <input id="password-change-current" v-model="currentPassword" type="password" class="form-control">
      <FormErrors :errors="response?.errors" param="current_password" />

      <label class="form-label mt-2" for="password-change-new-1">New password</label>
      <input id="password-change-new-1" v-model="password1" type="password" autocomplete="new-password" class="form-control" required>
      <FormErrors :errors="response?.errors" param="new_password" />

      <label class="form-label mt-2" for="password-change-new-2">New password (again)</label>
      <input id="password-change-new-2" v-model="password2" type="password" class="form-control" required>
      <FormErrors :errors="password2Errors" param="password2" />

      <FormErrors :errors="nonFieldErrors" />

      <b-button type="submit" class="mt-3" variant="warning" :disabled="loading">Save</b-button>
    </form>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import FormErrors from '@/components/allauth/FormErrors.vue'
import { changePassword } from '@/allauth/lib/allauth'
import { pathForPendingFlow } from '@/allauth/flows'

const router = useRouter()
const route = useRoute()

const currentPassword = ref('')
const password1 = ref('')
const password2 = ref('')
const password2Errors = ref([])
const response = ref(null)
const loading = ref(false)
const fieldErrorParams = new Set(['current_password', 'new_password', 'password2'])

const nonFieldErrors = computed(() =>
  (response.value?.errors || []).filter((error) => !fieldErrorParams.has(error?.param))
)

async function submit() {
  if (password1.value !== password2.value) {
    password2Errors.value = [{ param: 'password2', message: 'Password does not match.' }]
    return
  }

  password2Errors.value = []
  loading.value = true
  try {
    const payload = {
      new_password: password1.value
    }
    if (currentPassword.value) {
      payload.current_password = currentPassword.value
    }

    response.value = await changePassword(payload)

    if (response.value?.status === 200) {
      const successPath = route.path.startsWith('/profile')
        ? '/profile/authentication'
        : '/account'
      await router.replace(successPath)
      return
    }

    const pendingPath = pathForPendingFlow(response.value)
    if (pendingPath) {
      const next = encodeURIComponent(route.fullPath)
      await router.replace(`${pendingPath}?next=${next}`)
    }
  } finally {
    loading.value = false
  }
}
</script>
