<template>
  <content-block>
    <p v-if="allauth.config?.status !== 200">{{ $t('authentication.layout.loading_settings') }}</p>

    <!--<div class="mb-3">
      <b-button size="sm" variant="secondary" to="/account" class="me-2">Overview</b-button>
      <b-button size="sm" variant="secondary" to="/account/login" class="me-2" v-if="!user.is_authenticated">Login</b-button>
      <b-button size="sm" variant="secondary" to="/account/signup" class="me-2" v-if="!user.is_authenticated && isOpenForSignup">Sign up</b-button>
      <b-button size="sm" variant="secondary" to="/account/email" class="me-2" v-if="user.is_authenticated">Email</b-button>
      <b-button size="sm" variant="secondary" to="/account/password/change" class="me-2" v-if="user.is_authenticated">Password</b-button>
      <b-button size="sm" variant="secondary" to="/account/2fa" class="me-2" v-if="user.is_authenticated">2FA</b-button>
    </div>-->

    <router-view />
  </content-block>
</template>

<script setup>
import { computed } from 'vue'
import { dashboardStore } from '@/dashboardStore'
import { allauthStore } from '@/allauthStore'
import { storeToRefs } from 'pinia'

const allauth = allauthStore()
const dashboard = dashboardStore()
const { user } = storeToRefs(dashboard)
const isOpenForSignup = computed(() => allauth.config?.data?.account?.is_open_for_signup !== false)
</script>
