<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
  <b-modal :visible="visible" @hidden="cancel()" header-bg-variant="info" header-text-variant="light" no-fade
           scrollable>
    <h3 slot="modal-title">📝 {{ $t("title") }}</h3>
    <div slot="default">

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
        <b-form-input id="default_public_share_code_for_new_reports" type="text" maxlength="120"
                      :placeholder="$t('urllist.empty_is_no_share_code')"
                      v-model="list.default_public_share_code_for_new_reports">

        </b-form-input>
        <b-input-group-append>
          <!-- better would be to btoa(String.fromCharCode.apply(null,self.crypto.getRandomValues(new Uint8Array(15)))).replaceAll('+','-').replaceAll('/','_') -->
          <b-button variant="outline-success" @click="list.default_public_share_code_for_new_reports = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);;">{{ $t('urllist.generate_code') }}</b-button>
        </b-input-group-append>
      </b-input-group>
      <br>

      <b-form-checkbox id="enable_report_sharing_page" v-model="list.enable_report_sharing_page">
        {{ $t("urllist.enable_report_sharing_page") }}.
        <a :href="`/#/published/${$store.state.user.account_id}/`" target="_blank">{{$t('urllist.to_overview_page')}}</a>
      </b-form-checkbox>

    </div>
    <div slot="modal-footer">
      <button class='altbutton' @click="cancel()">{{ $t("cancel") }}</button>
      &nbsp;
      <button class="modal-default-button defaultbutton" @click="update_list_settings()">
        {{ $t("ok") }}
      </button>
    </div>
  </b-modal>
</template>

<script>
import sharedMessages from "@/components/translations/dashboard";
import http from "@/httpclient";

export default {
  name: "configure-list",
  i18n: {
    sharedMessages: sharedMessages,
  },
  props: {
    list: {
      type: Object,
    },
    visible: {
      type: Boolean,
    }
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
      http.post('/data/urllist/update_list_settings/', this.list).then(server_response => {
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
  }
}
</script>

<i18n>
{
  "en": {
    "title": "Settings",
    "cancel": "Cancel",
    "ok": "Update"
  },
  "nl": {
    "title": "Instellingen",
    "cancel": "Annuleer",
    "ok": "Opslaan"
  }
}
</i18n>