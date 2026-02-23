<template>
  <section>
    <h2>Email Addresses</h2>

    <table class="table table-sm table-bordered">
      <thead>
        <tr>
          <th>Email</th>
          <th>Verified</th>
          <th>Primary</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="emailAddress in emailAddresses" :key="emailAddress.email">
          <td>{{ emailAddress.email }}</td>
          <td>{{ emailAddress.verified ? 'Yes' : 'No' }}</td>
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
              Resend verification
            </b-button>
            <b-button
              v-if="!emailAddress.primary"
              size="sm"
              variant="outline-danger"
              @click="removeEmail(emailAddress.email)"
            >
              Remove
            </b-button>
          </td>
        </tr>
      </tbody>
    </table>

    <h3 class="h5 mt-4">Add Email</h3>
    <form @submit.prevent="addNewEmail">
      <label class="form-label" for="new-email">Email</label>
      <input id="new-email" v-model="email" type="email" class="form-control" required>
      <FormErrors :errors="response?.errors" param="email" />
      <FormErrors :errors="response?.errors" />
      <b-button class="mt-3" type="submit" :disabled="loading" variant="primary">Add</b-button>
    </form>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import FormErrors from '@/components/allauth/FormErrors.vue'
import {
  getEmailAddresses,
  addEmail,
  deleteEmail,
  markEmailAsPrimary,
  requestEmailVerification
} from '@/allauth/lib/allauth'
import { allauthStore } from '@/allauthStore'

const router = useRouter()
const allauth = allauthStore()

const emailAddresses = ref([])
const email = ref('')
const response = ref(null)
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
  if (allauth.config?.data?.account?.email_verification_by_code_enabled) {
    router.push('/account/verify-email')
  }
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
    const verificationResponse = await requestEmailVerification(value)
    if (verificationResponse?.status === 200) {
      maybeRedirectToVerification()
    }
  } finally {
    loading.value = false
  }
}
</script>
