<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
  <div id="app">
    <div class="skiplink"><a href="#content">{{ $t('skiplink.gotocontents') }}</a></div>
    <div class="skiplink" id="skiplink-sitenav"><a href="#sitenav">{{ $t('skiplink.gotomainmenu') }}</a></div>
    <div class="skiplink"><a href="#footer">{{ $t('skiplink.gotofooter') }}</a></div>

    <header>
      <SiteMenu
        :is_authenticated="user.is_authenticated"
        :is_superuser="user.is_superuser"
        :account_name="user.account_name"
      />
    </header>

    <main id="content" tabindex="-1">
      <div class="wrap mt-3">
        <div class="w-100">
          <keep-alive>
            <router-view></router-view>
          </keep-alive>
        </div>
      </div>
    </main>

    <footer id="footer">
      <img id="flag" src="static/images/vendor/internet_nl/clear.gif" alt="">
      <div class="wrap">
        {{ $t('base.info') }}
        <hr>
        <ul>
          <li><a class="footlink" href="https://www.internet.nl/disclosure/">{{ $t('base.disclosure') }}</a></li>
          <li><a class="footlink" href="https://www.internet.nl/privacy/">{{ $t('base.privacy') }}</a></li>
          <li><a class="footlink" href="https://www.internet.nl/copyright/">{{ $t('base.copyright') }}</a></li>
          <li class="follow-us"><a class="footlink twitterfollow"
                                   href="https://twitter.com/internet_nl">{{ $t('base.followtwitter') }}</a></li>
        </ul>
      </div>
    </footer>
  </div>
</template>

<script>
import Headroom from "headroom.js";
import SiteMenu from './components/SiteMenu'
import {mapState} from 'vuex'
import http from "@/httpclient";

export default {
  i18n: {
    locale: 'en',
    fallbackLocale: 'en',
    silentFallbackWarn: true,
  },
  mounted: function () {
    this.login_status();
    this.$nextTick(function () {
      let fixedHeader = new Headroom(document.querySelector("header"), {
        "offset": 205,
        "tolerance": 5,
        "classes": {"initial": "header-js-animated", "pinned": "header-pinned", "unpinned": "header-unpinned"}
      });
      fixedHeader.init();
    })
  },
  name: 'App',
  data: function () {
    return {
      maximum_lists_per_spreadsheet: 200,
      maximum_urls_per_spreadsheet: 5000,
    }
  },
  methods: {
    login_status: function () {
      this.server_response = {};
      this.loading = true;
      http.get('/session/status/').then(data => {
        this.$store.commit("set_user", data.data);
        this.loading = false;
      });
    },
  },
  components: {
    SiteMenu
  },
  computed: mapState(['user']),
}
</script>

<style>
.twitterfollow {
  background: transparent url("/static_frontend/images/vendor/internet_nl/icon-twitterfollow.svg") no-repeat 5px center !important;
  background-size: 1.25em 1.25em !important;
  padding-left: 2em !important;
}
</style>
<i18n>
{
  "en": {
    "base": {
      "copyright": "Copyright",
      "disclosure": "Responsible disclosure",
      "followtwitter": "Follow us on Twitter",
      "info": "Internet.nl is an initiative of the Internet community and the Dutch government.",
      "privacy": "Privacy statement"
    },
    "skiplink": {
      "gotocontents": "Skip to contents",
      "gotomainmenu": "Skip to main menu",
      "gotofooter": "Skip to footer"
    }
  },
  "nl": {
    "base": {
      "copyright": "Copyright",
      "disclosure": "Responsible disclosure",
      "followtwitter": "Volg ons op Twitter",
      "info": "Internet.nl is een initiatief van de internetgemeenschap en de Nederlandse overheid.",
      "privacy": "Privacyverklaring"
    },
    "skiplink": {
      "gotocontents": "Skip naar inhoud",
      "gotomainmenu": "Skip naar menu",
      "gotofooter": "Skip naar footer"
    }
  }
}
</i18n>
