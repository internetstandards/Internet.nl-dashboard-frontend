<template>
  <div id="report-template">
    <content-block v-if="reports.length === 0 && reports_to_load === 0">
      <b-alert variant="danger" show>Could not find shared report. It may have been deleted or the report code or share code might have changed. You can try again with another share code.</b-alert>
    </content-block>

    <content-block class="do-not-print">
      <h1>{{ $t("title") }}</h1>
      <p>{{ $t("intro") }}</p>

      <loading :loading="reports_to_load > 0"></loading>
    </content-block>

    <div v-if="reports.length > 0 && reports_to_load === 0">
      <content-block>
        <report_header :reports="reports"></report_header>
      </content-block>

      <ReportCharts :reports="reports"/>

      <!-- The table can show up to two reports (the first as the source, the second as a comparison). -->
      <content-block v-if="reports.length < 3" style="page-break-before: always;">
        <ReportTable :reports="reports"/>
      </content-block>
    </div>

  </div>
</template>

<script>
import ReportCharts from './ReportCharts'
import ReportTable from './ReportTable'
import http from "@/httpclient"
import report_mixin from './report_mixin'
import report_header from './report_header'

export default {
  components: {
    ReportCharts,
    ReportTable,
    report_header,
  },
  mixins: [report_mixin],
  name: 'report',
  data() {
    return {
      // Complete reports with all data and metadata to make a nice representation.
      reports: [],

      // list of report ids that should be shown as a report
      requested_report_ids: [],

      // number of reports that still need to be retrieved. If this is 0 all reports are in. Up to 6 reports
      // can be loaded and compared with graphs in a somewhat meaningful way.
      reports_to_load: 0,
    }
  },

  mounted() {
    this.load_visible_metrics();
    let router_params = this.$router.history.current.params;
    // the route to this component can determine what is shown
    this.requested_report_ids = [router_params.report, router_params.compare_with].filter(Boolean);
  },

  watch: {
    requested_report_ids(report_ids) {
      this.reports_to_load = report_ids.length;
      this.reports = [];

      for (let i = 0; i < this.reports_to_load; i++) {
        // A smaller response means faster load times, loading the reports is noticible in vue while the download is fast
        http.get(`/data/report/shared/${report_ids[i]}/`).then(response => {
          // The report might be empty, because the wrong code has been sent:
          if (response.data[0] !== undefined) {
            this.$set(this.reports, i, response.data[0]);
          }
          this.reports_to_load--;
        });
      }
    },

    reports_to_load(reports_to_load) {
      // Loading is done, refresh the UI.
      if (reports_to_load === 0) this.$nextTick(() => this.$forceUpdate());
    }
  },
}
</script>
<i18n>
{
  "en": {
    "title": "Shared Report",
    "intro": " "
  },
  "nl": {
    "title": "Gedeeld Rapport",
    "intro": " "
  }
}
</i18n>