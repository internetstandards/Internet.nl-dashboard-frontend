<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
  <div>
    <content-block>
      <h1>
        <b-icon icon="person-circle"/>
        {{ $t("title") }}
      </h1>
      <p>{{ $t("intro") }}</p>
      <!-- use lazy so that the visiblemetrics is updated when that's visited, instead of manually reloading. -->
      <b-tabs content-class="mt-3" lazy>
        <b-tab :active="active === 'notifications' || active === '' || active === undefined">
          <span slot="title">📨 {{ $t('notifications') }}</span>
          <notification-settings></notification-settings>
        </b-tab>

        <b-tab :active="active === 'authentication'">
          <span slot="title">📱 {{ $t('authentication_options') }}</span>

          <span v-if="$route.query.password_change_success">

            <server-response
                :response="{
                success: true,
                error: false,
                timestamp: new Date().toISOString(),
                message: $t('password_change_success')}
                "
                :force_show="true"
            ></server-response>
          </span>

          <span v-if="$route.query.password_change_success === 'false'">"

            />
          </span>

          <p>{{ $t("authentication_options_secondfactor") }}</p>
          <ul>
            <li><a :href="`${$baseUrl}/accounts/password/change/`" target="_blank">🔑 {{ $t("change_password") }}</a>
            </li>
            <li><a :href="`${$baseUrl}/account/two_factor/`" target="_blank">📱 {{ $t("two_factor_options") }}</a></li>
          </ul>
        </b-tab>

        <b-tab :active="active === 'web_metrics'">
          <span slot="title"> <scan-type-icon type="web"></scan-type-icon> {{ $t('visible_metrics_web') }}</span>
          <VisibleMetrics report_type="web" :key="'a'"/>
        </b-tab>

        <b-tab :active="active === 'mail_metrics'">
          <span slot="title"> <scan-type-icon type="mail"></scan-type-icon> {{ $t('visible_metrics_mail') }}</span>
          <VisibleMetrics report_type="mail" :key="'b'"/>
        </b-tab>

      </b-tabs>
    </content-block>
  </div>
</template>

<script>
import NotificationSettings from "./NotificationSettings"
import VisibleMetrics from './VisibleMetrics'
import ScanTypeIcon from "@/components/ScanTypeIcon";

export default {
  components: {ScanTypeIcon, NotificationSettings, VisibleMetrics},

  name: 'account',
  computed: {
    active() {
      return this.$route.params.active_tab
    }
  }
}
</script>
<i18n>
{
  "en": {
    "title": "Account",
    "intro": "Manage your account.",
    "authentication_options": "Authentication",
    "authentication_options_secondfactor": "Due to technical limitations setting up second factor authentication and entering the code will happen in a new window.",
    "two_factor_options": "Setup / Change Two Factor Authentication",
    "change_password": "Change Password",
    "notifications": "Notifications",
    "visible_metrics_mail": "Mail metrics",
    "visible_metrics_web": "Web metrics",
    "password_change_success": "Password changed successfully"
  },
  "nl": {
    "title": "Account",
    "intro": "Beheer je account.",
    "authentication_options": "Authenticatie",
    "authentication_options_secondfactor": "Door technische beperkingen wordt het instellen en configureren van tweetrapsauthenticatie gestart in een apart venster.",
    "two_factor_options": "Instellen / Aanpassen twee-factor authenticatie",
    "change_password": "Wachtwoord wijzigen",
    "notifications": "Notificaties",
    "visible_metrics_mail": "Mail meetwaarden",
    "visible_metrics_web": "Web meetwaarden",
    "password_change_success": "Wachtwoord wijzigen succesvol"
  }
}
</i18n>
