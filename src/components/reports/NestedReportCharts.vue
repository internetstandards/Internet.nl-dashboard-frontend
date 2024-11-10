<!-- SPDX-License-Identifier: Apache-2.0 -->
<style scoped>
.fixed_ratio {
  min-width: 950px;
}
</style>
<template>
  <div>
    <template v-for="chart in charts_to_render">
      <div v-if="chart.level === 1" :key="chart.axis.join('.') + 'a'">
        <div class="chart-container w-100 position-relative fixed_ratio">
          <!-- Do not show canvas chart element in accessibility, use the table below -->
          <component :is="my_component" :chart_data="reports" :show_average="chart.average" :axis="chart.axis"
                     chart-name="overall" aria-hidden="true"/>
          <b-table-simple striped hover small responsive v-if="$store.state.rendered_chart_to_table['overall'] !== undefined">
            <b-thead>
              <b-tr>
                <b-th>{{ $t("category") }}</b-th>
                <b-th v-for="xAxis in $store.state.rendered_chart_to_table['overall']['datasets']" :key="xAxis.label + 'f'">
                  {{ $t(xAxis.label) }}
                </b-th>
              </b-tr>
            </b-thead>
            <b-tbody>

              <b-tr v-for="(yAxis, yIndex) in $store.state.rendered_chart_to_table['overall']['labels']"
                    :key="yAxis[0] + 'g'">
                <b-td style="width: 20%">
                  {{ $t(yAxis[0]) }}
                </b-td>
                <b-td v-for="(value, index) in $store.state.rendered_chart_to_table['overall']['datasets']"
                      :key="`${yIndex}${index}h`">
                  {{ value["data"][yIndex] }}%
                </b-td>
              </b-tr>
            </b-tbody>
          </b-table-simple>

        </div>
      </div>
      <div v-else class="not-on-new-page" :key="chart.axis.join('.') + 'b'">
        <chart-collapse-panel :title="chart.label" :level="chart.level">
          <!-- Do not show canvas chart element in accessibility, use the table below -->
          <div slot="chart_content">
          <component :is="my_component"  :chart_data="reports" :show_average="chart.average"
                     :only_show_dynamic_average="chart.only_average" :axis="chart.axis" :chart-name="chart.label"
                     aria-hidden="true"/>
          <b-table-simple striped hover small responsive v-if="$store.state.rendered_chart_to_table[chart.label] !== undefined">
            <b-thead>
              <b-tr>
                <b-th></b-th>
                <b-th v-for="xAxis in $store.state.rendered_chart_to_table[chart.label]['datasets']" :key="xAxis.label + 'c'">
                  {{ $t(xAxis.label) }}
                </b-th>
              </b-tr>
            </b-thead>
            <b-tbody>
              <!-- There is a slight challenge making unique keys for ths row. Some axis might be the same per category or so. Fix this with a random number -->
              <b-tr v-for="(yAxis, yIndex) in $store.state.rendered_chart_to_table[chart.label]['labels']"
                    :key="yAxis[0] + Math.floor(Math.random() * 100000000)">
                <b-td style="width: 20%">
                  {{ $t(yAxis[0]) }}
                </b-td>
                <b-td v-for="(value, index) in $store.state.rendered_chart_to_table[chart.label]['datasets']"
                      :key="`${yIndex}${index}e`">
                  {{ value["data"][yIndex] }}%
                </b-td>
              </b-tr>
            </b-tbody>
          </b-table-simple>

          </div>

        </chart-collapse-panel>
      </div>
    </template>
  </div>
</template>

<script>
import CumulativePercentageBarChart from './../charts/render-cumulative-percentage-bar-chart'
import PercentageBarChart from './../charts/render-percentage-bar-chart'
import ChartCollapsePanel from '@/components/charts/ChartCollapsePanel'
import report_mixin from "@/components/reports/report_mixin";
import VisibleFields from "@/components/reports/VisibleFields";
import CollapsePanel from '@/components/CollapsePanel'

export default {
  mixins: [report_mixin, VisibleFields, CollapsePanel],

  name: "NestedReportCharts.vue",
  components: {
    CumulativePercentageBarChart,
    PercentageBarChart,
    ChartCollapsePanel,
  },

  props: {
    component: {type: String, required: true},
    reports: {type: Array, required: true}
  },

  computed: {
    my_component() {
      return this.component === 'percentage-bar-chart' ? PercentageBarChart : CumulativePercentageBarChart
    },

    charts_to_render() {
      // Seperates nesting logic and other complexities from actual rending of the chart. Here it is specified what
      // charts need to be rendered, and the UI will just render all those charts according to specification in the
      // same order.
      let charts = [];

      this.scan_methods.forEach((scan_form) => {
        // make web axis-charts for web and mail axis charts for mail.
        if (scan_form.name !== this.reports[0].report_type)
          return
        charts.push({
          'average': this.show_average(scan_form.name),
          'only_average': false,
          'axis': this.visible_fields_from_scan_form(scan_form),
          'level': 1,
          'label': ''
        });
        // The first nesting deals with categories
        scan_form.categories.forEach((category) => {
          charts.push({
            'average': this.show_average(category.key),
            'only_average': false,
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
                'average': this.show_average(subcategory.key),
                'only_average': false,
                'axis': this.fields_from_self(subcategory),
                'level': 3,
                'label': subcategory.label
              });

            // Special chart for forum standaardisatie that cannot have fields disabled:
            // if (['category_mail_forum_standardisation_magazine', 'category_web_forum_standardisation_magazine'].includes(subcategory.key))
            //   charts.push({
            //     'average': true,
            //     'only_average': true,
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
  }
}
</script>
<i18n>
{
  "en": {
    "category": "Category",
    "A": "Average"
  },
  "nl": {
    "category": "Categorie",
    "G": "Gemiddelde"
  }
}
</i18n>