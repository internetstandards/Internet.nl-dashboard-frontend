<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
  <div>
    <canvas ref="canvas" role="img" class="graph-image" :aria-label='$t("chart.percentage-bar-chart.title")'>
      <p>{{ $t("chart.percentage-bar-chart.accessibility_text") }}</p>
    </canvas>
  </div>
</template>
<script>
import chart_mixin from './chart_mixin.vue'
import { dashboardStore } from '@/dashboardStore'
import {mapState} from 'pinia'

export default {
  mixins: [chart_mixin],

  props: {
    chartName: {type: String, required: false, default: ''},
  },

  methods: {
    renderData: function () {

      this.configure_barchart();
      // console.log("Rendering bar chart.");

      // prevent the grapsh from ever growing (it's called twice at first render)
      this.chart.data.axis_names = [];
      this.chart.data.labels = [];
      this.chart.data.datasets = [];

      for (let i = 0; i < this.chart_data.length; i++) {
        // console.log(`Rendering set ${i}`);

        // it's possible the report data is not yet in, but the item in the array has been made.
        // so well:
        if (this.chart_data[i] === undefined)
          return;

        const data = this.chart_data[i].calculation.statistics_per_issue_type;

        if (data === undefined) {
          // nothing to show
          // console.log('nothing to show, probably because not all reports in compare charts are in...');
          this.chart.data.axis_names = [];
          this.chart.data.labels = [];
          this.chart.data.datasets = [];
          this.chart.update();
          return;
        }

        this.shown_values.forEach((shown_value) => {
          const axis_names = [];
          const labels = [];
          const chartdata = [];
          let average = 0;

          this.axis.forEach((ax) => {
            if (ax in data) {
              if (!this.only_show_dynamic_average) {
                labels.push([this.$i18n.t("metric." + ax + ".title"), this.field_name_to_category_names[ax] ? this.field_name_to_category_names[ax] : ""]);
                axis_names.push(ax);
                chartdata.push(data[ax][shown_value]);
              }
              average += parseFloat(data[ax][shown_value]);
            }
          });

          if ((labels.length > 1 && this.show_average) || this.only_show_dynamic_average) {
            // Remove the extra fields, they are never in the first graph. Extra fields categories are enabled
            // automatically if one of the field is selected. And are disabled when none of the fields is selected.
            if (["internet_nl_mail_legacy_category", "internet_nl_web_legacy_category"].includes(this.axis[this.axis.length - 1])) {
              chartdata.push(Math.round((average / (this.axis.length - 1)) * 100) / 100);
            } else {
              chartdata.push(Math.round((average / this.axis.length) * 100) / 100);
            }
            labels.push(this.$i18n.t("chart.percentage-bar-chart.average"));
            axis_names.push("Average");
          }

          this.chart.data.axis_names = axis_names;
          this.chart.data.labels = labels;
          this.chart.data.datasets.push({
            // The stack name has to be pretty unique, even if the list names are the same a comparsion must be made.
            stack: this.chart_data[i].id,
            data: chartdata,
            backgroundColor: this.background_colors[shown_value],
            borderWidth: 0,
            lineTension: 0,
            hidden: shown_value === "pct_high",
            label: this.chart_data.length > 1 ? `#${this.chart_data[i].id}: ${this.$i18n.t("metric.rating." + shown_value)}` : `${this.$i18n.t("metric.rating." + shown_value)}`,
            // ${this.chart_data[i].calculation.name} ${moment(this.chart_data[i].at_when).format('LL')} n=${this.chart_data[i].total_urls}
          });
        });
      }
      if (this.rendered_chart_to_table === undefined) {
        this.rendered_chart_to_table = {}
      }
      this.rendered_chart_to_table[this.chartName] = this.chart.data;
      // causes too much recursion
      // this.chart.update();
    },
    renderTitle: function () {
      this.chart.options.plugins.title.text = this.title;
    },
  },
  computed: {
    title: function () {
      if (this.chart_data.length === 1)
        return this.report_titles[0]

      return this.report_titles.join(" vs ");
    },
    ...mapState(dashboardStore, ['rendered_chart_to_table']),
  }
}
</script>
