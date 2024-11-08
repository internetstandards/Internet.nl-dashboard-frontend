import Vuex from "vuex";
import Vue from "vue";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

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

        // tables for reports, rendered by chartjs, and then shown as table, not really nice but fastest to get this
        rendered_chart_to_table: {
            'overall': {}
        },
        config: {
            show: {
                signup_form: true,
            },
            app: {
                layout: "internet_nl"
            }
        }
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
        set_config(state, value) {
            state.config = value;
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

    plugins: [createPersistedState(
        {
            // 'uploads_performed','scan_monitor_data', 'user',
            //  'visible_metrics','report_ids', 'tags', 'ad_hoc_report_custom_date', 'ad_hoc_report_custom_time'
            paths: [ 'locale', ]
        }
    )],
});

export default store;