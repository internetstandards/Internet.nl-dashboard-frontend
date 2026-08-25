<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
      <div>
        <loading :loading="loading"></loading>
        <server-response :response="server_response" :message='$t("account.notifications." + server_response.message)'></server-response>

        <form novalidate @submit.prevent="save">
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
        <b-form-input id="mail_preferred_mail_address" type="email" v-model="user.mail_preferred_mail_address"></b-form-input>

        <label class='ad_hoc_label' for="first_name">{{ $t("account.notifications.first_name") }}:</label>
        <b-form-input id="first_name" type="text" maxlength="120" v-model="user.first_name"
                      :placeholder='$t("account.notifications.first_name")'></b-form-input>


        <label class='ad_hoc_label' for="last_name">{{ $t("account.notifications.last_name") }}:</label>
        <b-form-input id="last_name" type="text" maxlength="120" v-model="user.last_name"
                      :placeholder='$t("account.notifications.last_name")'></b-form-input>


        <label class='ad_hoc_label' for="mail_preferred_language">{{ $t("account.notifications.mail_preferred_language") }}</label>
        <b-form-select
          id="mail_preferred_language"
          v-model="user.mail_preferred_language"
          :aria-describedby="languageErrorVisible ? 'mail_preferred_language_error' : undefined"
          :aria-invalid="languageErrorVisible"
          :state="preferredLanguageState"
          required
          @update:model-value="languageServerInvalid = false"
        >
          <b-form-select-option :value="null" disabled>{{ $t("account.notifications.mail_preferred_language_select") }}</b-form-select-option>
          <b-form-select-option value="en">{{ $t("account.notifications.en") }}</b-form-select-option>
          <b-form-select-option value="nl">{{ $t("account.notifications.nl") }}</b-form-select-option>
        </b-form-select>
        <p
          v-if="languageErrorVisible"
          id="mail_preferred_language_error"
          class="invalid-feedback d-block"
          role="alert"
        >
          {{ $t(`account.notifications.${languageErrorMessage}`) }}
        </p>

        <b-button type="submit" variant="warning" :disabled="loading">{{ $t("account.notifications.save") }}</b-button>
        </form>
      </div>
</template>

<script>
import http from "@/httpclient";

export default {
name: "NotificationSettings.vue",
  computed: {
    languageErrorMessage() {
      return this.languageServerInvalid
        ? 'save_user_settings_error_form_unsupported_language'
        : 'mail_preferred_language_required'
    },
    languageErrorVisible() {
      return this.languageServerInvalid || (this.languageValidationAttempted && !this.preferredLanguageIsValid)
    },
    preferredLanguageIsValid() {
      return ['en', 'nl'].includes(this.user.mail_preferred_language)
    },
    preferredLanguageState() {
      if (this.languageServerInvalid) {
        return false
      }
      return this.languageValidationAttempted ? this.preferredLanguageIsValid : null
    },
  },
  data: function () {
    return {
      languageServerInvalid: false,
      languageValidationAttempted: false,
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
      this.languageServerInvalid = false;
      this.languageValidationAttempted = false;
      this.loading = true;
      http.get('/api/v1/settings/user').then(data => {
        this.user = data.data;
        this.loading = false;
      });
    },
    save: function () {
      this.languageServerInvalid = false;
      this.languageValidationAttempted = true;
      this.server_response = {};

      if (!this.preferredLanguageIsValid) {
        return
      }

      this.loading = true;
      return http.post('/api/v1/settings/user', {
        'first_name': this.user.first_name,
        'last_name': this.user.last_name,
        'mail_preferred_mail_address': this.user.mail_preferred_mail_address,
        'mail_preferred_language': this.user.mail_preferred_language,
        'mail_send_mail_after_scan_finished': this.user.mail_send_mail_after_scan_finished
      }).then(data => {
        if (data.data)
          this.server_response = data.data;
      }).catch(error => {
        const response = error.response;
        const details = response?.data?.detail || response?.data?.errors || [];
        this.languageServerInvalid = response?.status === 422 && Array.isArray(details) && details.some(detail =>
          detail?.loc?.includes('mail_preferred_language') || detail?.param === 'mail_preferred_language'
        );
        this.server_response = {
          error: true,
          message: 'save_user_settings_error_incomplete_data',
          timestamp: new Date().toISOString(),
        };
      }).finally(() => {
        this.loading = false;
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
