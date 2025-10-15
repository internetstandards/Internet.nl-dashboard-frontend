<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
  <b-modal @hidden="cancel()" header-bg-variant="info" header-text-variant="light" no-fade scrollable>
    <template #header><h4>📝 {{ $t("domain.list.configure.title") }}</h4></template>
    <template #default>

      <server-response :response="response"></server-response>

      <label for="name">{{ $t("urllist.field_label_name") }}:</label><br>
      <b-form-input id="name" type="text" maxlength="120" v-model="list.name"></b-form-input>
      <br>

      <label for="scan_type">{{ $t("urllist.field_label_scan_type") }}:</label><br>
      <b-form-select id="scan_type" v-model="list.scan_type">
        <b-form-select-option value="web">{{ $t("urllist.scan_type_web") }}</b-form-select-option>
        <b-form-select-option value="mail">{{ $t("urllist.scan_type_mail") }}</b-form-select-option>
        <b-form-select-option value="all">{{ $t("urllist.scan_type_all") }}</b-form-select-option>
      </b-form-select>
      <br><br>

      <label for="automated_scan_frequency">
        {{ $t("urllist.field_label_automated_scan_frequency") }}:</label><br>
      <b-form-select id="automated_scan_frequency" v-model="list.automated_scan_frequency">
        <b-form-select-option value="disabled">
          {{ $t("urllist.automated_scan_frequency.disabled") }}
        </b-form-select-option>
        <b-form-select-option value="every half year">
          {{ $t("urllist.automated_scan_frequency.every_half_year") }}
        </b-form-select-option>
        <b-form-select-option value="at the start of every quarter">
          {{ $t("urllist.automated_scan_frequency.every_quarter") }}
        </b-form-select-option>
        <b-form-select-option value="every 1st day of the month">
          {{ $t("urllist.automated_scan_frequency.every_month") }}
        </b-form-select-option>
        <b-form-select-option value="twice per month">
          {{ $t("urllist.automated_scan_frequency.twice_per_month") }}
        </b-form-select-option>
      </b-form-select>
      <br><br>

      <b-form-checkbox id="automatically_share_new_reports" v-model="list.automatically_share_new_reports">
        {{ $t("urllist.automatically_share_new_reports") }}
      </b-form-checkbox>
      <br>

      <label for="default_public_share_code_for_new_reports">{{
          $t("urllist.default_public_share_code_for_new_reports")
        }}:</label><br>
      <b-input-group class="mt-3">
        <b-form-input id="default_public_share_code_for_new_reports" type="text" maxlength="64"
                      :placeholder='$t("urllist.empty_is_no_share_code")'
                      v-model="list.default_public_share_code_for_new_reports">

        </b-form-input>

          <!-- better would be to btoa(String.fromCharCode.apply(null,self.crypto.getRandomValues(new Uint8Array(15)))).replaceAll('+','-').replaceAll('/','_') -->
          <b-button variant="outline-success" @click="list.default_public_share_code_for_new_reports = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);">{{ $t("urllist.generate_code") }}</b-button>

      </b-input-group>
      <br>

      <b-form-checkbox id="enable_report_sharing_page" v-model="list.enable_report_sharing_page">
        {{ $t("urllist.enable_report_sharing_page") }}.
        <a :href="`/published/${user.account_id}/`" target="_blank">{{$t("urllist.to_overview_page")}}</a>
      </b-form-checkbox>

    </template>
    <template #footer>
      <b-button variant="secondary" @click="cancel()">{{ $t("domain.list.configure.cancel") }}</b-button>
      &nbsp;
      <b-button variant="warning" class="modal-default-button defaultbutton" @click="update_list_settings()">
        {{ $t("domain.list.configure.ok") }}
      </b-button>
    </template>
  </b-modal>
</template>

<script>
import http from "@/httpclient";
import { dashboardStore } from '@/dashboardStore'
import {mapState} from "pinia";

export default {
  name: "configure-list",
  props: {
    list: {
      type: Object,
    },
  },
  data: function () {
    return {
      old_list_settings: {},
      response: {}
    }
  },
  methods: {
    cancel: function () {
      this.response = {};
      this.list.automated_scan_frequency = this.old_list_settings.automated_scan_frequency;
      this.list.scan_type = this.old_list_settings.scan_type;
      this.list.name = this.old_list_settings.name;
      this.list.enable_report_sharing_page = this.old_list_settings.enable_report_sharing_page;
      this.list.automatically_share_new_reports = this.old_list_settings.automatically_share_new_reports;
      this.list.default_public_share_code_for_new_reports = this.old_list_settings.default_public_share_code_for_new_reports;
      this.$emit('cancel')
    },
    update_list_settings: function () {
      http.post('/data/urllist/update_list_settings', this.list).then(server_response => {
        this.response = server_response.data;
        if (server_response.data.success) {
          this.old_list_settings = this.copy_json_value(server_response.data.data);
          this.list.scheduled_next_scan = server_response.data.data.scheduled_next_scan;
          this.$emit("done")
        }
      });
    },
  },
  mounted: function () {
    this.old_list_settings = this.copy_json_value(this.list);
    this.response = {};
  },
  computed: {
    ...mapState(dashboardStore, ['user']),
  }
}
</script>
