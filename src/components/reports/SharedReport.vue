<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
  <div id="report-template">

    <content-block class="do-not-print">
        <h1>{{ $t("report.shared-report.title") }}</h1>
        <p>{{ $t("report.shared-report.intro") }}</p>
    </content-block>

    <content-block v-if="reports_to_load > 0">
        <loading :loading="reports_to_load > 0"></loading>
    </content-block>

    <content-block v-if="reports.length === 0 && reports_to_load === 0">
      <h2>{{$t("report.shared-report.not_found.title")}}</h2>
      <b-alert variant="danger" show >
        {{$t("report.shared-report.not_found.content")}}
      </b-alert>
    </content-block>

    <div v-if="reports.length > 0 && reports_to_load === 0">

      <template v-if="reports_require_authentication">
        <ReportPasswords :reports="shallow_reports" @retry="retry"></ReportPasswords>
      </template>
      <template v-else>
        <content-block>
          <report-header :show_application_links="false" :reports="shallow_reports"/>
        </content-block>

        <ReportCharts :show_timeline="false" :reports="reports"/>

        <!-- The table can show up to two reports (the first as the source, the second as a comparison). -->
        <content-block v-if="reports.length < 3" class="start-on-new-page">
          <ReportTableVirtualList :reports="reports" :load_comparison_with_current="false"/>
        </content-block>
      </template>
    </div>

  </div>
</template>

<script>
import ReportCharts from './ReportCharts'
import ReportPasswords from './ReportPasswords'
import report_mixin from './report_mixin'
import report_mixin_2 from './report_mixin_2'
import ReportHeader from './ReportHeader'
import ReportTableVirtualList from "@/components/reports/ReportTableVirtualList";


export default {
  components: {
    ReportTableVirtualList,
    ReportCharts,
    ReportPasswords,
    ReportHeader,
  },
  mixins: [report_mixin, report_mixin_2],
  name: 'SharedReport',

  props: {
    // list of report ids that should be shown as a report
    requested_report_ids: {type: Array, required: true},
  },

  mounted() {
    this.load_visible_metrics();
  },

  methods: {
    retry() {
      this.load_shared_reports_by_ids(this.requested_report_ids);
    }
  },

  watch: {
    requested_report_ids(report_ids) {
      this.load_shared_reports_by_ids(report_ids);
    },
  },

  computed: {
    reports_require_authentication() {
      for (let i = 0; i < this.reports.length; i++) {
        if (this.reports[i].authentication_required === true)
          return true
      }
      return false
    },

  }
}
</script>
