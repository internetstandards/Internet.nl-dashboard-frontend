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
          <b-alert variant="danger" :model-value="error_loading_config">{{ $t("app.core.error_loading_config")}} <b-button style="float:right" size="sm" variant="success" v-on:click="reload">{{ $t("app.core.reload_application")}}</b-button></b-alert>
          <b-alert variant="danger" :model-value="error_connecting_to_backend">{{ $t("app.core.error_connecting_to_backend")}} <b-button style="float:right" size="sm" variant="success" v-on:click="reload">{{ $t("app.core.reload_application")}}</b-button></b-alert>

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
          <li class="follow-us"><a class="footlink twitterfollow"
                                   href="https://x.com/internet_nl">{{ $t("app.footer.followtwitter") }}</a></li>
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


  mounted() {

     // perform some calls we need otherwise we cannot route logged in pages.
    http.get('/data/config/').then(data => {
      if (!(data && data.data && Object.keys(data.data).length !== 0)) {
        this.error_loading_config = true;
        throw new Error("Config is empty!");
      }
      this.store.set_config(data.data)
      http.get('/session/status/').then(data => {
        this.store.set_user(data.data);

        // todo: is the navigation reactive to user? If the user is logged in / out: is that being taken into account?
        // todo: get app name from config. / how is that translated?

        const appName = "Internet.nl Dashboard"

        this.$router.beforeEach((to, from, next) => {
          // dynamically set the page title based on the used route
          const nearestWithTitle = to.matched.slice().reverse().find(r => r.meta && r.meta.title);
          if (!nearestWithTitle) {
            next({name: 'login'})
          }

          document.title = `${this.$i18n.t('app.menu.' + nearestWithTitle.meta.title)} / ${appName}`;

          // support authenticated and non authenticated routes
          if (nearestWithTitle.meta.access === 'public' || this.user.is_authenticated) {
            next()
          } else {
            next({name: 'login'})
          }
        });
      });
    }).catch(error => {
      this.error_connecting_to_backend = true;
      console.error('Error loading config', error)
    })

    this.$nextTick(function () {
      let fixedHeader = new Headroom(document.querySelector("header"), {
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
.twitterfollow {
  background: transparent url("/static_frontend/images/vendor/internet_nl/icon-xfollow.svg") no-repeat 5px center !important;
  background-size: 1.25em 1.25em !important;
  padding-left: 2em !important;
}

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
