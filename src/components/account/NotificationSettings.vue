<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
      <div>
        <loading :loading="loading"></loading>
        <server-response :response="server_response" :message="$t(server_response.message)"></server-response>

        <label class='ad_hoc_label' for="mail_send_mail_after_scan_finished">
          {{ $t("mail_send_mail_after_scan_finished") }}
        </label>
        <b-form-checkbox
            id="checkbox-1"
            v-model="user.mail_send_mail_after_scan_finished"
            name="checkbox-1"
            :value="true"
            :unchecked-value="false"
            switch>{{ $t(`check_${user.mail_send_mail_after_scan_finished}`) }}
        </b-form-checkbox>
        <br>

        <label class='ad_hoc_label' for="mail_preferred_mail_address">
          {{ $t("mail_preferred_mail_address") }}
        </label>
        <b-form-input id="last_name" type="email" v-model="user.mail_preferred_mail_address"></b-form-input>

        <label class='ad_hoc_label' for="first_name">{{ $t("first_name") }}:</label>
        <b-form-input id="first_name" type="text" maxlength="120" v-model="user.first_name"
                      :placeholder="$t('first_name')"></b-form-input>


        <label class='ad_hoc_label' for="last_name">{{ $t("last_name") }}:</label>
        <b-form-input id="last_name" type="text" maxlength="120" v-model="user.last_name"
                      :placeholder="$t('last_name')"></b-form-input>


        <label class='ad_hoc_label' for="mail_preferred_language">{{ $t("mail_preferred_language") }}</label>
        <b-form-select v-model="user.mail_preferred_language" class="mb-3">
          <b-form-select-option :value="null">Please select an option</b-form-select-option>
          <b-form-select-option value="en">{{ $t("en") }}</b-form-select-option>
          <b-form-select-option value="nl">{{ $t("nl") }}</b-form-select-option>
        </b-form-select>

        <button @click="save">{{ $t("save") }}</button>
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

<i18n>
{
  "en": {
    "personalia": "Personal data",
    "first_name": "Addressee, first name",
    "last_name": "Addressee, last name",
    "notification_settings": "Notification settings",
    "mail_preferred_mail_address": "E-mail address",
    "mail_preferred_language": "E-mail language",
    "mail_send_mail_after_scan_finished": "Send notification after scan is finished",
    "authentication_options": "Authentication options",
    "authentication_options_secondfactor": "Due to technical limitations setting up second factor authentication and entering the code will happen in a new window.",
    "save_user_settings_success": "Account updated successfully.",
    "save_user_settings_error_form_incorrect_mail_address": "Mail address is not correct.",
    "save_user_settings_error_form_unsupported_language": "This language is not supported, select a different language.",
    "save_user_settings_error_incomplete_data": "Not all data was entered correctly.",
    "save_user_settings_error_could_not_retrieve_user": "Could not retrieve account information.",
    "save": "Save changes",
    "reset": "Reset",
    "check_true": "Yes",
    "check_false": "No",
    "en": "English",
    "nl": "Dutch",
    "two_factor_options": "Setup / Change Two Factor Authentication"
  },
  "nl": {
    "personalia": "Personalia",
    "first_name": "Aanhef: voornaam",
    "last_name": "Aanhef: achternaam",
    "notification_settings": "Instellingen voor meldingen",
    "mail_preferred_mail_address": "E-mail adres",
    "mail_preferred_language": "E-mail taal",
    "mail_send_mail_after_scan_finished": "Stuur een melding als een scan klaar is",
    "authentication_options": "Tweetrapsauthenticatie",
    "authentication_options_secondfactor": "Door technische beperkingen wordt het instellen en configureren van tweetrapsauthenticatie gestart in een apart venster.",
    "save_user_settings_success": "Account succesvol bijgewerkt.",
    "save_user_settings_error_form_incorrect_mail_address": "Mail adres is niet correct.",
    "save_user_settings_error_form_unsupported_language": "Deze taal wordt niet ondersteund. Kies een andere taal.",
    "save_user_settings_error_incomplete_data": "Niet alle gegevens zijn correct verstuurd, probeer opnieuw.",
    "save_user_settings_error_could_not_retrieve_user": "Kan geen gegevens ophalen voor dit account.",
    "save": "Deze gegevens opslaan",
    "reset": "Reset",
    "check_true": "Ja",
    "check_false": "Nee",
    "en": "Engels",
    "nl": "Nederlands",
    "two_factor_options": "Instellen / Aanpassen twee-factor authenticatie"
  }
}
</i18n>
