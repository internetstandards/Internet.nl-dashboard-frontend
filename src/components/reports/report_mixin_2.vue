<!-- SPDX-License-Identifier: Apache-2.0 -->
<script>
import http from "@/httpclient"

export default {

  data() {
    return {
      // Complete reports with all data and metadata to make a nice representation.
      reports: [],

      // number of reports that still need to be retrieved. If this is 0 all reports are in. Up to 6 reports
      // can be loaded and compared with graphs in a somewhat meaningful way.
      reports_to_load: 0,
    }
  },

  methods: {
    load_reports_by_ids(report_ids, tags){
      let link = '/data/report/get/'
      if (tags !== undefined){
        link = '/data/report/ad_hoc/'
      }
      this.load_reports_by_ids_at(link, report_ids, tags)
    },
    load_shared_reports_by_ids(report_ids){
        this.load_reports_by_ids_at('/data/report/shared/', report_ids)
    },

      // this.reports.forEach((report) => this.add_comparison_urls_to_report(report))
    add_comparison_urls_to_report(report) {
      console.log("adding comparison urls")
      // The comparison report require direct data access to urls to be able to compare
      // by simply reading data directly without scanning the table.
      report.calculation.urls_by_url = {};
      report.calculation.urls.forEach((url) => {
        report.calculation.urls_by_url[url.url] = url;
      });
      // return report;
    },

    load_reports_by_ids_at(link, report_ids, tags){
      this.reports_to_load = report_ids.length;
      this.reports = [];

      for (let i = 0; i < this.reports_to_load; i++) {
        let stored_share_code = this.$store.state.public_share_codes[report_ids[i]];
        let data = {share_code: stored_share_code ? stored_share_code : "", tags: tags}

        // A smaller response means faster load times, loading the reports is noticible in vue while the download is fast
        http.post(`${link}${report_ids[i]}/`, data).then(response => {
          // The report might be empty, because the wrong code has been sent:

          if (response.data !== undefined) {

              // only add comparison data to the second report, because we want to quickly access urls of that one.
              if (i > 0)
                  this.add_comparison_urls_to_report(response.data)

            this.$set(this.reports, i, response.data);
          }
          this.reports_to_load--;
        });
      }
    }
  },

  watch: {
    reports_to_load(reports_to_load) {
      // Loading is done, refresh the UI.
      if (reports_to_load === 0) this.$nextTick(() => {this.$forceUpdate();});
    }
  }

}

</script>