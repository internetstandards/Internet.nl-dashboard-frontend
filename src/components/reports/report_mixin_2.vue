<!-- SPDX-License-Identifier: Apache-2.0 -->
<script>
import http from "@/httpclient"
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
      my_store: dashboardStore(),
    }
  },

  methods: {
    load_reports_by_ids(report_ids, data) {
      let link = '/data/report/get/'
      if (Object.keys(data).length > 0) {
        link = '/data/report/ad_hoc/'
      }
      this.load_reports_by_ids_at(link, report_ids, data)
    },
    load_shared_reports_by_ids(report_ids) {
      this.load_reports_by_ids_at('/data/public/shared/', report_ids)
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

    load_reports_by_ids_at(link, report_ids, data) {
      this.reports_to_load = report_ids.length;
      const reports = [];
      const shallow_reports = [];

      for (let i = 0; i < this.reports_to_load; i++) {
        const stored_share_code = this.my_store.public_share_codes[report_ids[i]];
        const post_data = {...{share_code: stored_share_code ? stored_share_code : ""}, ...data}

        // A smaller response means faster load times, loading the reports is noticible in vue while the download is fast
        console.log(`Getting report id: ${report_ids[i]}`)

        if (stored_share_code) {
          // todo: make this nicer, it does the same on post and get... But the report code needs to be posted as we
          //  cannot have that parameter in a url for security reasons.
           http.post(`${link}${report_ids[i]}`, post_data).then(response => {
             // The report might be empty, because the wrong code has been sent:

             if (response.data !== undefined && response.data !== "") {
               console.log(`Retrieved report data: ${report_ids[i]}`)

               // only add comparison data to the second report, because we want to quickly access urls of that one.
               if (i > 0)
                 this.add_comparison_urls_to_report(response.data)

               reports[i] = response.data;
               // use destructuring to avoid copying a large object to memory and then ditching the large value
               // this is much faster and not as memory-intensive.
               // shallow_reports[i] = structuredClone(response.data);
               // shallow_reports[i]['calculation'] = [];
               shallow_reports[i] = this._objectWithoutProperties(response.data, ['calculation']);

               // this.$forceUpdate()
               console.log(`Set report data: ${report_ids[i]}`)
             }
             this.reports_to_load--;

             if (this.reports_to_load === 0 && reports.length > 0) {
               this.reports = shallowRef(reports);
               // these can be changed by the user
               this.shallow_reports = shallow_reports;
             }
           });
        } else {
          http.get(`${link}${report_ids[i]}`, post_data).then(response => {
            // The report might be empty, because the wrong code has been sent:

            if (response.data !== undefined && response.data !== "") {
              console.log(`Retrieved report data: ${report_ids[i]}`)

              // only add comparison data to the second report, because we want to quickly access urls of that one.
              if (i > 0)
                this.add_comparison_urls_to_report(response.data)

              reports[i] = response.data;
              // use destructuring to avoid copying a large object to memory and then ditching the large value
              // this is much faster and not as memory-intensive.
              // shallow_reports[i] = structuredClone(response.data);
              // shallow_reports[i]['calculation'] = [];
              shallow_reports[i] = this._objectWithoutProperties(response.data, ['calculation']);

              // this.$forceUpdate()
              console.log(`Set report data: ${report_ids[i]}`)
            }
            this.reports_to_load--;

            if (this.reports_to_load === 0 && reports.length > 0) {
              this.reports = shallowRef(reports);
              // these can be changed by the user
              this.shallow_reports = shallow_reports;
            }
          });
        }
      }
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
