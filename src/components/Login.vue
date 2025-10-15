<!-- SPDX-License-Identifier: Apache-2.0 -->
<style scoped>
.subtext {
  font-size: 0.8em;
  font-style: italic;
}
</style>
<template>
  <div class="account">

    <content-block>
      <h1>{{ $t("app.login.title") }}</h1>
      <p>{{ $t("app.login.new_login_info") }}</p>
      <a :href="$baseUrl + '/account/login/'">{{ $baseUrl }}/account/login/</a>
    </content-block>

    <!-- https://github.com/internetstandards/Internet.nl-dashboard/issues/352 This page is a fallback for people
    that have the login page bookmarked. They are still pointed to the right place to log in. -->
    <content-block v-if="false">
      <h1>{{ $t("app.login.title") }}</h1>
      <p>{{ $t("app.login.intro") }}</p>
      <server-response :response="server_response" :message='$t("app.login." + server_response.message)'></server-response>

      <div v-if="!user.is_authenticated">
        <p>
          {{ $t("app.login.not_logged_in") }}<br>
          <span class="subtext">
            {{ $t("app.login.secondfactor_message") }}: <a :href="$baseUrl + '/account/login/'">{{ $baseUrl }}/account/login/</a>
          </span>
        </p>

        <form v-on:submit.prevent="login">
          <label class='username' for="username">{{ $t("app.login.username") }}</label>
          <b-form-input id="username" type="text" maxlength="120" v-model="username"
                        :placeholder='$t("app.login.username")'></b-form-input>
          <br>

          <label class='password' for="password">{{ $t("app.login.password") }}</label>
          <b-form-input id="password" type="password" maxlength="120" v-model="password"
                        :placeholder='$t("app.login.password")'></b-form-input>

          <br>
          <b-button variant="warning" id="login" type="submit">{{ $t("app.login.login") }}</b-button>
        </form>

      </div>
      <div v-else>
        {{ $t("app.login.logged_in") }}
      </div>
    </content-block>

  </div>
</template>

<script lang="js">

import { dashboardStore } from '@/dashboardStore'
import {mapState} from 'pinia'
import http from "@/httpclient";

export default {
  name: "login",

  data() {
    return {
      // todo: wss maakt dit een nieuwe, het is geen global state?
      store: dashboardStore(),
      loading: false,
      username: "",
      password: "",
      server_response: {},
    }
  },
  mounted: function () {
    this.login_status();
  },
  methods: {
    reset() {
        // don't keep the 'succesful login' message:
        this.server_response = {};
        // clear the login form, which contains the password in cache
        this.username = "";
        this.password = "";
    },

    login_status: function () {
      this.loading = true;
      console.log("Checking if the user is logged in at the login page.")
      http.get('/data/session/status').then(data => {
        this.store.set_user(data.data);
        this.loading = false;
        if (this.user.is_authenticated) {
          this.reset();
          // This is not a solution to double navigation, but i think the error is weird and incorrect.
          // https://stackoverflow.com/questions/62462276/how-to-solve-avoided-redundant-navigation-to-current-location-error-in-vue
          if (this.$router.name !== 'domains') {
            this.$router.push({'name': 'domains'}).catch(() => {
            });
          }
        }
      });
    },
    login: function () {
      this.loading = true;
      http.post('/session/login', {'username': this.username, 'password': this.password}).then(data => {
        if (data.data) {
          this.server_response = data.data;
          this.login_status();
        }
      })
    },
  },
  computed: mapState(dashboardStore, ['user']),
}
</script>
