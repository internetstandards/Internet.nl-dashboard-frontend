<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
  <content-block class="do-not-print" v-if="report !== undefined">
    <collapse-panel :title='`${$t("title", [report.id, sharing_status(report["is_publicly_shared"])])} `'
                    class="do-not-print">
      <div slot="content">
        <template v-if="report['is_publicly_shared']">
          <b-row>
            <b-col>
              <p>

                <b-form-group
                    :label="$t('shared_at_url')"
                    label-for="share-code"
                    class="mb-0"
                >
                  <b-input-group>
                    <b-form-input
                        id="share-code"
                        :value="`${$baseUrl}/#/shared/report/${report['public_report_code']}`"
                        maxlength="64"
                        :description="report['public_share_code'] ? 'bla' : 'bla'"
                        :disabled="true"
                    ></b-form-input>
                    <template #append>
                      <b-input-group-text>
                        <router-link :to="{ name: 'shared_report', params: { report: report['public_report_code']}}"
                                     target="_blank">
                          {{ $t('open') }}
                        </router-link>
                      </b-input-group-text>
                    </template>

                  </b-input-group>
                </b-form-group>
                <template v-if='report["public_share_code"]'>
                  <span class="small text-secondary font-italic">{{ $t("with_password") }}: {{ report["public_share_code"] }}</span>
                </template>
                <template v-else>
                  <span class="small text-secondary font-italic">{{ $t("without_password") }}</span>
                </template>
                <br>
                <br>
                <button size="lg" @click="update_report_code">🔁 {{ $t("change_link") }}</button> &nbsp;
                <button size="lg" @click="unshare">🔴 {{ $t("stop_sharing") }}</button>
              </p>
            </b-col>
            <b-col>

              <p>
                <b-form-group
                    :label="$t('configure_password')"
                    label-for="share-code"
                    :description="$t('password_description')"
                    class="mb-0"
                >
                  <b-form-input
                      id="share-code"
                      v-model="report['public_share_code']"
                      maxlength="64"
                  ></b-form-input>
                </b-form-group>
                <br>

                <button @click="update_share_code">{{ $t("set_password") }}</button> &nbsp;
                <button @click="remove_share_code" v-if="report['public_share_code']">{{ $t("remove_password") }}
                </button>
              </p>
            </b-col>

          </b-row>


        </template>
        <template v-else>

          <b-row>
            <b-col class="w-50">
              <button variant="warning" @click="share" class="mb-4">🟢 {{ $t("share_to_anyone_with_url") }} {{
                  report['public_share_code'] ? $t("and_password") : ''
                }}
              </button>

            </b-col>

            <b-col class="w-50">


              <b-form-group
                  :label="$t('configure_password')"
                  label-for="share-code"
                  :description="$t('password_description')"
                  class=""
              >
                <b-form-input
                    id="share-code"
                    v-model="report['public_share_code']"
                    maxlength="64"
                ></b-form-input>
              </b-form-group>



            </b-col>
          </b-row>
        </template>
        <loading :loading="loading"/>
        <server-response :response="response" v-if="response" :message="$t(response.message)"></server-response>
      </div>
    </collapse-panel>
  </content-block>
</template>
<script>
import http from "@/httpclient";

export default {
  props: {
    report: {type: Object, required: true}
  },

  data() {
    return {
      loading: false,
      response: {},
    }
  },

  methods: {
    sharing_status(status) {
      if (status)
        return `🟢 ${this.$i18n.t("shared")}`
      return `🔴 ${this.$i18n.t("not_shared")}`
    },
    share() {
      this.loading = true;
      http.post('/data/report/share/share/', {
        'report_id': this.report.id,
        'public_share_code': this.public_share_code
      }).then(data => {
        this.response = data.data;
        this.report.is_publicly_shared = data.data.data.is_publicly_shared;
        this.report.public_report_code = data.data.data.public_report_code;
        this.loading = false;
      });
    },
    unshare() {
      this.loading = true;
      http.post('/data/report/share/unshare/', {'report_id': this.report.id}).then(data => {
        this.response = data.data;
        this.report.is_publicly_shared = data.data.data.is_publicly_shared;
        this.loading = false;
      });
    },
    update_share_code() {
      this.loading = true;
      http.post('/data/report/share/update_share_code/', {
        'report_id': this.report.id,
        'public_share_code': this.report.public_share_code
      }).then(data => {
        this.response = data.data;
        this.report.public_share_code = data.data.data.public_share_code;
        this.loading = false;
      });
    },
    remove_share_code() {
      this.public_share_code = "";
      return this.update_share_code();
    },
    update_report_code() {
      this.loading = true;
      http.post('/data/report/share/update_report_code/', {'report_id': this.report.id}).then(data => {
        this.response = data.data;
        this.report.public_report_code = data.data.data.public_report_code;
        this.loading = false;
      });
    }
  }
}
</script>
<i18n>
{
  "en": {
    "title": "{1} - Change sharing options of report #{0}",
    "shared": "Shared",
    "not_shared": "Not Shared",
    "intro": "Sharing options for this report:",
    "shared_at_url": "The report is shared on the following url",
    "with_password": "with the password set to",
    "without_password": "without a password.",
    "change_link": "New link",
    "stop_sharing": "Stop Sharing",
    "share_to_anyone_with_url": "Share report to anyone with the url",
    "and_password": " and password",
    "configure_password": "Configure password (optional)",
    "password_description": "When entered, the viewer of a report has to enter this password.",
    "set_password": "Set password",
    "remove_password": "Remove password",
    "open": "open",
    "response_no_report_found": "Could not find report.",
    "response_shared": "Report shared",
    "response_unshared": "Stopped sharing report",
    "response_updated_share_code": "Password updated",
    "response_updated_report_code": "Report link updated"
  },
  "nl": {
    "title": "{1} - Delen van rapport #{0} instellen",
    "shared": "Gedeeld",
    "not_shared": "Niet gedeeld",
    "intro": "Deelopties voor dit rapport:",
    "shared_at_url": "Rapport gedeeld op de volgende link",
    "with_password": "met het wachtwoord ",
    "without_password": "zonder wachtwoord.",
    "change_link": "Nieuwe link",
    "stop_sharing": "Stop delen",
    "share_to_anyone_with_url": "Deel voor iedereen met de link ",
    "and_password": " en het wachtwoord",
    "configure_password": "Wachtwoord instellen (optioneel)",
    "password_description": "Wanneer ingesteld moet de bezoeker ook een wachtwoord ingeven.",
    "set_password": "Wachtwoord instellen",
    "remove_password": "Wachtwoord verwijderen",
    "open": "open",
    "response_no_report_found": "Rapport kon niet worden gevonden.",
    "response_shared": "Rapport is nu gedeeld",
    "response_unshared": "Rapport wordt niet meer gedeeld",
    "response_updated_share_code": "Wachtwoord aangepast",
    "response_updated_report_code": "Rapport link aangepast"
  }
}
</i18n>