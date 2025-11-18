<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
  <div id="report-template">
    <content-block class="do-not-print">
      <h1>
        <i-bi-file-bar-graph/>
        {{ $t("report.page.title") }}
      </h1>
      <p>{{ $t("report.page.intro") }}</p>

      <report-selection @tags_applied="apply_tags"/>

    </content-block>

    <loading :loading="reports_to_load > 0"></loading>

    <div v-if="reports.length > 0 && reports_to_load === 0">

      <template v-if="!tags_applied">
        <content-block class="do-not-print">
          <b-container>
            <report-download :report="report" v-for="report in shallow_reports" :key="`d${report.id}`"
                             class="mb-2"></report-download>
            <small>{{ $t("report.page.patience") }}</small>
          </b-container>
        </content-block>

        <!-- create a shallow report that can be mutated and does not contain the full data, which saves a lot of memory. -->
        <sharing-configuration
          :report="report" v-for="report in shallow_reports"
          :key="`shared_report_${report.id}`"></sharing-configuration>
      </template>

      <content-block>
        <report-header :reports="shallow_reports"/>
      </content-block>

      <b-tabs variant="info" nav-class="">
        <b-tab :title='$t("report.page.tab_metrics")' lazy>
          <content-block v-if="reports.length < 3" class="start-on-new-page ultra-wide">
            <ReportTableVirtualList :reports="reports" :load_comparison_with_current="!tags_applied"/>
          </content-block>
        </b-tab>


        <b-tab :title='$t("report.page.tab_graphs")' lazy>
          <ReportCharts :reports="reports" :show_timeline="!tags_applied"/>
        </b-tab>

        <b-tab :title='$t("report.page.tab_changes")' lazy>
          <ReportImprovementAndRegressions :report_id="reports[0].id"/>
        </b-tab>

      </b-tabs>
    </div>
  </div>
</template>

<script>
import ReportCharts from '@/components/reports/ReportCharts.vue'

import ReportTableVirtualList from '@/components/reports/ReportTableVirtualList.vue'
import report_mixin from '@/components/reports/report_mixin.vue'
import report_mixin_2 from '@/components/reports/report_mixin_2.vue'
import ReportHeader from '@/components/reports/ReportHeader.vue'
import ReportDownload from '@/components/reports/ReportDownload.vue'
import ReportSelection from "@/components/reports/ReportSelection.vue";
import {mapState} from 'pinia'
import SharingConfiguration from '@/components/reports/SharingConfiguration.vue'
import ReportImprovementAndRegressions from "@/components/reports/ReportImprovementAndRegressions.vue";

import {dashboardStore} from '@/dashboardStore'

export default {
  components: {
    ReportImprovementAndRegressions,
    ReportSelection,
    ReportCharts,

    ReportHeader,
    ReportDownload,
    SharingConfiguration,
    ReportTableVirtualList
  },
  mixins: [report_mixin, report_mixin_2],
  name: 'report',
  data() {
    return {
      // list of report ids that should be shown as a report
      requested_report_ids: [],
      tags_applied: false,
    }
  },

  mounted() {
    this.load_visible_metrics();
    // only do this when there is no report selection component, otherwise let that component handle it...
    const router_params = this.$route.params;
    // the route to this component can determine what is shown
    this.requested_report_ids = [parseInt(router_params.report), parseInt(router_params.compare_with)].filter(Boolean);
  },
  methods: {
    apply_tags() {
      this.tags_applied = this.tags.length > 0;
      this.load_reports_by_ids(this.report_ids, {
        tags: this.tags,
        custom_date: this.ad_hoc_report_custom_date,
        custom_time: this.ad_hoc_report_custom_time
      });
    }
  },

  watch: {

    // Report selection control can select a number of reports
    report_ids(report_ids) {
      this.requested_report_ids = report_ids;
    },

    requested_report_ids(report_ids) {
      this.tags_applied = false;
      this.load_reports_by_ids(report_ids, {});
    },
  },
  computed: {
    report_category() {
      if (this.reports.length > 0)
        return this.reports[0].report_type;
      return ""
    },
    ...mapState(dashboardStore, ['report_ids', 'tags', 'ad_hoc_report_custom_date', 'ad_hoc_report_custom_time']),
  }
}
</script>
