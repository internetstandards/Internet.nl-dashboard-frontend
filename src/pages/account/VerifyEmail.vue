<template>
  <section>
    <h2>Confirm Email Address</h2>

    <template v-if="verification && verification.status === 200">
      <p>
        Confirm <a :href="`mailto:${verification.data.email}`">{{ verification.data.email }}</a> for
        {{ verification.data.user?.str || 'this account' }}.
      </p>
      <b-button variant="primary" :disabled="loading" @click="submit">Confirm</b-button>
    </template>

    <template v-else-if="verification && verification.data?.email">
      <p>
        Unable to confirm <a :href="`mailto:${verification.data.email}`">{{ verification.data.email }}</a>
        because it is already confirmed.
      </p>
    </template>

    <template v-else>
      <p>Invalid verification link.</p>
    </template>

    <FormErrors :errors="response?.errors" />
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import FormErrors from '@/components/allauth/FormErrors.vue'
import { getEmailVerification, verifyEmail } from '@/allauth/lib/allauth'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const verification = ref(null)
const response = ref(null)

onMounted(async () => {
  verification.value = await getEmailVerification(route.params.key)
})

async function submit() {
  loading.value = true
  try {
    response.value = await verifyEmail(route.params.key)
    if ([200, 401].includes(response.value?.status)) {
      await router.replace('/account/email')
    }
  } finally {
    loading.value = false
  }
}
</script>
