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

</style>
<template>
  <b-navbar toggleable="md">
    <b-container style="max-width: 1064px;">
      <b-navbar-brand to="domains">
        <p id="site-title"><a><span class="hidden">{{ $t('sitetitle') }}</span></a></p>
        <p id="site-description"><span class="hidden">{{ $t('sitedescription') }}</span></p>
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>

        <!-- sorry for the table here, after hours of fiddling with css to get two ul's below each other i'm done and
         just use the worst option that works. -->
        <table class="retro-vintage-table"><tr><td class="ml-auto">
        <b-navbar-nav id="language-switch-header-container" class="language-switch-list" style="float: right;">
          <b-nav-item v-if="is_superuser">{{ this.account_name }}</b-nav-item>
          <b-nav-item v-for="(lang_code, index) in supported_languages" :key="index" :disabled="lang_code === locale" @click="set_locale(lang_code)">
            <b-icon icon="check" v-if="lang_code === locale"></b-icon>
            {{ $t(lang_code) }}
          </b-nav-item>
        </b-navbar-nav>

        </td></tr><tr><td>

        <b-navbar-nav style="float: right;">
          <template v-if="is_authenticated">
            <template v-if="is_superuser">
              <b-nav-item to="/switch-account" exact exact-active-class="active">
                <b-icon icon="person-circle"></b-icon>
              </b-nav-item>
              <b-nav-item to="/add-user" exact exact-active-class="active">
                <b-icon icon="person-plus"></b-icon>
              </b-nav-item>
              <b-nav-item to="/usage" exact exact-active-class="active">
                <b-icon icon="graph-up"></b-icon>
              </b-nav-item>
            </template>

            <b-nav-item to="/domains" accesskey="d" exact exact-active-class="active">{{
                $t("domains")
              }}
            </b-nav-item>
            <b-nav-item to="/scans" accesskey="s" exact exact-active-class="active">{{ $t("scans") }}</b-nav-item>
            <b-nav-item to="/report" accesskey="r" exact exact-active-class="active">{{
                $t("reports")
              }}
            </b-nav-item>
            <b-nav-item to="/account" accesskey="a" exact exact-active-class="active">{{
                $t("account")
              }}
            </b-nav-item>
            <b-nav-item @click="logout" accesskey="l" exact exact-active-class="active">{{
                $t("log_off")
              }}
            </b-nav-item>
          </template>
          <template v-if="!is_authenticated">
            <b-nav-item to="/login" accesskey="l" exact exact-active-class="active">{{ $t("log_in") }}</b-nav-item>
            <b-nav-item to="/tour" accesskey="t" exact exact-active-class="active">{{ $t("tour") }}</b-nav-item>
          </template>
        </b-navbar-nav>
        </td></tr></table>



      </b-collapse>
    </b-container>
  </b-navbar>
</template>
<script>
import http from "@/httpclient";

export default {
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
    "scans": "Scans",
    "logged_out_successfully": "You have logged out successfully"
  },
  "nl": {
    "en": "English",
    "nl": "Nederlands",
    "sitedescription": "Test voor moderne Internetstandaarden zoals IPv6, DNSSEC, HTTPS, DMARC, STARTTLS en DANE.",
    "sitetitle": "Internet.nl",
    "account": "Account",
    "admin": "Beheer",
    "domains": "Domeinen",
    "log_in": "Inloggen",
    "log_off": "Uitloggen",
    "reports": "Rapporten",
    "tour": "Rondleiding",
    "scans": "  Scans",
    "logged_out_successfully": "Je bent uitgelogd"
  }
}
</i18n>
