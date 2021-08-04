<style scoped>
.subtext {
  font-size: 0.8em;
  font-style: italic;
}
</style>
<template>
  <div class="account">

    <content-block>
      <h1>{{ $t("title") }}</h1>
      <p>{{ $t("intro") }}</p>
      <server-response :response="server_response" :message="$t(server_response.message)"></server-response>

      <div v-if="!user.is_authenticated">
        <p>
          {{ $t('not_logged_in') }}<br>
          <span class="subtext">
            {{ $t('secondfactor_message') }}:<a :href="$baseUrl + '/account/login/'">{{ $baseUrl }}/account/login/</a>
          </span>
        </p>

        <form v-on:submit.prevent="login">
          <label class='username' for="username">{{ $t("username") }}</label>
          <b-form-input id="username" type="text" maxlength="120" v-model="username"
                        :placeholder="$t('username')"></b-form-input>
          <br>

          <label class='password' for="password">{{ $t("password") }}</label>
          <b-form-input id="password" type="password" maxlength="120" v-model="password"
                        :placeholder="$t('password')"></b-form-input>

          <br>
          <button id="login" type="submit">{{ $t("login") }}</button>
        </form>

      </div>
      <div v-else>
        {{ $t('logged_in') }}
      </div>
    </content-block>

  </div>
</template>

<script>

import {mapState} from 'vuex'
import http from "@/httpclient";

export default {
  data: function () {
    return {
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
      http.get('/session/status/').then(data => {
        this.$store.commit("set_user", data.data);
        this.loading = false;
        if (this.$store.state.user.is_authenticated) {
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
      http.post('/session/login/', {'username': this.username, 'password': this.password}).then(data => {
        if (data.data) {
          this.server_response = data.data;
          this.login_status();
        }
      })
    },
  },
  computed: mapState(['user']),
}
</script>
<i18n>
{
  "en": {
    "title": "Login",
    "intro": "Log into the dashboard.",
    "username": "Username",
    "password": "Password",
    "login": "Log in",
    "not_logged_in": "You are currently not logged in. Enter your credentials to log into the dashboard.",
    "no_credentials_supplied": "Enter a username and password to log in.",
    "invalid_credentials": "Username or password not correct.",
    "user_not_active": "User is not active.",
    "logged_in": "You have successfully logged in.",
    "logged_out": "You have successfully logged out.",
    "secondfactor_message": "If second factor authentication is enabled, use this alternate login link",
    "second_factor_login_required": "Second factor authentication is enabled for this user, please use the alternative login form linked on this page."
  },
  "nl": {
    "title": "Inloggen",
    "intro": "Log in op het dashboard.",
    "username": "gebruikersnaam",
    "password": "wachtwoord",
    "login": "Inloggen",
    "not_logged_in": "Je bent niet ingelogd. Voer je gebruikersnaam en wachtwoord in om in te loggen op het dashboard.",
    "no_credentials_supplied": "Voer een gebruikersnaam en wachtwoord in.",
    "invalid_credentials": "Gebruikersnaam of wachtwoord niet correct.",
    "user_not_active": "Gebruiker is niet actief.",
    "logged_in": "Succesvol ingelogd.",
    "logged_out": "Succesvol uitgelogd.",
    "secondfactor_message": "Als tweetrapsverificatie is ingeschakeld, gebruik dan de alternatieve inlogpagina op de volgende link",
    "second_factor_login_required": "Tweetrapsverificatie is ingeschakeld, gebruik de alternatieve inlogpagina die op deze pagina staat aangegeven."
  }
}

</i18n>