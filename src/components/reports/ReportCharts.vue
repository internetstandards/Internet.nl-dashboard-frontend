<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
  <div>
    <a class="anchor" name="charts"></a>
    <content-block v-if="show_timeline">
      <timeline :urllist_ids="report_urllist_ids" :highlight_report_ids="$store.state.report_ids" :report_type="reports[0].report_type"></timeline>
    </content-block>

    <content-block class="start-on-new-page" v-if='reports.length > 0'>
      <h2>{{ $t("report.report-charts.adoption_circle_chart.title") }}</h2>
      <applied-tags/>

      <donuts :reports="reports"></donuts>

    </content-block>

    <content-block class="start-on-new-page"  v-if='reports.length > 0'>
      <h2>{{ $t("report.report-charts.adoption_bar_chart.title") }}</h2>
      <p>{{ $t("report.report-charts.adoption_bar_chart.intro") }}</p>
      <applied-tags/>
      <nested-report-charts component="percentage-bar-chart" :reports="reports"></nested-report-charts>
    </content-block>

    <content-block class="start-on-new-page"  v-if='reports.length > 1'>
      <h2>{{ $t("report.report-charts.cumulative_adoption_bar_chart.title") }}</h2>
      <p>{{ $t("report.report-charts.cumulative_adoption_bar_chart.intro") }}</p>
      <applied-tags/>

      <nested-report-charts component="cumulative-percentage-bar-chart" :reports="reports"></nested-report-charts>

    </content-block>
  </div>

</template>

<script>
import Timeline from "@/components/charts/timeline";
import NestedReportCharts from "@/components/reports/NestedReportCharts";
import Donuts from "@/components/charts/donuts";
import AppliedTags from "@/components/reports/AppliedTags";

export default {
  components: {
    AppliedTags,
    Donuts,
    Timeline,
    NestedReportCharts
  },

  props: {
    reports: {type: Array, required: true},
    show_timeline: {type: Boolean, required: false, default: true},
  },

  computed: {
    report_urllist_ids() {
      return this.reports.map(report => report.urllist_id);
    },
  }
}
</script>
