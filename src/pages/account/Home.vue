<template>
  <section>
    <h2>Account Security</h2>
    <p v-if="!dashboard.user.is_authenticated">You are not logged in.</p>
    <p v-else>Signed in as <strong>{{ dashboard.user.account_name }}</strong>.</p>

  </section>
</template>

<script setup>
import { computed } from 'vue'
import { dashboardStore } from '@/dashboardStore'
import { allauthStore } from '@/allauthStore'

const dashboard = dashboardStore()
const allauth = allauthStore()

const hasMfa = computed(() => Boolean(allauth.config?.data?.mfa))
</script>
