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

        let data = this.chart_data[i].calculation.statistics_per_issue_type;

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
          let axis_names = [];
          let labels = [];
          let chartdata = [];
          let average = 0;

          this.axis.forEach((ax) => {
            if (ax in data) {
              if (!this.only_show_dynamic_average) {
                labels.push([this.$i18n.t(ax), this.field_name_to_category_names ? this.field_name_to_category_names[ax] : ""]);
                axis_names.push(ax);
                chartdata.push(data[ax][shown_value]);
              }
              average += parseFloat(data[ax][shown_value]);
            }
          });

          // add the average of all these to the report, not as a line, but as an additional bar
          if ((labels.length > 1 && this.show_average) || this.only_show_dynamic_average) {
            // the extra fields are never in the first graph. If we recognize the first graph, then
            // deduct 1 axis.length
            if (['internet_nl_web_ipv6', 'internet_nl_web_dnssec', 'internet_nl_web_tls', 'internet_nl_web_appsecpriv',
              'internet_nl_mail_dashboard_ipv6', 'internet_nl_mail_dashboard_dnssec', 'internet_nl_mail_dashboard_auth',
              'internet_nl_mail_dashboard_tls'].includes(this.axis[0])) {

              // todo: but only if one of the legacy fields is enabled... This is bug #280

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
            // The stack name has to be pretty unique, even if the list names are the same a comparsion must be made.
            stack: this.chart_data[i].id,
            data: chartdata,
            backgroundColor: this.background_colors[shown_value],
            borderWidth: 0,
            lineTension: 0,
            hidden: shown_value === "pct_high",
            label: `#${this.chart_data[i].id}: ${this.$i18n.t(shown_value)}`,
            // ${this.chart_data[i].calculation.name} ${moment(this.chart_data[i].at_when).format('LL')} n=${this.chart_data[i].total_urls}
          });
        });
      }
      this.chart.update();
    },
    renderTitle: function () {
      this.chart.options.title.text = this.title;
    },
  },
  computed: {
    title: function () {
      if (this.chart_data.length === 1)
        return this.report_titles[0]

      return this.report_titles.join(" vs ");

    },

  }

}
</script>
<i18n>
{
  "en": {
    "title_single": "Average adoption of standards, %{list_information}, %{number_of_domains} domains.",
    "title_multiple": "Comparison of adoption of standards between %{number_of_reports} reports.",
    "yAxis_label": "Adoption",
    "average": "Average",
    "accessibility_text": "A table with the content of this graph is shown below."
  },
  "nl": {
    "title_single": "Adoptie van standaarden, %{list_information}, %{number_of_domains} domeinen.",
    "title_multiple": "Vergelijking adoptie van standaarden tussen %{number_of_reports} rapporten.",
    "yAxis_label": "Adoptiegraad",
    "average": "Gemiddeld",
    "accessibility_text": "Een tabel met de inhoud van deze grafiek wordt hieronder getoond."
  }
}
</i18n>
