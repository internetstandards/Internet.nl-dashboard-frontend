import {defineStore} from 'pinia'

// main is the name of the store. It is unique across your application
// and will appear in devtools
export const dashboardStore = defineStore('vuex', {
  // a function that returns a fresh state
  state: () => ({
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
        signup_form: false,
      },
      app: {
        layout: "internet_nl",
        "subdomain_suggestion": {
          "enabled": false,
          "default_period": 120,
          "default_extend_period": 90
        },
        "signup": {
          "enabled": false
        },
        "supported_languages": [
          "en",
          "nl"
        ]
      }
    }
  }),

  persist: {
    pick: ['locale']
  },

  getters: {
    get_user(){
      return this.user
    }
  },

  actions: {
    set_uploads_performed(value) {
      this.uploads_performed = value;
    },
    update_scan_monitor_data
      (value) {
      this.scan_monitor_data = value;
    },
    set_locale(value) {
      this.locale = value;
    },
    set_user(value) {
      this.user = value;
    },
    set_config(value) {
      this.config = value;
    },
    set_visible_metrics(value) {
      this.visible_metrics = value;
    },
    set_report_ids(value) {
      this.report_ids = value;
    },
    set_tags(value) {
      this.tags = value;
    },
    set_ad_hoc_report_custom_date(value) {
      this.ad_hoc_report_custom_date = value;
    },
    set_ad_hoc_report_custom_time(value) {
      this.ad_hoc_report_custom_time = value;
    },
  },
})
