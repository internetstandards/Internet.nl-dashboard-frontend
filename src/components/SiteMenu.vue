<!-- SPDX-License-Identifier: Apache-2.0 -->
<style scoped>

/*Only highlight the text, not the whole line*/
.active span {
  font-weight: 600;
  border-bottom: 3px solid #ffab4c;
}

/*do not break when the menu becomes too wide*/
.nav-item span {
  white-space: nowrap;
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


    font-size: 100%;
    width: 13em;
    background: url("/static/logo_en.png");
    background: url("/static/logo_en.svg");
    background-repeat: no-repeat;
    background-size: contain;
    background-position: left center;

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
  <b-container class="max_container_width">
    <b-navbar toggleable="lg" id="sitenav">

      <b-navbar-brand to="domains">
        <template v-if="$store.state.config.app.layout === 'internet_nl'">
          <p id="site-title"><a><span class="hidden">{{ $t("app.menu.sitetitle") }}</span></a></p>
          <p id="site-description"><span class="hidden">{{ $t("app.menu.sitedescription") }}</span></p>
        </template>
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>

        <b-navbar-nav class="ml-auto">

          <b-nav-item to="/home" accesskey="h" exact exact-active-class="active"><span><b-icon icon="house" /> {{$t("app.menu.home") }}</span></b-nav-item>

          <template v-if="is_authenticated">
            <template v-if="is_superuser">

             <b-nav-item-dropdown exact exact-active-class="active">
              <template #text><b-icon icon="person-badge-fill" />  {{ $t("app.menu.admin") }}</template>
              <b-dropdown-item to="/switch-account"><b-icon icon="person-bounding-box" /> {{$t("app.menu.switch_user") }}</b-dropdown-item>
              <b-dropdown-item to="/add-user" ><b-icon icon="person-plus" /> {{$t("app.menu.add_user") }}</b-dropdown-item>
              <b-dropdown-item to="/usage" ><b-icon icon="graph-up" /> {{$t("app.menu.usage_overview") }}</b-dropdown-item>
              </b-nav-item-dropdown>
            </template>

            <b-nav-item to="/domains" accesskey="d" exact exact-active-class="active"><span><b-icon icon="card-list" /> {{$t("app.menu.domains") }}</span></b-nav-item>
            <b-nav-item to="/scans" accesskey="s" exact exact-active-class="active"><span><b-icon icon="search" /> {{ $t("app.menu.scans") }}</span></b-nav-item>
            <b-nav-item to="/report" accesskey="r" exact exact-active-class="active"><span><b-icon icon="file-bar-graph" /> {{$t("app.menu.reports") }}</span></b-nav-item>

            <b-nav-item-dropdown exact exact-active-class="active">
              <template #text><b-icon icon="person-circle" />  {{ $t("app.menu.account") }}</template>
              <b-dropdown-item v-if="is_superuser">Logged in as: {{ account_name }}</b-dropdown-item>
              <b-dropdown-item to="/account/notifications" accesskey="a"><span>📨 {{$t("app.menu.notifications") }}</span></b-dropdown-item>
              <b-dropdown-item to="/account/authentication" >📱 {{$t("app.menu.authentication") }}</b-dropdown-item>
              <b-dropdown-item to="/account/web_metrics" ><scan-type-icon type="web" /> {{$t("app.menu.web_metrics") }}</b-dropdown-item>
              <b-dropdown-item to="/account/mail_metrics"><scan-type-icon type="mail" /> {{$t("app.menu.mail_metrics") }}</b-dropdown-item>
              <b-dropdown-divider></b-dropdown-divider>
              <b-dropdown-item @click="logout" accesskey="l" ><b-icon icon="box-arrow-right" /> {{
                  $t("app.menu.log_off")
                }}</b-dropdown-item>
            </b-nav-item-dropdown>


          </template>
          <template v-if="!is_authenticated">
            <b-nav-item to="/tour" accesskey="t" exact exact-active-class="active"><span><b-icon icon="info-circle" /> {{ $t("app.menu.tour") }}</span></b-nav-item>
            <b-nav-item v-if="$store.state.config.show.signup_form" to="/signup" accesskey="u" exact exact-active-class="active"><span><b-icon icon="person-check" /> {{ $t("app.menu.request_access") }}</span></b-nav-item>
            <b-nav-item :href="$baseUrl + '/account/login/'" accesskey="l" exact exact-active-class="active"><span><b-icon icon="box-arrow-in-right" /> {{ $t("app.menu.log_in") }}</span></b-nav-item>
          </template>


            <b-nav-item-dropdown exact exact-active-class="active">

              <template #text><b-icon icon="flag" />  {{ $t("app.locale." + locale) }}</template>
              <b-dropdown-item v-for="(lang_code, index) in supported_languages" :key="index" :disabled="lang_code === locale" @click="set_locale(lang_code)">
                <span>
                <b-icon icon="check" v-if="lang_code === locale"></b-icon>
                {{ $t("app.locale." + lang_code) }}
                </span>
              </b-dropdown-item>
            </b-nav-item-dropdown>


        </b-navbar-nav>


      </b-collapse>

  </b-navbar>
  </b-container>
</template>
<script>
import http from "@/httpclient";
import ScanTypeIcon from "@/components/ScanTypeIcon";

export default {
  components: {ScanTypeIcon},
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

  mounted() {
    this.supported_languages = this.$store.state.config.app.supported_languages;
  },

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
          this.$bvToast.toast(this.$i18n.t("app.menu.logged_out_successfully"), {
            title: `✅ ${this.$i18n.t("app.menu.logged_out_successfully")}`,
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
