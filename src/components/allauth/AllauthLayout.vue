<template>
  <div>
    <page-header :title="$t('app.menu.authentication')">
      <template #icon>
        <i-bi-shield-lock />
      </template>
    </page-header>

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
  </div>
</template>

<script setup>
import { allauthStore } from '@/allauthStore'

const allauth = allauthStore()
</script>
