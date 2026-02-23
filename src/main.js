import '@/assets/css/styles.scss';

import App from './App.vue'
import {createApp} from 'vue'
import {createPinia, mapState} from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import VueMatomo from 'vue-matomo'
import matomoConfig from './matomoConfig.js'
import i18n from './i18n'
import router from './router/router.js'
import {createBootstrap} from 'bootstrap-vue-next'
import ContentBlock from '@/components/ContentBlock.vue'
import loading from '@/components/loading.vue'
import server_response from '@/components/ServerResponse.vue'
import {dashboardStore} from '@/dashboardStore'
import {allauthStore} from '@/allauthStore'

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

const store = dashboardStore()
const authStore = allauthStore()

Promise.allSettled([
  http.get('/api/v1/session/status'),
  authStore.bootstrap()
]).then(([sessionResult, allauthResult]) => {
  if (sessionResult.status === 'fulfilled') {
    store.set_user(sessionResult.value.data)
  } else {
    console.error('Unable to load dashboard session status.', sessionResult.reason)
    store.set_user({
      is_authenticated: false,
      is_superuser: false,
      account_name: '',
      second_factor_enabled: false,
      account_id: null
    })
  }

  if (allauthResult.status === 'rejected') {
    console.error('Unable to bootstrap allauth configuration/session.', allauthResult.reason)
  }

  router.beforeEach((to, from, next) => {
    if (to.fullPath.startsWith('/#')) {
      window.location = to.fullPath.substring(2)
      return
    }

    const isAllauthRoute = to.matched.some((route) => route.meta?.allauth)
    if (isAllauthRoute) {
      const requiresAuth = to.matched.some((route) => route.meta?.requiresAuth)
      const requiresAnon = to.matched.some((route) => route.meta?.requiresAnon)

      if (requiresAuth && !store.user.is_authenticated) {
        const nextParam = encodeURIComponent(to.fullPath)
        next(`/account/login?next=${nextParam}`)
        return
      }

      if (requiresAnon && store.user.is_authenticated) {
        next('/domains')
        return
      }

      next()
      return
    }

    const nearestWithAccess = to.matched.slice().reverse().find((route) => route.meta && route.meta.access)
    if (!nearestWithAccess || nearestWithAccess.meta.access === 'public' || store.user.is_authenticated) {
      next()
      return
    }

    next({name: 'login'})
  })

  app.use(router)
  app.use(i18n)
  matomoConfig.router = router

  app.mount('#app')
})
