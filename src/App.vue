<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
  <div id="app" :dir="html_page_reading_direction">
    <div class="skiplink"><a href="#content">{{ $t("app.skiplink.gotocontents") }}</a></div>
    <div class="skiplink" id="skiplink-sitenav"><a href="#sitenav">{{ $t("app.skiplink.gotomainmenu") }}</a></div>
    <div class="skiplink"><a href="#footer">{{ $t("app.skiplink.gotofooter") }}</a></div>

    <header class="headroom headroom--unpinned">
      <SiteMenu
        :is_authenticated="user.is_authenticated"
        :is_superuser="user.is_superuser"
        :account_name="user.account_name"
      />
    </header>

    <main id="content" tabindex="-1">
      <div class="wrap mt-3">
        <div class="w-100" style="min-height: 80vh">
          <b-alert variant="danger" :model-value="error_loading_config">{{ $t("app.core.error_loading_config") }}
            <b-button style="float:right" size="sm" variant="success" v-on:click="reload">
              {{ $t("app.core.reload_application") }}
            </b-button>
          </b-alert>
          <b-alert variant="danger" :model-value="error_connecting_to_backend">
            {{ $t("app.core.error_connecting_to_backend") }}
            <b-button style="float:right" size="sm" variant="success" v-on:click="reload">
              {{ $t("app.core.reload_application") }}
            </b-button>
          </b-alert>

          <router-view v-slot="{ Component }">
            <keep-alive>
              <component :is="Component"/>
            </keep-alive>
          </router-view>

        </div>
        <AITranslationMessage v-if="!['nl', 'en'].includes($i18n.locale)"/>
        <GithubMessage v-if="config.app.layout === 'internet_nl'"/>
      </div>
    </main>

    <footer id="footer" v-if="config.app.layout === 'internet_nl'">

      <!-- <img id="flag" src="static_frontend/images/vendor/internet_nl/clear.gif" alt="">-->
      <div class="wrap">
        {{ $t("app.footer.info") }}
        <hr>
        <ul>
          <li><a class="footlink" href="https://www.internet.nl/disclosure/">{{ $t("app.footer.disclosure") }}</a></li>
          <li><a class="footlink" href="https://www.internet.nl/privacy/">{{ $t("app.footer.privacy") }}</a></li>
          <li><a class="footlink" href="https://www.internet.nl/copyright/">{{ $t("app.footer.copyright") }}</a></li>
          <li class="follow-us"><a class="footlink linkedinfollow"
                                   href="https://www.linkedin.com/company/internet-nl/">{{
              $t("app.footer.followlinkedin")
            }}</a></li>
          <li class="follow-us"><a class="footlink mastodonfollow"
                                   href="https://mastodon.nl/@internet_nl">{{ $t("app.footer.followmastodon") }}</a>
          </li>
        </ul>
      </div>
    </footer>
  </div>
</template>

<script>
import {dashboardStore} from '@/dashboardStore'
import Headroom from "headroom.js";
import SiteMenu from './components/SiteMenu.vue'
import {mapState} from 'pinia'
import http from "@/httpclient";
import GithubMessage from "@/components/GithubMessage.vue";
import AITranslationMessage from "./components/AITranslationMessage.vue";

export default {

  beforeCreate() {

    // perform some calls we need otherwise we cannot route logged in pages.
    http.get('/data/config').then(data => {

      if (!(data && data.data && Object.keys(data.data).length !== 0)) {
        this.error_loading_config = true;
        throw new Error("Config is empty!");
      }
      this.store.set_config(data.data)


    }).catch(error => {
      this.error_connecting_to_backend = true;
      console.error('Error loading config', error)
    })


    const appName = "Internet.nl Dashboard"
    this.$router.afterEach((to, from, next) => {
      // dynamically set the page title based on the used route
      const nearestWithTitle = to.matched.slice().reverse().find(r => r.meta && r.meta.title);
      document.title = `${this.$i18n.t('app.menu.' + nearestWithTitle.meta.title)} / ${appName}`;
    });


    this.$nextTick(function () {
      const fixedHeader = new Headroom(document.querySelector("header"), {
        "offset": 205,
        "tolerance": 5,
        "classes": {"initial": "header-js-animated", "pinned": "header-pinned", "unpinned": "header-unpinned"}
      });
      fixedHeader.init();
    })
  },

  methods: {
    reload() {
      window.location.reload();
    }

  },

  name: 'App',
  data: function () {
    return {
      html_page_reading_direction: "ltr",
      error_loading_config: false,
      error_connecting_to_backend: false,
      store: dashboardStore(),
    }
  },

  components: {
    AITranslationMessage,
    GithubMessage,
    SiteMenu
  },
  computed: mapState(dashboardStore, ['user', 'config']),
}
</script>

<style>
.linkedinfollow {
  background: transparent url("/static_frontend/images/vendor/internet_nl/icon-linkedinfollow.png") no-repeat 5px center !important;
  background-size: 1.25em 1.25em !important;
  padding-left: 2em !important;
}

.mastodonfollow {
  background: transparent url("/static_frontend/images/vendor/internet_nl/icon-mastodonfollow-small.png") no-repeat 5px center !important;
  background-size: 1.25em 1.25em !important;
  padding-left: 2em !important;
}

.footlink:hover, .footlink:visited, .footlink:active {
  color: white;
}
</style>
