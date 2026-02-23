<template>
  <section>
    <h2>Account Security</h2>
    <p v-if="!dashboard.user.is_authenticated">You are not logged in.</p>
    <p v-else>Signed in as <strong>{{ dashboard.user.account_name }}</strong>.</p>

    <div class="d-flex flex-wrap gap-2 mt-3">
      <b-button v-if="!dashboard.user.is_authenticated" to="/account/login" variant="primary">Login</b-button>
      <b-button v-if="!dashboard.user.is_authenticated" to="/account/signup" variant="outline-primary">Sign up</b-button>
      <b-button v-if="dashboard.user.is_authenticated" to="/account/email" variant="primary">Manage email</b-button>
      <b-button v-if="dashboard.user.is_authenticated" to="/account/password/change" variant="outline-primary">Change password</b-button>
      <b-button v-if="dashboard.user.is_authenticated && hasMfa" to="/account/2fa" variant="outline-primary">Two-factor authentication</b-button>
      <b-button v-if="dashboard.user.is_authenticated && hasSessions" to="/account/sessions" variant="outline-primary">Sessions</b-button>
      <b-button v-if="dashboard.user.is_authenticated" to="/account/logout" variant="outline-danger">Logout</b-button>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { dashboardStore } from '@/dashboardStore'
import { allauthStore } from '@/allauthStore'

const dashboard = dashboardStore()
const allauth = allauthStore()

const hasMfa = computed(() => Boolean(allauth.config?.data?.mfa))
const hasSessions = computed(() => Boolean(allauth.config?.data?.usersessions))
</script>
