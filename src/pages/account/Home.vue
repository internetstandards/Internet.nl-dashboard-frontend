<template>
  <section>
    <h2>{{ $t('authentication.home.title') }}</h2>
    <p v-if="!dashboard.user.is_authenticated">{{ $t('authentication.home.logged_out') }}</p>
    <p v-else>{{ $t('authentication.home.signed_in_as') }} <strong>{{ dashboard.user.account_name }}</strong>.</p>

  </section>
</template>

<script setup>
import { dashboardStore } from '@/dashboardStore'

const dashboard = dashboardStore()
</script>
