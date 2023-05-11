// SPDX-License-Identifier: Apache-2.0
// Note that there is a little hate going on with multiple vue instances.
// See here: https://github.com/LinusBorg/portal-vue/issues/201#issuecomment-484452281
// This explains why there are some extra definitions in the bundler thingies.
import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";
import VueRouter from 'vue-router'
import VueI18n from 'vue-i18n'
import vSelect from 'vue-select'
import autorefresh from './components/autorefresh'
import loading from './components/loading'
import server_response from './components/ServerResponse'

import ContentBlock from './components/ContentBlock'

import Probe from './components/probe'
import CollapsePanel from './components/CollapsePanel'
import App from './App'
import router from './router';
import './assets/css/styles.scss';
import PortalVue from 'portal-vue'
import {
    LayoutPlugin,
    ModalPlugin,
    CardPlugin,
    ButtonPlugin,
    FormGroupPlugin,
    TablePlugin,
    TabsPlugin,
    FormInputPlugin,
    CollapsePlugin,
    AlertPlugin,
    ImagePlugin,
    FormCheckboxPlugin,
    FormRadioPlugin,
    PaginationPlugin,
    FormSelectPlugin,
    FormTextareaPlugin,
    SpinnerPlugin,
    ProgressPlugin,
    BVModalPlugin,
    BVToastPlugin,
    BootstrapVueIcons,
    InputGroupPlugin,
    NavbarPlugin,
    NavPlugin, BadgePlugin, FormTimepickerPlugin, FormDatepickerPlugin, ButtonGroupPlugin, TooltipPlugin,
    FormPlugin

} from 'bootstrap-vue'
import {parseISO, formatDistanceToNow, format, formatDuration, intervalToDuration, add} from 'date-fns'
import {enGB, nl} from 'date-fns/locale'
import VueMatomo from 'vue-matomo'

const plugins = [PortalVue, VueI18n, VueRouter, InputGroupPlugin, Vuex, LayoutPlugin, ModalPlugin, CardPlugin, ButtonPlugin, FormGroupPlugin, TablePlugin, TabsPlugin, FormInputPlugin, CollapsePlugin,
FormCheckboxPlugin, FormSelectPlugin, PaginationPlugin, AlertPlugin, FormTextareaPlugin, SpinnerPlugin, ProgressPlugin, NavbarPlugin, NavPlugin,
ImagePlugin, BVModalPlugin, BVToastPlugin, BootstrapVueIcons, BadgePlugin, FormTimepickerPlugin, FormDatepickerPlugin, ButtonGroupPlugin, TooltipPlugin,
FormPlugin, FormRadioPlugin
]
plugins.forEach(plugin => Vue.use(plugin))

Vue.component('v-select', vSelect);
Vue.component('content-block', ContentBlock);
Vue.component('autorefresh', autorefresh)
Vue.component('loading', loading)
Vue.component('server-response', server_response)
Vue.component('collapse-panel', CollapsePanel)
Vue.component('probe', Probe)

Vue.config.productionTip = false

Vue.prototype.$baseUrl = process.env.VUE_APP_DJANGO_PATH;

const i18n = new VueI18n({
    locale: 'en',
    fallbackLocale: 'en',
    silentFallbackWarn: true,
    // it's requformatDistanceired this is called messages.
    messages: {
        en: {
            "title_domains": "Internet.nl Dashboard / Domains",
        },
        nl: {
            "title_domains": "Internet.nl Dashboard / Domeinen",
        }
    },
    sharedMessages: {}
});

const store = new Vuex.Store({
    state: {
        // -2 is used, to be able to distinct for the first upload and zero uploads.
        uploads_performed: -2,

        // the scan monitor is used to determine if lists of domains or the reports dropdowns need to be
        // updated. If the scan monitor is not loaded, a standard autorefresh strategy is used.
        scan_monitor_data: [],

        // active language:
        locale: 'en',

        // login states
        user: {
            is_authenticated: false,
            is_superuser: false,
            account_name: '',
        },

        // Visible metrics in report, report graphs and visible metrics configuration pane
        visible_metrics: {},

        // What reports need to be shown on the reporting page: list of integers
        report_ids: [],

        // List of report codes with an attached public share code. The public share code is used as a password.
        // these codes are stored in local storage. They are not treated as a password as the data is not sensitive
        public_share_codes: {},


        // what tags are used to filter reports
        tags: [],
    },

    mutations: {
        // this.$store.commit('set_uploads_performed', 0)
        set_uploads_performed(state, value) {
            state.uploads_performed = value;
        },
        update_scan_monitor_data(state, value) {
            state.scan_monitor_data = value;
        },
        set_locale(state, value) {
            state.locale = value;
        },
        set_user(state, value) {
            state.user = value;
        },
        set_visible_metrics(state, value) {
            state.visible_metrics = value;
        },
        set_report_ids(state, value) {
            state.report_ids = value;
        },
        set_tags(state, value) {
            state.tags = value;
        },
        set_ad_hoc_report_custom_date(state, value){
            state.ad_hoc_report_custom_date = value;
        },
        set_ad_hoc_report_custom_time(state, value){
            state.ad_hoc_report_custom_time = value;
        }
    },

    plugins: [createPersistedState()],
});




// Todo: use more prototypes, as that seems to be easier to work with than calling "this". I don't know if it's faster
//   as now all strings have these methods but are rarely used...
const dateLocales = {nl: nl, en: enGB}
String.prototype.human_date = function() {
    return format(parseISO(this), 'PPPP', {locale: dateLocales[i18n.locale]});
}


// these methods are used over and over.
Vue.mixin(
    {
        // add some properties to each and every object.
        beforeMount: function () {
            // translate everything.
            this.$i18n.locale = this.locale;
        },
        methods: {
            copy_json_value: function (obj) {
                // does not copy methods.
                return JSON.parse(JSON.stringify(obj));
            },
            isEmptyObject: function (my_object) {
                // This replaces the jQuery.isEmptyObject(), which is not a good reason to include the entirity of jquery
                // Documentation: https://www.samanthaming.com/tidbits/94-how-to-check-if-object-is-empty/
                return Object.keys(my_object).length === 0 && my_object.constructor === Object
            },
            get_cookie: function (name) {
                let value = "; " + document.cookie;
                let parts = value.split("; " + name + "=");
                if (parts.length === 2) return parts.pop().split(";").shift();
            },
            // https://stackoverflow.com/questions/14573223/set-cookie-and-get-cookie-with-javascript
            set_cookie: function (name, value, days) {
                let expires = "";
                if (days) {
                    let date = new Date();
                    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                    expires = "; expires=" + date.toUTCString();
                }
                document.cookie = name + "=" + (value || "") + expires + "; path=/";
            },
            humanize_date: function (date) {
                if ([undefined, null, "", 0].includes(date))
                    return ""
                return format(parseISO(date), 'PPPP', {locale: this.dateLocales[this.locale]});
            },
            humanize_date_unix_timestamp: function (date) {
                if ([undefined, null, "", 0].includes(date))
                    return ""
                return format(new Date(date * 1000), 'PPPP', {locale: this.dateLocales[this.locale]});
            },
            humanize_date_date_only: function (date) {
                if ([undefined, null, "", 0].includes(date))
                    return ""
                return format(parseISO(date), 'PPP', {locale: this.dateLocales[this.locale]});
            },
            humanize_relative_date: function (date) {
                if ([undefined, null, "", 0].includes(date))
                    return ""
                return formatDistanceToNow(parseISO(date), {addSuffix: true, locale: this.dateLocales[this.locale]})
            },
            humanize_duration: function (duration_in_milliseconds) {
                if ([undefined, null, "", 0].includes(duration_in_milliseconds))
                    return ""
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
                        locale: this.dateLocales[this.locale]
                    })
            },
            humanize_filesize: function (size_in_bytes, decimals = 0) {
                if (size_in_bytes === 0) return '0 Bytes';
                let k = 1024,
                    dm = decimals <= 0 ? 0 : decimals || 2,
                    sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
                    i = Math.floor(Math.log(size_in_bytes) / Math.log(k));
                return parseFloat((size_in_bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
            },

        },
        // make sure all components are also translated when the locale is switched.
        // see: https://github.com/kazupon/vue-i18n/issues/411,
        computed: {
            locale() {
                if (typeof this.$store !== 'undefined') {
                    return this.$store.state.locale;
                } else if (typeof store !== 'undefined') {
                    // on the root component 'this' is not available. But we can access store and everything directly.
                    // console.info(`Using store locale, set to ${store.state.locale}.`);
                    return store.state.locale;
                } else {
                    // fallback language
                    console.info('Using fallback locale.')
                    return 'en';
                }
            },
            dateLocales: function () {
                return {nl: nl, en: enGB}
            }
        },
        watch: {
            locale() {
                if (typeof this.$i18n !== 'undefined') {
                    this.$i18n.locale = this.locale;
                }
            },
        },
    }
);


function is_public_page(page_name){
    return !!['login', 'demo', 'tour', 'shared_report', 'compared_shared_report', 'home', 'signup'].includes(page_name);
}


// https://www.digitalocean.com/community/tutorials/vuejs-vue-router-modify-head
router.beforeEach((to, from, next) => {
    const nearestWithTitle = to.matched.slice().reverse().find(r => r.meta && r.meta.title);
    if (nearestWithTitle) {
        document.title = nearestWithTitle.meta.title;
    }

    // https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards
    if (!is_public_page(to.name) && !store.state.user.is_authenticated) next({name: 'login'})
    else next()
});

Vue.use(VueMatomo, {
  // Configure your matomo server and site by providing
  host: 'https://matomo.internet.nl',
  siteId: 2,

  // Changes the default .js and .php endpoint's filename
  // Default: 'matomo'
  trackerFileName: 'matomo',

  // Overrides the autogenerated tracker endpoint entirely
  // Default: undefined
  // trackerUrl: 'https://example.com/whatever/endpoint/you/have',

  // Overrides the autogenerated tracker script path entirely
  // Default: undefined
  // trackerScriptUrl: 'https://example.com/whatever/script/path/you/have',

  // Enables automatically registering pageviews on the router
  router: router,

  // Enables link tracking on regular links. Note that this won't
  // work for routing links (ie. internal Vue router links)
  // Default: true
  enableLinkTracking: true,

  // Require consent before sending tracking information to matomo
  // Default: false
  requireConsent: false,

  // Whether to track the initial page view
  // Default: true
  trackInitialView: true,

  // Run Matomo without cookies
  // Default: false
  disableCookies: false,

  // Require consent before creating matomo session cookie
  // Default: false
  requireCookieConsent: false,

  // Enable the heartbeat timer (https://developer.matomo.org/guides/tracking-javascript-guide#accurately-measure-the-time-spent-on-each-page)
  // Default: false
  enableHeartBeatTimer: false,

  // Set the heartbeat timer interval
  // Default: 15
  heartBeatTimerInterval: 15,

  // Whether or not to log debug information
  // Default: false
  debug: false,

  // UserID passed to Matomo (see https://developer.matomo.org/guides/tracking-javascript-guide#user-id)
  // Default: undefined
  userId: undefined,

  // Share the tracking cookie across subdomains (see https://developer.matomo.org/guides/tracking-javascript-guide#measuring-domains-andor-sub-domains)
  // Default: undefined, example '*.example.com'
  cookieDomain: undefined,

  // Tell Matomo the website domain so that clicks on these domains are not tracked as 'Outlinks'
  // Default: undefined, example: '*.example.com'
  domains: undefined,

  // A list of pre-initialization actions that run before matomo is loaded
  // Default: []
  // Example: [
  //   ['API_method_name', parameter_list],
  //   ['setCustomVariable','1','VisitorType','Member'],
  //   ['appendToTrackingUrl', 'new_visit=1'],
  //   etc.
  // ]
  preInitActions: [],

  // A function to determine whether to track an interaction as a site search
  // instead of as a page view. If not a function, all interactions will be
  // tracked as page views. Receives the new route as an argument, and
  // returns either an object of keyword, category (optional) and resultsCount
  // (optional) to track as a site search, or a falsey value to track as a page
  // view.
  // Default: false, i.e. track all interactions as page views
  // Example: (to) => {
  //   if (to.query.q && to.name === 'search') {
  //     return { keyword: to.query.q, category: to.params.category }
  //   } else {
  //    return null
  //   }
  // }
  trackSiteSearch: false
});

new Vue({
    i18n,
    router,
    store,
    render: h => h(App),
}).$mount('#app')

