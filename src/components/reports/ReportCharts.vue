<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
  <div>
    <a class="anchor" name="charts"></a>
    <content-block v-if="show_timeline">
      <timeline :urllist_ids="report_urllist_ids" :highlight_report_ids="$store.state.report_ids" :report_type="reports[0].report_type"></timeline>
    </content-block>

    <content-block class="start-on-new-page" v-if='reports.length > 0'>
      <h2>{{ $t("adoption_circle_chart.title") }}</h2>
      <applied-tags/>

      <donuts :reports="reports"></donuts>

    </content-block>

    <content-block class="start-on-new-page"  v-if='reports.length > 0'>
      <h2>{{ $t("adoption_bar_chart.title") }}</h2>
      <p>{{ $t("adoption_bar_chart.intro") }}</p>
      <applied-tags/>
      <nested-report-charts component="percentage-bar-chart" :reports="reports"></nested-report-charts>
    </content-block>

    <content-block class="start-on-new-page"  v-if='reports.length > 1'>
      <h2>{{ $t("cumulative_adoption_bar_chart.title") }}</h2>
      <p>{{ $t("cumulative_adoption_bar_chart.intro") }}</p>
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
<i18n>
{
  "en": {
    "how_charts_work": "By clicking on legend labels, it's possible to toggle certain categories. The 'failed' category is disabled by default and can be enabled by clicking on it.",
    "cumulative_adoption_bar_chart": {
      "title": "Adoption of standards over multiple reports",
      "intro": "This graph shows the average adoption per standard averaged over multiple reports."
    },
    "adoption_bar_chart": {
      "title": "Adoption of standards per category",
      "intro": "This graph shows the average adoption per standard per report."
    },
    "adoption_circle_chart": {
      "title": "Adoption of standards"
    }
  },
  "nl": {
    "how_charts_work": "Door te klikken op de leganda in deze grafieken, kunnen beoordelingen worden getoond en verborgen. De 'gezakt' categorie wordt standaard altijd verborgen.",
    "cumulative_adoption_bar_chart": {
      "title": "Adoptie van standaarden, rapporten opgeteld",
      "intro": "In deze grafiek worden de geselecteerde rapporten bij elkaar opgeteld, en daar het gemiddelde van getoond."
    },
    "adoption_bar_chart": {
      "title": "Adoptie van standaarden per categorie",
      "intro": "Deze grafiek toont het percentage adoptie per categorie en onderliggende metingen."
    },
    "adoption_circle_chart": {
      "title": "Adoptie van standaarden"
    }
  }
}
</i18n>
