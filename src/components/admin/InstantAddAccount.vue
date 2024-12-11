<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
  <content-block>

    <h1>
      <i-bi-person-plus/>
      {{ $t("admin.instant_add_account.title") }}
    </h1>
    <p>{{ $t("admin.instant_add_account.intro") }}</p>

    <p>
      <server-response :response="server_response"></server-response>

      {{ $t("admin.instant_add_account.username") }}:<br>
      <b-form-input id="username" type="text" maxlength="120" v-model="username"
                    :placeholder='$t("admin.instant_add_account.username")'></b-form-input>
      <br>

      {{ $t("admin.instant_add_account.password") }}:<br>
      <b-form-input id="password" type="password" maxlength="120" v-model="password"
                    :placeholder='$t("admin.instant_add_account.password")'></b-form-input>
      <br/>
      <b-button variant="warning" @click="save_instant_account()">{{ $t("admin.instant_add_account.save") }}</b-button>
    </p>

  </content-block>
</template>
<script>
import http from "@/httpclient";

export default {
  data: function () {
    return {
      username: "",
      password: "",
      server_response: {},
    }
  },
  methods: {
    save_instant_account: function () {
      http.post('/data/powertools/save_instant_account/', {'username': this.username, 'password': this.password})
          .then(server_response => {
            if (server_response.data)
              this.server_response = server_response.data;
          });
    },
  }
}
</script>
