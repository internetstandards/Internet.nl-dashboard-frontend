<template>
  <section>
    <h2>{{ $t('authentication.verify_email.title') }}</h2>

    <template v-if="verification && verification.status === 200">
      <p>
        {{ $t('authentication.verify_email.confirm_for', { email: verification.data.email, user: verification.data.user?.str || $t('authentication.verify_email.this_account') }) }}
      </p>
      <b-button variant="warning" :disabled="loading" @click="submit">{{ $t('authentication.verify_email.submit') }}</b-button>
    </template>

    <template v-else-if="verification && verification.data?.email">
      <p>
        {{ $t('authentication.verify_email.already_confirmed', { email: verification.data.email }) }}
      </p>
    </template>

    <template v-else>
      <p>{{ $t('authentication.verify_email.invalid_link') }}</p>
    </template>

    <FormErrors :errors="response?.errors" />
  </section>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import FormErrors from '@/components/allauth/FormErrors.vue'
import { getEmailVerification, verifyEmail } from '@/allauth/lib/allauth'
import { allauthStore } from '@/allauthStore'

const route = useRoute()
const router = useRouter()
const allauth = allauthStore()

const loading = ref(false)
const verification = ref(null)
const response = ref(null)
const successPath = computed(() =>
  route.path.startsWith('/profile/authentication')
    ? '/profile/authentication/email'
    : '/account/email'
)

onMounted(async () => {
  verification.value = await getEmailVerification(route.params.key)
})

async function submit() {
  loading.value = true
  try {
    response.value = await verifyEmail(route.params.key)
    if ([200, 401].includes(response.value?.status)) {
      await allauth.syncDashboardSession()
      await router.replace(successPath.value)
    }
  } finally {
    loading.value = false
  }
}
</script>
