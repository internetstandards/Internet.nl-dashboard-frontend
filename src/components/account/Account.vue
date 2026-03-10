<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
  <div>
    <content-block>
      <h1>
        <i-bi-person-circle/>
        {{ $t("account.page.title") }}
      </h1>
      <p>{{ $t("account.page.intro") }}</p>
      <!-- use lazy so that the visiblemetrics is updated when that's visited, instead of manually reloading. -->
      <b-tabs
        v-model="profileTabIndex"
        content-class="mt-3"
        lazy
        @update:model-value="onProfileTabChange"
      >
        <b-tab>
          <template #title>📨 {{ $t("account.page.notifications") }}</template>
          <notification-settings></notification-settings>
        </b-tab>

        <b-tab>
          <template #title>📱 {{ $t("account.page.authentication_options") }}</template>

          <b-tabs
            v-model="authTabIndex"
            content-class="mt-3"
            lazy
            @update:model-value="onAuthTabChange"
          >
            <b-tab>
              <template #title>📧 {{ $t('authentication.email.title') }}</template>
              <Email />
            </b-tab>

            <b-tab>
              <template #title>🔑 {{ $t("account.page.change_password") }}</template>
              <PasswordChange />
            </b-tab>

            <b-tab>
              <template #title>📱 {{ $t("account.page.two_factor_options") }}</template>
              <component :is="mfaComponent" />
            </b-tab>

            <b-tab v-if="shouldShowVerifyEmailTab">
              <template #title>✉️ {{ $t('authentication.verify_email.title') }}</template>
              <VerifyEmailGate />
            </b-tab>
          </b-tabs>
        </b-tab>

        <b-tab>
          <template #title> <scan-type-icon type="web"></scan-type-icon> {{ $t("account.page.visible_metrics_web") }}</template>
          <VisibleMetrics report_type="web" :key="'a'"/>
        </b-tab>

        <b-tab>
          <template #title> <scan-type-icon type="mail"></scan-type-icon> {{ $t("account.page.visible_metrics_mail") }}</template>
          <VisibleMetrics report_type="mail" :key="'b'"/>
        </b-tab>

      </b-tabs>
    </content-block>
  </div>
</template>

<script>
import NotificationSettings from "@/components/account/NotificationSettings.vue"
import VisibleMetrics from '@/components/account/VisibleMetrics.vue'
import ScanTypeIcon from "@/components/ScanTypeIcon.vue";
import Email from '@/pages/account/Email.vue'
import PasswordChange from '@/pages/account/PasswordChange.vue'
import VerifyEmailGate from '@/pages/account/VerifyEmailGate.vue'
import MfaOverview from '@/pages/account/MfaOverview.vue'
import MfaActivateTotp from '@/pages/account/MfaActivateTotp.vue'
import MfaDeactivateTotp from '@/pages/account/MfaDeactivateTotp.vue'
import MfaRecoveryCodes from '@/pages/account/MfaRecoveryCodes.vue'
import MfaRecoveryCodesGenerate from '@/pages/account/MfaRecoveryCodesGenerate.vue'
import MfaWebauthnList from '@/pages/account/MfaWebauthnList.vue'
import MfaWebauthnAdd from '@/pages/account/MfaWebauthnAdd.vue'
import { allauthStore } from '@/allauthStore'
import { Flows } from '@/allauth/lib/allauth'

export default {
  components: {
    ScanTypeIcon,
    NotificationSettings,
    VisibleMetrics,
    Email,
    PasswordChange,
    VerifyEmailGate,
    MfaOverview,
    MfaActivateTotp,
    MfaDeactivateTotp,
    MfaRecoveryCodes,
    MfaRecoveryCodesGenerate,
    MfaWebauthnList,
    MfaWebauthnAdd
  },

  name: 'account',
  data() {
    return {
      allauth: allauthStore(),
      profileTabIndex: 0,
      authTabIndex: 0
    }
  },
  computed: {
    isProfileAuthenticationRoute() {
      return this.$route.path.startsWith('/profile/authentication')
    },
    profileTabIndexFromRoute() {
      if (this.isProfileAuthenticationRoute || this.$route.params.active_tab === 'authentication') {
        return 1
      }
      if (this.$route.params.active_tab === 'web_metrics') {
        return 2
      }
      if (this.$route.params.active_tab === 'mail_metrics') {
        return 3
      }
      return 0
    },
    authPathSegments() {
      if (!this.isProfileAuthenticationRoute) {
        return []
      }
      const remainder = this.$route.path.replace(/^\/profile\/authentication\/?/, '')
      return remainder ? remainder.split('/').filter(Boolean) : []
    },
    authTabIndexFromRoute() {
      const [firstSegment] = this.authPathSegments
      if (firstSegment === 'password') {
        return 1
      }
      if (firstSegment === '2fa') {
        return 2
      }
      if (firstSegment === 'verify-email') {
        return 3
      }
      return 0
    },
    emailVerificationByCodeEnabled() {
      return this.allauth.config?.data?.account?.email_verification_by_code_enabled === true
    },
    shouldShowVerifyEmailTab() {
      return this.authPathSegments[0] === 'verify-email' || this.emailVerificationByCodeEnabled || this.allauth.pendingFlow?.id === Flows.VERIFY_EMAIL
    },
    mfaSubPath() {
      if (!this.isProfileAuthenticationRoute || this.authPathSegments[0] !== '2fa') {
        return ''
      }
      return this.authPathSegments.slice(1).join('/')
    },
    mfaComponent() {
      const componentsByPath = {
        '': 'MfaOverview',
        'totp/activate': 'MfaActivateTotp',
        'totp/deactivate': 'MfaDeactivateTotp',
        'webauthn': 'MfaWebauthnList',
        'webauthn/add': 'MfaWebauthnAdd',
        'recovery-codes': 'MfaRecoveryCodes',
        'recovery-codes/generate': 'MfaRecoveryCodesGenerate'
      }
      return componentsByPath[this.mfaSubPath] || 'MfaOverview'
    }
  },
  watch: {
    '$route.path': {
      immediate: true,
      handler() {
        this.profileTabIndex = this.profileTabIndexFromRoute
        this.authTabIndex = this.authTabIndexFromRoute
      }
    }
  },
  methods: {
    onProfileTabChange(nextIndex) {
      if (nextIndex === 1 && this.isProfileAuthenticationRoute) {
        return
      }

      const paths = [
        '/profile/notifications',
        '/profile/authentication',
        '/profile/web_metrics',
        '/profile/mail_metrics'
      ]
      const nextPath = paths[nextIndex] || '/profile/notifications'
      if (this.$route.path !== nextPath) {
        this.$router.replace(nextPath)
      }
    },
    onAuthTabChange(nextIndex) {
      if (!this.isProfileAuthenticationRoute) {
        return
      }

      const paths = [
        '/profile/authentication/email',
        '/profile/authentication/password/change',
        '/profile/authentication/2fa'
      ]
      if (this.shouldShowVerifyEmailTab) {
        paths.push('/profile/authentication/verify-email')
      }
      const nextPath = paths[nextIndex] || '/profile/authentication/email'
      if (this.$route.path !== nextPath) {
        this.$router.replace(nextPath)
      }
    }
  }
}
</script>
