<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
  <div>
    <content-block>
      <h1>
        <b-icon icon="person-circle"/>
        {{ $t("account.page.title") }}
      </h1>
      <p>{{ $t("account.page.intro") }}</p>
      <!-- use lazy so that the visiblemetrics is updated when that's visited, instead of manually reloading. -->
      <b-tabs content-class="mt-3" lazy>
        <b-tab :active="active === 'notifications' || active === '' || active === undefined">
          <span slot="title">📨 {{ $t('account.page.notifications') }}</span>
          <notification-settings></notification-settings>
        </b-tab>

        <b-tab :active="active === 'authentication'">
          <span slot="title">📱 {{ $t('account.page.authentication_options') }}</span>

          <span v-if="$route.query.password_change_success">

            <server-response
                :response="{
                success: true,
                error: false,
                timestamp: new Date().toISOString(),
                message: $t('account.page.password_change_success')}
                "
                :force_show="true"
            ></server-response>
          </span>

          <span v-if="$route.query.password_change_success === 'false'">"

            />
          </span>

          <ul class="ml-0">
            <li class="mb-2">
              <a :href="`${$baseUrl}/accounts/password/change/`" target="_blank">🔑 {{ $t("account.page.change_password") }}</a>
            </li>
            <li><a :href="`${$baseUrl}/account/two_factor/`" target="_blank">📱 {{ $t("account.page.two_factor_options") }}</a></li>
          </ul>
        </b-tab>

        <b-tab :active="active === 'web_metrics'">
          <span slot="title"> <scan-type-icon type="web"></scan-type-icon> {{ $t('account.page.visible_metrics_web') }}</span>
          <VisibleMetrics report_type="web" :key="'a'"/>
        </b-tab>

        <b-tab :active="active === 'mail_metrics'">
          <span slot="title"> <scan-type-icon type="mail"></scan-type-icon> {{ $t('account.page.visible_metrics_mail') }}</span>
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
