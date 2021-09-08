<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
  <div>
    <canvas ref="canvas" role="img" class="graph-image" :aria-label="title">
      <p>{{ $t("accessibility_text") }}</p>
    </canvas>
  </div>
</template>

<script>
import chart_mixin from './chart_mixin.vue'

export default {
    mixins: [chart_mixin],
    methods: {
        renderData: function () {
            this.configure_barchart();
            // prevent the grapsh from ever growing (it's called twice at first render)
            this.chart.data.axis_names = [];
            this.chart.data.labels = [];
            this.chart.data.datasets = [];

            let cumulative_axis_data = {};

            if (this.chart_data === undefined)
                return;

            if (this.chart_data[0] === undefined)
                return;

            for (let i = 0; i < this.chart_data.length; i++) {

                // it's possible the report data is not yet in, but the item in the array has been made.
                // so well:
                if (this.chart_data[i] === undefined)
                    return;

                if (this.chart_data[i].calculation === undefined)
                    return;

                let data = this.chart_data[i].calculation.statistics_per_issue_type;

                if (data === undefined) {
                    // nothing to show
                    this.chart.data.axis_names = [];
                    this.chart.data.labels = [];
                    this.chart.data.datasets = [];
                    this.chart.update();
                    return;
                }

                this.axis.forEach((ax) => {
                    if (ax in data) {
                        if (!Object.keys(cumulative_axis_data).includes(ax)) {
                            cumulative_axis_data[ax] = {
                                pct_ok: 0, pct_low: 0, pct_medium: 0, pct_high: 0,
                                pct_not_applicable: 0, pct_not_testable: 0, pct_error_in_test: 0
                            }
                        }
                        cumulative_axis_data[ax].pct_ok += data[ax].pct_ok;
                        cumulative_axis_data[ax].pct_low += data[ax].pct_low;
                        cumulative_axis_data[ax].pct_medium += data[ax].pct_medium;
                        cumulative_axis_data[ax].pct_high += data[ax].pct_high;
                        cumulative_axis_data[ax].pct_not_applicable += data[ax].pct_not_applicable;
                        cumulative_axis_data[ax].pct_not_testable += data[ax].pct_not_testable;
                        cumulative_axis_data[ax].pct_error_in_test += data[ax].pct_error_in_test;
                    }
                });
            }
            this.shown_values.forEach((shown_value) => {
                let data = this.chart_data[0].calculation.statistics_per_issue_type;
                let axis_names = [];
                let labels = [];
                let chartdata = [];
                let average = 0;

                this.axis.forEach((ax) => {
                    if (ax in data) {
                        if (!this.only_show_dynamic_average) {
                            labels.push([this.$i18n.t(ax), this.field_name_to_category_names[ax] ? this.field_name_to_category_names[ax] : ""]);
                            axis_names.push(ax);
                            chartdata.push((Math.round(cumulative_axis_data[ax][shown_value] / this.chart_data.length * 100)) / 100);
                        }
                        // toFixed delivers some 81.32429999999999 results, which is total nonsense.
                        average += (Math.round(cumulative_axis_data[ax][shown_value] / this.chart_data.length * 100)) / 100;
                    }
                });

                // add the average of all these to the report, not as a line, but as an additional bar
                if ((labels.length > 1 && this.show_average) || this.only_show_dynamic_average) {
                    // Remove the extra fields, they are never in the first graph. Extra fields categories are enabled
                    // automatically if one of the field is selected. And are disabled when none of the fields is selected.
                    if (["mail_legacy", "web_legacy"].includes(this.axis[this.axis.length - 1])) {
                        chartdata.push(Math.round((average / (this.axis.length - 1)) * 100) / 100);
                    } else {
                        chartdata.push(Math.round((average / this.axis.length) * 100) / 100);
                    }
                    labels.push(this.$i18n.t('average'));
                    axis_names.push("Average");
                }

                this.chart.data.axis_names = axis_names;
                this.chart.data.labels = labels;
                this.chart.data.datasets.push({
                    stack: 1,
                    data: chartdata,
                    backgroundColor: this.background_colors[shown_value],
                    borderWidth: 0,
                    lineTension: 0,
                    hidden: shown_value === "pct_high",
                    label: `${this.$i18n.t(shown_value)}`,
                });

            });

            this.chart.update();
        },
        renderTitle: function () {
            this.chart.options.plugins.title.text = this.title;
        },
    },
  computed: {
    title() {
      if (this.chart_data.length === 1)
        return this.report_titles[0]

      return `(${this.report_titles.join(" + ")}) / ${this.chart_data.length}`
    },
  }

}
</script>
<i18n>
{
  "en": {
    "title": "Average adoption of standards over %{number_of_reports} reports.",
    "yAxis_label": "Adoption",
    "average": "Average",
    "accessibility_text": "A table with the content of this graph is shown below."
  },
  "nl": {
    "title": "Gemiddelde adoptie van standaarden van %{number_of_reports} rapporten.",
    "yAxis_label": "Adoptiegraad",
    "average": "Gemiddeld",
    "accessibility_text": "Een tabel met de inhoud van deze grafiek wordt hieronder getoond."
  }
}
</i18n>
