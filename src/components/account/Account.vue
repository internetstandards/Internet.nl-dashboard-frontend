<template>
  <div>
    <content-block>
      <h1>{{ $t("title") }}</h1>
      <p>{{ $t("intro") }}</p>
        <!-- use lazy so that the visiblemetrics is updated when that's visited, instead of manually reloading. -->
      <b-tabs content-class="mt-3" lazy>
        <b-tab active>
          <span slot="title">📨 {{$t('notifications')}}</span>
          <notification-settings></notification-settings>
        </b-tab>

        <b-tab>
          <span slot="title">📱 {{$t('authentication_options') }}</span>
          <p>{{ $t("authentication_options_secondfactor") }}</p>
          <a :href="`${$baseUrl}/account/two_factor/`" target="_blank">{{ $t("two_factor_options") }}</a>
        </b-tab>

        <b-tab>
          <span slot="title"> <scan_type_icon type="web"></scan_type_icon> {{$t('visible_metrics_web')}}</span>
          <VisibleMetrics report_type="web" :key="'a'"/>
        </b-tab>

        <b-tab>
          <span slot="title"> <scan_type_icon type="mail"></scan_type_icon> {{$t('visible_metrics_mail')}}</span>
          <VisibleMetrics report_type="mail" :key="'b'"/>
        </b-tab>

      </b-tabs>
    </content-block>
  </div>
</template>

<script>
import NotificationSettings from "./NotificationSettings"
import VisibleMetrics from './VisibleMetrics'
import scan_type_icon from "@/components/scan_type_icon";

export default {
  components: {scan_type_icon, NotificationSettings, VisibleMetrics},

  name: 'account',
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
    "notifications": "Notifications",
    "visible_metrics_mail": "Mail metrics",
    "visible_metrics_web": "Web metrics"
  },
  "nl": {
    "title": "Account",
    "intro": "Beheer je account.",
    "authentication_options": "Authenticatie",
    "authentication_options_secondfactor": "Door technische beperkingen wordt het instellen en configureren van tweetrapsauthenticatie gestart in een apart venster.",
    "two_factor_options": "Instellen / Aanpassen twee-factor authenticatie",
    "notifications": "Notificaties",
    "visible_metrics_mail": "Mail meetwaarden",
    "visible_metrics_web": "Web meetwaarden"
  }
}
</i18n>
