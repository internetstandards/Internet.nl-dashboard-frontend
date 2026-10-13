<!-- SPDX-License-Identifier: Apache-2.0 -->
<script>
import http from "@/httpclient"
import {problemTypes} from "@/apiProblems"
import {requestError} from "@/requestError"
// import structuredClone from '@ungap/structured-clone';
import { dashboardStore } from '@/dashboardStore'
import { shallowRef } from 'vue'

export default {

  data() {
    return {
      // Complete reports with all data and metadata to make a nice representation.
      reports: [],

      // shallow reports contains administrative data only, not the gigantic actual dataset. This can be used to
      // easily display things such as the download, sharing options and headers. This saves a ton of memory on the
      // client.
      shallow_reports: [],

      // number of reports that still need to be retrieved. If this is 0 all reports are in. Up to 6 reports
      // can be loaded and compared with graphs in a somewhat meaningful way.
      reports_to_load: 0,
      report_errors: [],
      report_load_id: 0,
      my_store: dashboardStore(),
    }
  },

  methods: {
    load_reports_by_ids(report_ids, data = {}) {
      const is_ad_hoc_preview = Object.keys(data).length > 0
      const path_suffix = is_ad_hoc_preview ? '/ad-hoc/preview' : ''
      return this.load_reports_by_ids_at('/api/v1/reports/', report_ids, data, path_suffix, is_ad_hoc_preview)
    },
    load_shared_reports_by_ids(report_ids) {
      return this.load_reports_by_ids_at('/api/v1/public-reports/', report_ids)
    },

    // this.reports.forEach((report) => this.add_comparison_urls_to_report(report))
    add_comparison_urls_to_report(report) {
      console.log("adding comparison urls")
      // The comparison report requires direct data access to urls to be able to compare
      // by simply reading data directly without scanning the table.
      report.calculation.urls_by_url = {};
      report.calculation.urls.forEach((url) => {
        report.calculation.urls_by_url[url.url] = url;
      });
      // return report;
    },

    load_reports_by_ids_at(link, report_ids, data = {}, path_suffix = '', use_post = false) {
      const load_id = ++this.report_load_id;
      this.reports_to_load = report_ids.length;
      this.report_errors = [];
      const errors = [];
      const shared = link === '/api/v1/public-reports/';

      return Promise.all(report_ids.map(async (report_id, index) => {
        const share_code = shared && this.my_store.public_share_codes[report_id];
        const post_data = {...data};
        for (const field of ['custom_date', 'custom_time']) {
          if (post_data[field] === '') post_data[field] = null;
        }
        if (share_code) post_data.share_code = share_code;
        const request_url = `${link}${report_id}${path_suffix}`;
        try {
          const response = share_code || use_post
            ? await http.post(request_url, post_data)
            : await http.get(request_url);
          const report = response.data;
          if (!report || typeof report !== 'object' || Array.isArray(report)) return null;
          if (index > 0 && report.calculation?.urls) this.add_comparison_urls_to_report(report);
          return report;
        } catch (error) {
          const response = requestError(error);
          const problem = response.data;
          if (shared && response.status === 403 && problem?.type === problemTypes.REPORT_ACCESS_DENIED && problem.report) {
            return {...problem.report, authentication_required: true};
          }
          errors.push(response);
          return null;
        }
      })).then(results => {
        // A retry can finish before an older request; only publish the current batch.
        if (load_id !== this.report_load_id) return;
        const reports = results.filter(report => report !== null);
        this.reports = shallowRef(reports);
        this.shallow_reports = reports.map(report => this._objectWithoutProperties(report, ['calculation']));
        this.report_errors = errors;
      }).finally(() => {
        if (load_id === this.report_load_id) this.reports_to_load = 0;
      });
    },
    // https://stackoverflow.com/questions/34698905/how-can-i-clone-a-javascript-object-except-for-one-key
    _objectWithoutProperties(obj, keys) {
      const target = {};
      for (const i in obj) {
        if (keys.indexOf(i) >= 0) continue;
        if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
        target[i] = obj[i];
      }
      return target;
    }
  },

  watch: {
    reports_to_load(reports_to_load) {
      // Loading is done, refresh the UI.
      if (reports_to_load === 0) {

        this.$nextTick(() => {
          this.$forceUpdate();
        });
      }
    }
  }

}

</script>
