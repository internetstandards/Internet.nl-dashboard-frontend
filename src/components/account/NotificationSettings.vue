<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
      <div>
        <loading :loading="loading"></loading>
        <server-response :response="server_response" :message='$t("account.notifications." + server_response.message)'></server-response>

        <label class='ad_hoc_label' for="mail_send_mail_after_scan_finished">
          {{ $t("account.notifications.mail_send_mail_after_scan_finished") }}
        </label>
        <b-form-checkbox
            id="checkbox-1"
            v-model="user.mail_send_mail_after_scan_finished"
            name="checkbox-1"
            :value="true"
            :unchecked-value="false"
            switch>{{ $t("account.notifications.check_" + user.mail_send_mail_after_scan_finished) }}
        </b-form-checkbox>
        <br>

        <label class='ad_hoc_label' for="mail_preferred_mail_address">
          {{ $t("account.notifications.mail_preferred_mail_address") }}
        </label>
        <b-form-input id="last_name" type="email" v-model="user.mail_preferred_mail_address"></b-form-input>

        <label class='ad_hoc_label' for="first_name">{{ $t("account.notifications.first_name") }}:</label>
        <b-form-input id="first_name" type="text" maxlength="120" v-model="user.first_name"
                      :placeholder='$t("account.notifications.first_name")'></b-form-input>


        <label class='ad_hoc_label' for="last_name">{{ $t("account.notifications.last_name") }}:</label>
        <b-form-input id="last_name" type="text" maxlength="120" v-model="user.last_name"
                      :placeholder='$t("account.notifications.last_name")'></b-form-input>


        <label class='ad_hoc_label' for="mail_preferred_language">{{ $t("account.notifications.mail_preferred_language") }}</label>
        <b-form-select v-model="user.mail_preferred_language" class="mb-3">
          <b-form-select-option :value="null">Please select an option</b-form-select-option>
          <b-form-select-option value="en">{{ $t("account.notifications.en") }}</b-form-select-option>
          <b-form-select-option value="nl">{{ $t("account.notifications.nl") }}</b-form-select-option>
        </b-form-select>

        <button @click="save">{{ $t("account.notifications.save") }}</button>
      </div>
</template>

<script>
import http from "@/httpclient";

export default {
name: "NotificationSettings.vue",
  data: function () {
    return {
      loading: false,
      server_response: {},
      user: {}
    }
  },
  mounted: function () {
    this.get()
  },
  methods: {
    get: function () {
      this.server_response = {};
      this.loading = true;
      http.get('/data/user/get/').then(data => {
        this.user = data.data;
        this.loading = false;
      });
    },
    save: function () {
      http.post('/data/user/save/', {
        'first_name': this.user.first_name,
        'last_name': this.user.last_name,
        'mail_preferred_mail_address': this.user.mail_preferred_mail_address,
        'mail_preferred_language': this.user.mail_preferred_language,
        'mail_send_mail_after_scan_finished': this.user.mail_send_mail_after_scan_finished
      }).then(data => {
        if (data.data)
          this.server_response = data.data;
      });
    },
  },
}
</script>

<style scoped>
input {
  margin-bottom: 1em;
}
</style>
