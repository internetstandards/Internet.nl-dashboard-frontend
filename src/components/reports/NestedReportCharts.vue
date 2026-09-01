<!-- SPDX-License-Identifier: Apache-2.0 -->
<style scoped>
.report-chart__canvas {
  height: clamp(320px, 75vw, 480px);
  min-width: 0;
  position: relative;
  width: 100%;
}

.donut-layout {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}

.donut-layout__item {
  flex: 1 1 100%;
  max-width: 300px;
  min-width: 0;
}

@media (min-width: 576px) {
  .donut-layout__item {
    flex-basis: 260px;
  }
}

@media (min-width: 992px) {
  .report-chart__canvas {
    height: 480px;
  }
}

@media (min-width: 1200px) {
  .donut-layout__item {
    flex-basis: 165px;
  }
}
</style>
<template>
  <div>
    <b-form-group
      :label="$t('report.nested-report-charts.category')"
      class="mb-4"
    >
      <b-form-select
        v-model="selected_chart_key"
        :options="chart_options"
      />
    </b-form-group>

    <div v-if="selected_chart && !show_as_donuts" class="report-chart not-on-new-page">
      <!-- Do not show canvas chart element in accessibility, use the table below -->
      <div class="report-chart__canvas">
        <component
          :is="my_component"
          class="h-100"
          :chart_data="reports"
          :show_average="show_chart_averages"
          :axis="selected_chart.axis"
          :chart-name="selected_chart_store_key"
          aria-hidden="true"
          ref="selected_chart_component"
        />
      </div>
      <div class="d-flex justify-content-end mt-2 mb-3 d-print-none">
        <b-button variant="secondary" size="sm" @click="download_selected_chart">
          <i-bi-download aria-hidden="true" />
          {{ $t('report.nested-report-charts.download_graph') }}
        </b-button>
      </div>
      <chart-data-table :chart-data="rendered_chart_to_table[selected_chart_store_key]"/>
    </div>

    <div v-if="selected_chart && show_as_donuts" class="not-on-new-page">
      <section v-for="report in reports" :key="report.id" class="mb-4">
        <h3 v-if="reports.length > 1" class="h5 mb-3">
          #{{ report.id }} - {{ report.urllist_name }}
        </h3>
        <div class="donut-layout">
          <div
            v-for="metric in donut_metrics_for_report(report)"
            :key="metric"
            class="donut-layout__item"
          >
            <donut
              :ref="donut_ref_name(report, metric)"
              :data="report.calculation.statistics_per_issue_type[metric]"
              :datalabels="false"
              :elements="['donut', 'subtitle']"
              :height="300"
              :title="metric"
              :tooltip="false"
            />
            <div class="text-center mt-2 d-print-none">
              <b-button variant="secondary" size="sm" @click="download_donut(report, metric)">
                <i-bi-download aria-hidden="true" />
                {{ $t('report.nested-report-charts.download_graph') }}
              </b-button>
            </div>
          </div>
        </div>
      </section>
    </div>

    <div v-if="selected_chart" class="mt-3">
      <b-form-checkbox v-model="show_as_donuts" switch>
        {{ $t('report.nested-report-charts.show_as_donuts') }}
      </b-form-checkbox>
      <b-form-checkbox v-if="!show_as_donuts" v-model="show_chart_averages" switch>
        {{ $t('report.nested-report-charts.show_averages') }}
      </b-form-checkbox>
    </div>
  </div>
</template>

<script>
import CumulativePercentageBarChart from './../charts/render-cumulative-percentage-bar-chart.vue'
import PercentageBarChart from './../charts/render-percentage-bar-chart.vue'
import ChartDataTable from '@/components/charts/ChartDataTable.vue'
import Donut from '@/components/charts/donut.vue'
import report_mixin from "@/components/reports/report_mixin.vue";
import VisibleFields from "@/components/reports/VisibleFields.vue";
import { dashboardStore } from '@/dashboardStore'
import {mapState, mapWritableState} from 'pinia'

export default {
  mixins: [report_mixin, VisibleFields],

  name: "NestedReportCharts.vue",
  components: {
    CumulativePercentageBarChart,
    PercentageBarChart,
    ChartDataTable,
    Donut,
  },

  props: {
    component: {type: String, required: true},
    reports: {type: Array, required: true}
  },

  data() {
    return {
      selected_chart_key: 'overall',
      show_as_donuts: false,
    }
  },

  computed: {
    my_component() {
      return this.component === 'percentage-bar-chart' ? PercentageBarChart : CumulativePercentageBarChart
    },

    charts_to_render() {
      const charts = [];

      this.scan_methods.forEach((scan_form) => {
        // make web axis-charts for web and mail axis charts for mail.
        if (scan_form.name !== this.reports[0].report_type)
          return

        charts.push({
          'key': 'overall',
          'axis': this.visible_fields_from_scan_form(scan_form),
          'level': 1,
          'label': scan_form.label
        });
        // The first nesting deals with categories
        scan_form.categories.forEach((category) => {
          charts.push({
            'key': `category:${category.key}`,
            'axis': this.visible_fields_from_categories(category),
            'level': 2,
            'label': category.label
          });
          category.categories.forEach((subcategory) => {

            // The DNSSEC subcategory has the same fields as the category, adding an additional chart is useless.
            // So if the fields from the parent match the child, don't add the graph for it.
            // Same goes for http security options. The category already shows all (albeit with a different label).
            if (this.visible_fields_from_categories(category).join("") !== this.fields_from_self(subcategory).join(""))
              charts.push({
                'key': `subcategory:${subcategory.key}`,
                'axis': this.fields_from_self(subcategory),
                'level': 3,
                'label': subcategory.label
              });

            // Special chart for forum standaardisatie that cannot have fields disabled:
            // if (['category_mail_forum_standardisation_magazine', 'category_web_forum_standardisation_magazine'].includes(subcategory.key))
            //   charts.push({
            //     'axis': this.fields_from_self_and_do_not_filter(subcategory),
            //     'level': 3,
            //     'label': 'This shows the average for Forum Standardisation, it is not possible to show the average or to select what fields should be visible.'
            //   });

          })
        })
      });

      // remove all charts that do not have any axis, as that would result in an empty chart.
      return charts.filter(chart => chart.axis.length > 0);
    },
    chart_options() {
      return this.charts_to_render.map((chart) => ({
        value: chart.key,
        text: `${'\u00a0\u00a0'.repeat(chart.level - 1)}${chart.label}`,
      }))
    },
    selected_chart() {
      return this.charts_to_render.find((chart) => chart.key === this.selected_chart_key)
        ?? this.charts_to_render[0]
        ?? null
    },
    selected_chart_store_key() {
      return this.selected_chart ? `${this.component}:${this.selected_chart.key}` : ''
    },
    ...mapState(dashboardStore, ['rendered_chart_to_table']),
    ...mapWritableState(dashboardStore, ['show_chart_averages']),
  },

  watch: {
    charts_to_render(charts) {
      if (!charts.some((chart) => chart.key === this.selected_chart_key)) {
        this.selected_chart_key = charts[0]?.key ?? null
      }
    },
  },

  methods: {
    filename_part(value) {
      return String(value ?? '')
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .toLowerCase()
        .slice(0, 80)
    },
    download_date() {
      const today = new Date()
      const month = String(today.getMonth() + 1).padStart(2, '0')
      const day = String(today.getDate()).padStart(2, '0')
      return `${today.getFullYear()}-${month}-${day}`
    },
    download_selected_chart() {
      const reportName = this.reports
        .map((report) => `${report.urllist_name || 'report'}-${report.id}`)
        .join('-vs-')
      const chartType = this.component === 'percentage-bar-chart'
        ? this.$t('report.report-charts.adoption_bar_chart.title')
        : this.$t('report.report-charts.cumulative_adoption_bar_chart.title')
      const filenameParts = [
        reportName,
        chartType,
        this.selected_chart?.label,
        this.download_date(),
      ].map(this.filename_part).filter(Boolean)

      this.$refs.selected_chart_component?.download('png', `${filenameParts.join('_')}.png`)
    },
    donut_metrics_for_report(report) {
      const statistics = report.calculation?.statistics_per_issue_type ?? {}
      return (this.selected_chart?.axis ?? []).filter((metric) => statistics[metric])
    },
    donut_ref_name(report, metric) {
      return `donut:${report.id}:${metric}`
    },
    download_donut(report, metric) {
      const ref = this.$refs[this.donut_ref_name(report, metric)]
      const donut = Array.isArray(ref) ? ref[0] : ref
      const filenameParts = [
        `${report.urllist_name || 'report'}-${report.id}`,
        'donut',
        this.$t(`metric.${metric}.title`),
        this.download_date(),
      ].map(this.filename_part).filter(Boolean)

      donut?.download(`${filenameParts.join('_')}.png`)
    },
  }
}
</script>
