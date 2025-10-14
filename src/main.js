import '@/assets/css/styles.scss';

import App from './App.vue'
import {createApp} from 'vue'
import {createPinia, mapState} from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import VueMatomo from 'vue-matomo'
import matomoConfig from './matomoConfig.js'
import i18n from './i18n'
import router from './router.js'
import {createBootstrap} from 'bootstrap-vue-next'
import ContentBlock from '@/components/ContentBlock.vue'
import loading from '@/components/loading.vue'
import server_response from '@/components/ServerResponse.vue'
import {dashboardStore} from '@/dashboardStore'

const app = createApp(App)
app.config.globalProperties.$baseUrl = import.meta.env.VITE_VUE_APP_DJANGO_PATH;
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(createBootstrap())
app.use(VueMatomo, matomoConfig)
app.component('content-block', ContentBlock)
app.component('loading', loading)
app.component('server-response', server_response)



import {parseISO, formatDistanceToNow, format, formatDuration, intervalToDuration, add} from 'date-fns'
import {enGB, nl, pt, de, fr, da, cs} from 'date-fns/locale'
import http from "@/httpclient.js";


// todo: mixins are not recommended in vue3, but composables are. But i don't want to include the same file everywhere.
// https://vuejs.org/guide/reusability/composables
app.mixin(
  {
    beforeMount: function () {
      // translate everything based on the user preference in this browser, stored with persisted state.
      this.$i18n.locale = this.locale;
    },
    computed: {
      dateLocales: function () {
        return {nl: nl, en: enGB, fr: fr, de: de, pt: pt, dk: da, cz: cs}
      },
      ...mapState(dashboardStore, ['locale']),
    },
    methods: {
      copy_json_value: function (obj) {
        // currently only copies simple types, should be replaced with structuredClone if more is needed
        return JSON.parse(JSON.stringify(obj));
      },
      isEmptyObject: function (my_object) {
        // https://www.samanthaming.com/tidbits/94-how-to-check-if-object-is-empty/
        return Object.keys(my_object).length === 0 && my_object.constructor === Object
      },
      humanize_date: function (date) {
        return format(parseISO(date), 'PPPP', {locale: this.dateLocales[this.$i18n.locale]});
      },
      humanize_date_unix_timestamp: function (date) {
        return format(new Date(date * 1000), 'PPPP', {locale: this.dateLocales[this.$i18n.locale]});
      },
      humanize_date_date_only: function (date) {
        return format(parseISO(date), 'PPP', {locale: this.dateLocales[this.$i18n.locale]});
      },
      humanize_relative_date: function (date) {
        return formatDistanceToNow(parseISO(date), {addSuffix: true, locale: this.dateLocales[this.locale]})
      },
      humanize_duration: function (duration_in_milliseconds) {
        return formatDuration(
          intervalToDuration(
            {
              start: new Date(2019, 1, 1),
              end: add(new Date(2019, 1, 1), {seconds: duration_in_milliseconds / 1000})
            }
          ),
          {
            delimiter: ', ',
            format: ['hours', 'minutes'],
            locale: this.dateLocales[this.$i18n.locale]
          }
        )
      },
    },
  }
)

http.get('/data/session/status').then(data => {
  // making sure the page can be accessed is a pretty complex pattern in pinia and such...
  // this makes the app slightly slower as a get-request is needed. It does prevent some flashes while getting that data
  let store = dashboardStore()
  store.set_user(data.data);

  router.beforeEach((to, from, next) => {
    // redirect old style links to the cleaner links, from old e-mails and such...
    if (to.fullPath.startsWith("/#")) {
      window.location = to.fullPath.substring(2);
    }

    // dynamically set the page title based on the used route
    const nearestWithTitle = to.matched.slice().reverse().find(r => r.meta && r.meta.title);

    // support authenticated and non-authenticated routes
    if (nearestWithTitle.meta.access === 'public' || store.user.is_authenticated) {
      next()
    }

    next({name: 'login'})
  });

  app.use(router)
  app.use(i18n)
  matomoConfig.router = router  // Enables automatically registering pageviews on the router

  app.mount('#app')
})

