<script>
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import chart_mixin from './chart_mixin.vue'

// this prevents the legend being written over the 100% scores
Chart.Legend.prototype.afterFit = function () {
    this.height = this.height + 20;
};

export default {
    mixins: [chart_mixin],
    plugins: [ChartDataLabels],
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


            let shown_values = ['pct_ok', 'pct_low', 'pct_medium', 'pct_high', 'pct_not_testable', 'pct_not_applicable', 'pct_error_in_test'];
            let background_colors = {
                'pct_ok': "#009E46",
                'pct_low': "#08236B",
                'pct_medium': "#FFAA56",
                'pct_high': "#A71810",

                'pct_not_applicable': "rgba(41,41,41,0.73)",
                'pct_error_in_test': "rgba(41,41,41,0.73)",
                'pct_not_testable': "rgba(109,109,109,0.8)",
            };

            shown_values.forEach((shown_value) => {

                let data = this.chart_data[0].calculation.statistics_per_issue_type;
                let axis_names = [];
                let labels = [];
                let chartdata = [];
                let average = 0;


                this.axis.forEach((ax) => {
                    if (ax in data) {
                        if (!this.only_show_dynamic_average) {
                            labels.push([this.$i18n.t(ax), this.field_name_to_category_names ? this.field_name_to_category_names[ax] : ""]);
                            axis_names.push(ax);
                            chartdata.push((Math.round(cumulative_axis_data[ax][shown_value] / this.chart_data.length * 100)) / 100);
                        }
                        // toFixed delivers some 81.32429999999999 results, which is total nonsense.
                        average += (Math.round(cumulative_axis_data[ax][shown_value] / this.chart_data.length * 100)) / 100;
                    }
                });


                // add the average of all these to the report, not as a line, but as an additional bar
                if ((labels.length > 1 && this.show_dynamic_average) || this.only_show_dynamic_average) {
                    if (['internet_nl_web_ipv6', 'internet_nl_web_dnssec', 'internet_nl_web_tls', 'internet_nl_web_appsecpriv',
                        'internet_nl_mail_dashboard_ipv6', 'internet_nl_mail_dashboard_dnssec', 'internet_nl_mail_dashboard_auth',
                        'internet_nl_mail_dashboard_tls'].includes(this.axis[0])) {
                        chartdata.push(Math.round((average / (this.axis.length - 1)) * 100) / 100);
                    } else {
                        chartdata.push(Math.round((average / this.axis.length) * 100) / 100);
                    }
                    labels.push(this.$i18n.t(this.translation_key + '.average'));
                    axis_names.push("Average");
                }

                this.chart.data.axis_names = axis_names;
                this.chart.data.labels = labels;
                this.chart.data.datasets.push({
                    stack: 1,
                    data: chartdata,
                    backgroundColor: background_colors[shown_value],
                    borderWidth: 0,
                    lineTension: 0,
                    hidden: shown_value === "pct_high",
                    label: `${this.$i18n.t(shown_value)}`,
                });

            });

            this.chart.update();
        },
        renderTitle: function () {
            this.chart.options.title.text = this.title;
        },
    }
}
</script>
