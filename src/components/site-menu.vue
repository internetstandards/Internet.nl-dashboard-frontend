<!-- SPDX-License-Identifier: Apache-2.0 -->
<style scoped>
.active {
  font-weight: 600;
  border-bottom: 3px solid #ffab4c;
}

#site-title a {
  width: 320px !important;
}

@media (max-width: 499px) {
  #site-title a {
    background-image: url("/static_frontend/images/vendor/internet_nl/logo_en.svg") !important;
  }
}

@media (min-width: 500px) and (max-width: 739px) {
  #site-title a {
    background-image: url("/static_frontend/images/vendor/internet_nl/logo-tablet_en.svg") !important;
  }
}

@media (min-width: 740px) {
  #site-title a {
    background-image: url("/static_frontend/images/vendor/internet_nl/logo_en.svg") !important;
  }
}

@media print {
  #site-title a {
    background-image: url("/static_frontend/images/vendor/internet_nl/logo_en.png") !important;
    /* The SVG logo doesn't print correct
    background-image: url("/static/images/vendor/internet_nl/logo_en.svg") !important; */
  }
}

#site-title a {
    display: block;
    height: 33px;
    font-size: 100%;
    width: 100%;
    background: url("/static/logo_en.png");
    background: url("/static/logo_en.svg");
    background-repeat: no-repeat;
    background-size: contain;
    background-position: left center;
    padding-left: 30px;
}

#site-title a, #site-description {
    float: left;
    white-space: nowrap;
    overflow: hidden
}

#language-switch-header-container {
    float: right;
    margin-right: .25em;
  margin-bottom: 0rem;
}

#language-switch-header-container.active {
    width: 100%;
    margin-top: .5em;
    margin-bottom: .5em;
    border-top: 1px solid #E2E2E2;
    border-bottom: 1px solid #E2E2E2
}

.menu-with-js-actions.active #sitenav a {
    font-size: 125%
}

.language-switch-list li {
    font-size: 80%;
}

.language-switch-list li a:hover, header .language-switch-list li a:active, header .language-switch-list li a:focus {
    text-decoration: underline
}

.navbar-collapse{
  flex-grow: 0 !important;
}

.navbar-nav {
  /* when the hamburger is active, show menu items horizontally instead of veritcally */
  flex-direction: row;

}

.retro-vintage-table, .retro-vintage-table tr, .retro-vintage-table tr, td{
  margin: 0;
  padding: 0;
  border: 0px solid red;
}

.retro-vintage-table {
  /* menu on right side when hamburger is visible */
  float: right;
}

#language-switch-header-container {
    float: right;
}

#language-switch-header-container.active {
    width: 100%;
    margin-top: .5em;
    margin-bottom: .5em;
    border-top: 1px solid #E2E2E2;
    border-bottom: 1px solid #E2E2E2
}

.language-switch-list li {
    display: inline;
    float: left;
    text-align: right;
    font-size: 80%;
}

#language-switch-header-container.active li {
    padding: .2em;
    margin: .5em 3px .5em 3px
}

li a {
  padding: 0 !important;
  margin: 6px !important;
}

.navbar{
  padding: 3px;
  padding-bottom: 0;
}

.max_container_width {
  max-width: 1064px;
}

</style>
<template>
  <b-navbar toggleable="md">
    <b-container class="max_container_width">
      <b-navbar-brand to="domains">
        <p id="site-title"><a><span class="hidden">{{ $t('sitetitle') }}</span></a></p>
        <p id="site-description"><span class="hidden">{{ $t('sitedescription') }}</span></p>
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>

        <!-- sorry for the table here, after hours of fiddling with css to get two ul's below each other i'm done and
         just use the worst option that works. -->
        <table class="retro-vintage-table"><tr><td class="ml-auto">
        <b-navbar-nav id="language-switch-header-container" class="language-switch-list float-right">
          <b-nav-item v-if="is_superuser">{{ account_name }}</b-nav-item>
          <b-nav-item v-for="(lang_code, index) in supported_languages" :key="index" :disabled="lang_code === locale" @click="set_locale(lang_code)">
            <b-icon icon="check" v-if="lang_code === locale"></b-icon>
            {{ $t(lang_code) }}
          </b-nav-item>
        </b-navbar-nav>

        </td></tr><tr><td>

        <b-navbar-nav class="float-right">
          <template v-if="is_authenticated">
            <template v-if="is_superuser">

               <b-nav-item-dropdown exact exact-active-class="active">
            <template #text>
              <b-icon icon="person-badge-fill" />  {{ $t("admin") }}
            </template>
            <b-dropdown-item to="/switch-account"><b-icon icon="person-bounding-box" /> {{$t("switch_user") }}</b-dropdown-item>
            <b-dropdown-item to="/add-user" ><b-icon icon="person-plus" /> {{$t("add_user") }}</b-dropdown-item>
            <b-dropdown-item to="/usage" ><b-icon icon="graph-up" /> {{$t("usage_overview") }}</b-dropdown-item>
          </b-nav-item-dropdown>
            </template>

            <b-nav-item to="/domains" accesskey="d" exact exact-active-class="active"><b-icon icon="card-list" /> {{
                $t("domains")
              }}
            </b-nav-item>
            <b-nav-item to="/scans" accesskey="s" exact exact-active-class="active"><b-icon icon="search" /> {{ $t("scans") }}</b-nav-item>
            <b-nav-item to="/report" accesskey="r" exact exact-active-class="active"><b-icon icon="file-bar-graph" /> {{
                $t("reports")
              }}
            </b-nav-item>
            <b-nav-item-dropdown exact exact-active-class="active">
            <template #text>
              <b-icon icon="person-circle" />  {{ $t("account") }}
            </template>
            <b-dropdown-item to="/account/notifications" accesskey="a">📨 {{$t("notifications") }}</b-dropdown-item>
            <b-dropdown-item to="/account/authentication" >📱 {{$t("authentication") }}</b-dropdown-item>
            <b-dropdown-item to="/account/web_metrics" ><scan_type_icon type="web" /> {{$t("web_metrics") }}</b-dropdown-item>
            <b-dropdown-item to="/account/mail_metrics"><scan_type_icon type="mail" /> {{$t("mail_metrics") }}</b-dropdown-item>
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item @click="logout" accesskey="l" ><b-icon icon="box-arrow-right" /> {{
                $t("log_off")
              }}</b-dropdown-item>
          </b-nav-item-dropdown>

          </template>
          <template v-if="!is_authenticated">
            <b-nav-item to="/tour" accesskey="t" exact exact-active-class="active"><b-icon icon="info-circle" /> {{ $t("tour") }}</b-nav-item>
            <b-nav-item to="/login" accesskey="l" exact exact-active-class="active"><b-icon icon="box-arrow-in-right" /> {{ $t("log_in") }}</b-nav-item>
          </template>
        </b-navbar-nav>
        </td></tr></table>



      </b-collapse>
    </b-container>
  </b-navbar>
</template>
<script>
import http from "@/httpclient";
import scan_type_icon from "@/components/scan_type_icon";

export default {
  components: {scan_type_icon},
  props: {
    is_authenticated: {
      type: Boolean,
      default: false,
    },
    is_superuser: {
      type: Boolean,
      default: false,
    },
    account_name: {
      type: String,
      default: "",
    }
  },
  data: function () {
    return {
      supported_languages: ['en', 'nl'],
    }
  },

  name: 'site-menu',
  methods: {
    set_locale: function (locale) {
      // console.log(`Switching app to language: ${locale}.`);
      if (!this.supported_languages.includes(locale))
        return

      // there is no way to set it to locale, it always says 'en', even though NL is being required.
      this.$store.commit("set_locale", locale);

      // Using this cookie Django knows what language translations need to be (if still applicable)
      // this should not matter in the future though.
      document.cookie = "dashboard_language=" + (locale || "en") + "; path=/; SameSite=Lax;";
    },

    logout: function () {
      this.loading = true;
      http.get('/session/logout/').then(() => {
        this.loading = false;
        this.status();
      });
    },
    status: function () {
      this.server_response = {};
      this.loading = true;
      http.get('/session/status/').then(data => {
        this.$store.commit("set_user", data.data);
        this.loading = false;
        if (!this.$store.state.user.is_authenticated) {
          this.$bvToast.toast(this.$i18n.t('logged_out_successfully'), {
            title: `✅ ${this.$i18n.t('logged_out_successfully')}`,
            autoHideDelay: 5000,
            variant: 'success',
            solid: true,
            isStatus: false,
            appendToast: false,
          })
          this.$router.push({'name': 'login'});
        }
      });
    },
  }
}
</script>
<i18n>
{
  "en": {
    "en": "English",
    "nl": "Nederlands",
    "sitedescription": "Test for modern Internet Standards like IPv6, DNSSEC, HTTPS, DMARC, STARTTLS and DANE.",
    "sitetitle": "Internet.nl",
    "account": "Account",
    "admin": "Admin",
    "domains": "Domains",
    "log_in": "Log in",
    "log_off": "Log off",
    "reports": "Reports",
    "tour": "Tour",
    "scans": "  Scans",
    "notifications": "Notifications",
    "authentication": "Authentication",
    "web_metrics": "Web metrics",
    "mail_metrics": "Mail metrics",
    "switch_user": "Switch user",
    "add_user": "Add user",
    "usage_overview": "Usage overview",
    "logged_out_successfully": "You have logged out successfully"
  },
  "nl": {
    "en": "English",
    "nl": "Nederlands",
    "sitedescription": "Test voor moderne Internetstandaarden zoals IPv6, DNSSEC, HTTPS, DMARC, STARTTLS en DANE.",
    "sitetitle": "Internet.nl",
    "account": "Profiel",
    "admin": "Beheer",
    "domains": "Domeinen",
    "log_in": "Inloggen",
    "log_off": "Uitloggen",
    "reports": "Rapporten",
    "tour": "Rondleiding",
    "scans": "  Scans",
    "notifications": "Notificaties",
    "authentication": "Authenticatie",
    "web_metrics": "Web meetwaarden",
    "mail_metrics": "Mail meetwaarden",
    "switch_user": "Wissel gebruiker",
    "add_user": "Gebruiker toevoegen",
    "usage_overview": "Gebruiksoverzicht",
    "logged_out_successfully": "Je bent uitgelogd"
  }
}
</i18n>
