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

      <template v-if="reports_require_authentication">
        <ReportPasswords :reports="reports" @retry="retry"></ReportPasswords>
      </template>
      <template v-else>
        <content-block>
          <report_header :reports="reports"></report_header>
        </content-block>

        <ReportCharts :reports="reports"/>

        <!-- The table can show up to two reports (the first as the source, the second as a comparison). -->
        <content-block v-if="reports.length < 3" style="page-break-before: always;">
          <ReportTable :reports="reports"/>
        </content-block>
      </template>
    </div>

  </div>
</template>

<script>
import ReportCharts from './ReportCharts'
import ReportPasswords from './ReportPasswords'
import ReportTable from './ReportTable'
import report_mixin from './report_mixin'
import report_mixin_2 from './report_mixin_2'
import report_header from './report_header'


export default {
  components: {
    ReportCharts,
    ReportTable,
    ReportPasswords,
    report_header,
  },
  mixins: [report_mixin, report_mixin_2],
  name: 'report',
  data() {
    return {
      // list of report ids that should be shown as a report
      requested_report_ids: [],
    }
  },

  mounted() {
    this.load_visible_metrics();
    let router_params = this.$router.history.current.params;
    // the route to this component can determine what is shown
    this.requested_report_ids = [router_params.report, router_params.compare_with].filter(Boolean);
  },

  methods: {
    retry(){
      this.load_shared_reports_by_ids(this.requested_report_ids);
    }
  },

  watch: {
    requested_report_ids(report_ids) {
      this.load_shared_reports_by_ids(report_ids);
    },
  },

  computed: {
    reports_require_authentication(){
      for (let i =0; i<this.reports.length; i++){
        if (this.reports[i].authentication_required === true)
          return true
      }
      return false
    },

  }
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