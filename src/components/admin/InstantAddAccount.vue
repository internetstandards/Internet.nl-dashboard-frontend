<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
  <content-block>

    <h1>
      <i-bi-person-plus/>
      {{ $t("admin.instant_add_account.title") }}
    </h1>
    <p>{{ $t("admin.instant_add_account.intro") }}</p>

    <p>
      <server-response :response="server_response" :message='$t("admin.instant_add_account." + server_response.message)'></server-response>

      <h2>{{ $t("admin.instant_add_account.account_setup") }}</h2>
      {{ $t("admin.instant_add_account.to_which_account_should_the_user_be_added") }}<br>
      <small>{{ $t("admin.instant_add_account.account_choice_explanation") }}</small><br>
      <br>
      <h3>{{ $t("admin.instant_add_account.an_existing_account") }}</h3>
      <br>{{ $t("admin.instant_add_account.select_an_existing_account") }}
      <v-select :options="existing_accounts" :reduce="existing_account => existing_account.id" v-model="form.use_existing_account_id"></v-select>
      <br>
      <h3>{{ $t("admin.instant_add_account.a_new_account") }}</h3>
      {{ $t("admin.instant_add_account.enter_new_account_details") }}<br/><br/>
      {{ $t("admin.instant_add_account.new_account_name") }}:<br>
      <b-form-input id="password" type="text" maxlength="120" v-model="form.new_account_name"
                    :disabled="form.use_existing_account_id"
                    :placeholder='$t("admin.instant_add_account.new_account_name")'></b-form-input>
      {{ $t("admin.instant_add_account.new_account_internet_nl_api_username") }}:<br>
      <b-form-input id="password" type="text" maxlength="120" v-model="form.new_account_internet_nl_api_username"
                    :disabled="form.use_existing_account_id"
                    :placeholder='$t("admin.instant_add_account.new_account_internet_nl_api_username")'></b-form-input>
      {{ $t("admin.instant_add_account.new_account_internet_nl_api_password") }}:<br>
      <b-form-input id="password" type="password" maxlength="120" v-model="form.new_account_internet_nl_api_password"
                    :disabled="form.use_existing_account_id"
                    :placeholder='$t("admin.instant_add_account.new_account_internet_nl_api_password")'></b-form-input>
      <br>

      <b-button size="sm" @click="check_api_credentials">{{ $t("admin.instant_add_account.credential_check_title") }}</b-button>&nbsp;
      <template v-if="api_credentials_valid === true">
        {{ $t("admin.instant_add_account.credential_check_valid", {'name': form.new_account_internet_nl_api_username}) }}
      </template>
      <template v-if="api_credentials_valid === false">
        {{ $t("admin.instant_add_account.credential_check_invalid", {'name': form.new_account_internet_nl_api_username}) }}
      </template>
      <template v-if="api_credentials_valid === null">
        {{ $t("admin.instant_add_account.credential_check_unknown") }}
      </template>


      <h2>{{ $t("admin.instant_add_account.user_credentials_title") }}</h2>
      {{ $t("admin.instant_add_account.user_credentials_explanation") }}<br><br>
      {{ $t("admin.instant_add_account.username") }}:<br>
      <b-form-input id="username" type="text" maxlength="120" v-model="form.new_username"
                    :placeholder='$t("admin.instant_add_account.username")'></b-form-input>
      <br>

      {{ $t("admin.instant_add_account.password") }}:<br>
      <b-form-input id="password" type="password" maxlength="120" v-model="form.new_password"
                    :placeholder='$t("admin.instant_add_account.password")'></b-form-input>
      <br/>
      <b-button variant="warning" @click="save_instant_account()">{{ $t("admin.instant_add_account.save") }}</b-button>
      <br><br>
      <server-response :response="server_response" :message='$t("admin.instant_add_account." + server_response.message)'></server-response>
    </p>

  </content-block>
</template>
<script>
import http from "@/httpclient";
import vSelect from 'vue-select';

export default {
  components: {vSelect},
  data: function () {
    return {
      form: {
        new_username: "",
        new_password: "",
        use_existing_account_id: null,

        new_account_name: "",
        new_account_internet_nl_api_username: "",
        new_account_internet_nl_api_password: "",
      },

      api_credentials_valid: null,

      server_response: {},

      existing_accounts: [],
      accounts_loading: false,

    }
  },
  mounted() {
    this.get_accounts();
  },
  methods: {
    check_api_credentials: function () {
      http.post('/data/powertools/check_api_credentials', this.form)
        .then(server_response => {
          if (server_response.data)
            this.api_credentials_valid = server_response.data.can_connect_to_internet_nl_api;
        });
    },
    get_accounts: function () {
      this.accounts_loading = true;
      http.get('/data/powertools/get_accounts').then(data => {
        this.existing_accounts = data.data.accounts;
        this.accounts_loading = false;
      })
    },
    save_instant_account: function () {
      http.post('/data/powertools/save_instant_account_and_user', this.form)
        .then(server_response => {
          if (server_response.data)
            this.server_response = server_response.data;
        });
    },
  }
}
</script>
