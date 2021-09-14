<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
  <div id="report-template">
    <content-block class="do-not-print">
      <h1>{{ $t("title") }}</h1>
      <p>{{ $t("intro") }}</p>

      <report_selection></report_selection>

    </content-block>

    <loading :loading="reports_to_load > 0"></loading>

    <div v-if="reports.length > 0 && reports_to_load === 0">

      <report-tag-filter :urllist_id="reports[0].urllist_id" @tags_applied="apply_tags"/>

      <report_download :report="report" v-for="report in reports" :key="`d${report.id}`"></report_download>

      <sharing-configuration :report="report" v-for="report in reports" :key="`s${report.id}`"></sharing-configuration>

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
import report_mixin from './report_mixin'
import report_mixin_2 from './report_mixin_2'
import report_header from './report_header'
import report_download from './report_download'
import report_selection from "@/components/reports/report_selection";
import {mapState} from 'vuex'
import SharingConfiguration from './SharingConfiguration'
import ReportTagFilter from "@/components/reports/ReportTagFilter";

export default {
  components: {
    ReportTagFilter,
    report_selection,
    ReportCharts,
    ReportTable,
    report_header,
    report_download,
    SharingConfiguration
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
    // only do this when there is no report selection component, otherwise let that component handle it...
    //let router_params = this.$router.history.current.params;
    // the route to this component can determine what is shown
    //this.requested_report_ids = [parseInt(router_params.report), parseInt(router_params.compare_with)].filter(Boolean);
  },
  methods: {
      apply_tags() {
        this.load_reports_by_ids(this.report_ids, this.tags);
      }
  },

  watch: {

    // Report selection control can select a number of reports
    report_ids(report_ids) {
        this.requested_report_ids = report_ids;
    },

    requested_report_ids(report_ids) {
      this.load_reports_by_ids(report_ids);
    },
  },
  computed: {
    report_category() {
      if (this.reports.length > 0)
        return this.reports[0].report_type;
      return ""
    },
    ...mapState(['report_ids', 'tags']),
  }
}
</script>
<i18n>
{
  "en": {
    "settings": "Select visible metrics",
    "title": "Reports",
    "intro": "It is possible to select one or multiple reports. Selecting a single report shows all data of that report, including graphs and a table with detailed results. Selecting two reports, a comparison is made between these reports in the graphs and detailed result. Selecting more than two reports, only graphs are shown."
  },
  "nl": {
    "settings": "Selecteer zichtbare meetwaarden",
    "title": "Rapporten",
    "intro": "Het is mogelijk om meerdere rapporten te selecteren. Bij het selecteren van een enkel rapport wordt alle relevante informatie hierover getoond. Bij het selecteren van twee rapporten wordt een vergelijking gemaakt: zowel in de grafieken als in de detail tabel. Bij het selecteren van meer dan twee rapporten zijn alleen de grafieken zichtbaar."
  }
}
</i18n>