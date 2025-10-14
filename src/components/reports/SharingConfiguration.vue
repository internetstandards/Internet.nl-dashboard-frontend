<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
  <content-block class="do-not-print" v-if="report !== undefined">
    <collapse-panel :title='`${$t("report.sharing_configuration.title", [report.id, sharing_status(report["is_publicly_shared"])])} `'
                    class="do-not-print" variant="warning">
      <template #content>
        <template v-if="report['is_publicly_shared']">
          <b-row>
            <b-col>
              <p>

                <b-form-group
                    :label='$t("report.sharing_configuration.shared_at_url")'
                    label-for="share-code"
                    class="mb-0"
                >
                  <b-input-group>

                    <!-- $baseUrl is not set in production and that is fine since the app runs on root.
                    Yet, the link needs to be complete, otherwise it's hard to use it when sharing.-->
                    <b-form-input
                        id="share-code"
                        :value="`${$baseUrl}/report/${report['public_report_code']}`"
                        disabled
                        v-model="share_code"
                    ></b-form-input>
                    <template #append>
                      <b-input-group-text>
                        <router-link :to="{ name: 'shared_report', params: { report: report['public_report_code']}}"
                                     target="_blank">
                          {{ $t("report.sharing_configuration.open") }}
                        </router-link>
                      </b-input-group-text>
                    </template>

                  </b-input-group>
                </b-form-group>
                <template v-if='report["public_share_code"]'>
                  <span class="small text-secondary font-italic">{{ $t("report.sharing_configuration.with_password") }}: {{ report["public_share_code"] }}</span>
                </template>
                <template v-else>
                  <span class="small text-secondary font-italic">{{ $t("report.sharing_configuration.without_password") }}</span>
                </template>
                <br>
                <br>
                <b-button variant="warning" size="lg" @click="update_report_code">🔁 {{ $t("report.sharing_configuration.change_link") }}</b-button> &nbsp;
                <b-button variant="warning" size="lg" @click="unshare">🔴 {{ $t("report.sharing_configuration.stop_sharing") }}</b-button>
              </p>
            </b-col>
            <b-col>

              <p>
                <b-form-group
                    :label='$t("report.sharing_configuration.configure_password")'
                    label-for="share-code"
                    :description='$t("report.sharing_configuration.password_description")'
                    class="mb-0"
                >
                  <b-form-input
                      id="share-code"
                      v-model="report['public_share_code']"
                      maxlength="64"
                  ></b-form-input>
                </b-form-group>
                <br>

                <b-button variant="warning" @click="update_share_code">{{ $t("report.sharing_configuration.set_password") }}</b-button> &nbsp;
                <b-button variant="warning" @click="remove_share_code" v-if="report['public_share_code']">{{ $t("report.sharing_configuration.remove_password") }}
                </b-button>
              </p>
            </b-col>

          </b-row>


        </template>
        <template v-else>

          <b-row>
            <b-col class="w-50">
              <b-button variant="warning" @click="share" class="mb-4">🟢 {{ $t("report.sharing_configuration.share_to_anyone_with_url") }} {{
                  report['public_share_code'] ? $t("report.sharing_configuration.and_password") : ''
                }}
              </b-button>

            </b-col>

            <b-col class="w-50">


              <b-form-group
                  :label='$t("report.sharing_configuration.configure_password")'
                  label-for="share-code"
                  :description='$t("report.sharing_configuration.password_description")'
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
        <server-response :response="response" v-if="response" :message="$t('report.sharing_configuration.' + response.message)"></server-response>
      </template>
    </collapse-panel>
  </content-block>
</template>
<script>
import http from "@/httpclient";
import CollapsePanel from '@/components/CollapsePanel.vue'


export default {
  components: {CollapsePanel},

  props: {
    report: {type: Object, required: true}
  },

  data() {
    return {
      loading: false,
      response: {},
    }
  },

  computed: {
    share_code() {
      let baseUrl = import.meta.env.VITE_VUE_APP_DJANGO_PATH;
      return `${baseUrl}/report/${this.report['public_report_code']}`
    },
  },
  methods: {
    sharing_status(status) {
      if (status)
        return `🟢 ${this.$i18n.t("report.sharing_configuration.shared")}`
      return `🔴 ${this.$i18n.t("report.sharing_configuration.not_shared")}`
    },
    share() {
      this.loading = true;
      http.post('/data/report/share/share', {
        'report_id': this.report.id,
        'public_share_code': this.report.public_share_code
      }).then(data => {
        this.response = data.data;
        this.report.is_publicly_shared = data.data.data.is_publicly_shared;
        this.report.public_report_code = data.data.data.public_report_code;
        this.loading = false;
      });
    },
    unshare() {
      this.loading = true;
      http.post('/data/report/share/unshare', {'report_id': this.report.id}).then(data => {
        this.response = data.data;
        this.report.is_publicly_shared = data.data.data.is_publicly_shared;
        this.loading = false;
      });
    },
    update_share_code() {
      this.loading = true;
      http.post('/data/report/share/update_share_code', {
        'report_id': this.report.id,
        'public_share_code': this.report.public_share_code
      }).then(data => {
        this.response = data.data;
        this.report.public_share_code = data.data.data.public_share_code;
        this.loading = false;
      });
    },
    remove_share_code() {
      this.report.public_share_code = "";
      return this.update_share_code();
    },
    update_report_code() {
      this.loading = true;
      http.post('/data/report/share/update_report_code', {'report_id': this.report.id}).then(data => {
        this.response = data.data;
        this.report.public_report_code = data.data.data.public_report_code;
        this.loading = false;
      });
    }
  }
}
</script>
