<template>
  <section>
    <h2>{{ $t('authentication.email.title') }}</h2>

    <table class="table table-sm table-bordered">
      <thead>
        <tr>
          <th>{{ $t('authentication.email.table.email') }}</th>
          <th>{{ $t('authentication.email.table.verified') }}</th>
          <th>{{ $t('authentication.email.table.primary') }}</th>
          <th>{{ $t('authentication.email.table.actions') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="emailAddress in emailAddresses" :key="emailAddress.email">
          <td>{{ emailAddress.email }}</td>
          <td>{{ emailAddress.verified ? $t('authentication.email.yes') : $t('authentication.email.no') }}</td>
          <td>
            <input
              type="radio"
              name="primary-email"
              :checked="emailAddress.primary"
              @change="markAsPrimary(emailAddress.email)"
            >
          </td>
          <td>
            <b-button
              v-if="!emailAddress.verified"
              size="sm"
              variant="outline-secondary"
              class="me-1"
              @click="requestVerification(emailAddress.email)"
            >
              {{ $t('authentication.email.resend_verification') }}
            </b-button>
            <b-button
              v-if="!emailAddress.primary"
              size="sm"
              variant="outline-danger"
              @click="removeEmail(emailAddress.email)"
            >
              {{ $t('authentication.email.remove') }}
            </b-button>
          </td>
        </tr>
      </tbody>
    </table>

    <b-alert
      v-if="verificationNotice"
      :variant="verificationNoticeVariant"
      :model-value="true"
      class="mt-3"
    >
      {{ verificationNotice }}
    </b-alert>
    <FormErrors :errors="verificationResponse?.errors" param="email" />
    <FormErrors :errors="verificationResponse?.errors" />

    <h3 class="h5 mt-4">{{ $t('authentication.email.add_title') }}</h3>
    <form @submit.prevent="addNewEmail">
      <label class="form-label" for="new-email">{{ $t('authentication.email.email_label') }}</label>
      <input id="new-email" v-model="email" type="email" class="form-control" required>
      <FormErrors :errors="response?.errors" param="email" />
      <FormErrors :errors="response?.errors" />
      <b-button class="mt-3" type="submit" :disabled="loading" variant="warning">{{ $t('authentication.email.add') }}</b-button>
    </form>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import FormErrors from '@/components/allauth/FormErrors.vue'
import {
  getEmailAddresses,
  addEmail,
  deleteEmail,
  markEmailAsPrimary,
  requestEmailVerification
} from '@/allauth/lib/allauth'
import { allauthStore } from '@/allauthStore'

const route = useRoute()
const router = useRouter()
const allauth = allauthStore()
const { t } = useI18n()

const emailAddresses = ref([])
const email = ref('')
const response = ref(null)
const verificationResponse = ref(null)
const verificationNotice = ref('')
const verificationNoticeVariant = ref('danger')
const loading = ref(false)

onMounted(async () => {
  await refreshEmails()
})

async function refreshEmails() {
  loading.value = true
  try {
    const resp = await getEmailAddresses()
    if (resp.status === 200) {
      emailAddresses.value = resp.data
    }
  } finally {
    loading.value = false
  }
}

function maybeRedirectToVerification() {
  if (!allauth.config?.data?.account?.email_verification_by_code_enabled) {
    return
  }

  const targetPath = route.path.startsWith('/profile/authentication')
    ? '/profile/authentication/verify-email'
    : '/account/verify-email'
  router.push(targetPath)
}

async function addNewEmail() {
  loading.value = true
  try {
    response.value = await addEmail(email.value)
    if (response.value?.status === 200) {
      emailAddresses.value = response.value.data
      email.value = ''
      maybeRedirectToVerification()
    }
  } finally {
    loading.value = false
  }
}

async function removeEmail(value) {
  loading.value = true
  try {
    response.value = await deleteEmail(value)
    if (response.value?.status === 200) {
      emailAddresses.value = response.value.data
    }
  } finally {
    loading.value = false
  }
}

async function markAsPrimary(value) {
  loading.value = true
  try {
    response.value = await markEmailAsPrimary(value)
    if (response.value?.status === 200) {
      emailAddresses.value = response.value.data
    }
  } finally {
    loading.value = false
  }
}

async function requestVerification(value) {
  loading.value = true
  try {
    verificationResponse.value = null
    verificationNotice.value = ''

    verificationResponse.value = await requestEmailVerification(value)
    if (verificationResponse.value?.status === 200) {
      verificationNoticeVariant.value = 'success'
      verificationNotice.value = t('authentication.email.verification_sent')
      maybeRedirectToVerification()
      return
    }

    verificationNoticeVariant.value = 'danger'
    if (verificationResponse.value?.status === 403) {
      verificationNotice.value = t('authentication.email.verification_recently_sent')
    } else if (verificationResponse.value?.status === 409) {
      verificationNotice.value = t('authentication.email.verification_not_pending')
    } else if (verificationResponse.value?.errors?.length) {
      verificationNotice.value = ''
    } else {
      verificationNotice.value = t('authentication.email.verification_failed')
    }
  } finally {
    loading.value = false
  }
}
</script>
