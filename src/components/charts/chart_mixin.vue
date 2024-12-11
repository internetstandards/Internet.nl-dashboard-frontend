<!-- SPDX-License-Identifier: Apache-2.0 -->
<script>
import debounce from "debounce";
import ChartDataLabels from 'chartjs-plugin-datalabels';

import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  DoughnutController,
  ArcElement,
  Legend,
  CategoryScale,
  BarController,
  BarElement,
  Tooltip,
  TimeScale,
} from 'chart.js';

Chart.register(LineController, LineElement, PointElement, LinearScale, Title, DoughnutController, ArcElement, Legend, CategoryScale, ChartDataLabels, BarController, BarElement, Tooltip, TimeScale);



// for field_name_to_category_names
import report_mixin from "@/components/reports/report_mixin.vue";

// this prevents the legend being written over the 100% scores
// Legend.prototype.afterFit = function() {
//     this.height = this.height + 40;
// };

let tooltip_configuration = {
  mode: 'index',
  intersect: false,
  callbacks: {
    // https://www.chartjs.org/docs/latest/configuration/tooltip.html#label-callback
    label: function (context) {
      let label = context.dataset.label || '';

      if (label)
        label += ': ';

      label += Math.round(context.parsed.y * 100) / 100;
      return label + "%";
    }
  },
  // add the Z axis to the data, is harder, so (n) is unclear...
}

import { dashboardStore } from '@/dashboardStore'

export default {
  mixins: [report_mixin],
  props: {
    chart_data: {type: Array, required: true},
    axis: {type: Array, required: false},
    show_average: {type: Boolean, required: false},
    only_show_dynamic_average: {type: Boolean, required: false},
  },
  data: function () {
    return {
      store: dashboardStore(),
      chart: undefined,

      // some bar chart settings
      shown_values: ['pct_ok', 'pct_low', 'pct_medium', 'pct_high', 'pct_not_testable', 'pct_not_applicable', 'pct_error_in_test'],
      background_colors: {
        'pct_ok': "#009E46",
        'pct_low': "#08236B",
        'pct_medium': "#FFAA56",
        'pct_high': "#A71810",

        'pct_not_applicable': "rgba(41,41,41,0.73)",
        'pct_error_in_test': "rgba(41,41,41,0.73)",
        'pct_not_testable': "rgba(109,109,109,0.8)",
      },
    }
  },
  mounted: function () {
    this.issue_filters = this.store.visible_metrics;
    this.renderData();
  },
  methods: {

    download(file_type){
      let data = ""
      if (file_type === "png")
        data = this.chart.toBase64Image();
      if (file_type === "jpg")
        data = this.chart.toBase64Image('image/jpeg', 1)
      let aDownloadLink = document.createElement('a');
      aDownloadLink.download = `graph.${file_type}`
      aDownloadLink.href = data;
      aDownloadLink.click();
    },

    arraysEqual(a, b) {
      // One does not simply array1 === array2, which is a missed opportunity, as (some of the) the most optimized implementation should ship to anyone.
      if (a === b) return true;
      if (a == null || b == null) return false;

      // intended type coercion
      if (a.length != b.length) return false;

      // If you don't care about the order of the elements inside
      // the array, you should sort both arrays here.
      // Please note that calling sort on an array will modify that array.
      // you might want to clone your array first.

      for (let i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
      }
      return true;
    },

    configure_barchart: function () {

      if (this.chart !== undefined) {
        return;
      }

      let context = this.$refs.canvas.getContext('2d');
      this.chart = new Chart(context, {
        type: 'bar',
        data: {},
        options: {

          // can prevent data falling off the chart.
          layout: {
            padding: {
              left: 0,
              right: 0,
              top: 0,
              bottom: 0
            }
          },
          plugins: {
            datalabels: {
              color: '#ffffff',
              clamp: true, // always shows the number, also when the number 100%
              anchor: 'center', // show the number at the top of the bar.
              align: 'center', // shows the value outside of the bar,
              font: {
                weight: 'bold'
              },
              display: function (context) {
                let index = context.dataIndex;
                let value = context.dataset.data[index];
                return Math.round(value) > 1;
              },
              // format as a percentage
              formatter: function (value) {
                // https://github.com/internetstandards/Internet.nl-dashboard/issues/37
                return Math.round(value) + '%';
              }
            },
            tooltip: tooltip_configuration,
            title: {
              position: 'top',
              display: true,
              text: this.title,
            },
          },
          legend: {
            display: true,
            position: 'top',
            labels: {
              padding: 15,
              filter: function (item, data) {
                // Only shows legend labels for data types that are actually available
                // dataset 0 = good, dataset 1 is info etc...
                let dsIndex = item.datasetIndex;
                let currentDataValue = data.datasets[dsIndex].data.reduce((a, b) => a + b, 0);
                return currentDataValue > 0;
              },
            },

          },
          responsive: true,
          // setting this to false will not show the charts in collapse panels. See
          // https://github.com/chartjs/Chart.js/issues/762
          maintainAspectRatio: true,


          hover: {
            mode: 'nearest',
            intersect: true
          },
          // this is now a percentage graph.
          scales: {
            y: {
              min: 0,
              max: 100,
              ticks: {
                stepSize: 10,
                callback: function (label) {
                  return label + '%';
                }
              },
              title: {
                display: true,
                // todo: fix this label over multiple components, probably by using less abstraction...
                labelString: this.$i18n.t("yAxis_label")
              },
            }
          },
        }
      });
    },
    change_on_difference(new_value, old_value) {
      if (!this.arraysEqual(old_value, new_value)) {
        this.renderData();
      }
    }
  },
  created() {
    // When the chart data is downloaded, it might be that a ton of stuff is processed. To prevent
    // too many renders, we slow the chart building a bit by debouncing it.
    // This also prevents some of the "me.getDatasetMeta(...).controller is null" errors in charts.js (nov 2019)
    // You cannot add a debounce on a watch:
    // https://stackoverflow.com/questions/47172952/vuejs-2-debounce-not-working-on-a-watch-option
    this.unwatch = this.$watch('chart_data', debounce(() => {
      this.renderData();
    }, 500), {
      // Note that you don’t need to do so to listen for in-Array mutations as they won't happen and the
      // arrays are too complex and big.
      deep: false
    })
  },
  computed: {
    locale() {
      return this.$i18n.locale;
    },
    report_titles() {
      if (this.chart_data === undefined)
        return [];

      return this.chart_data.map(report => `📊 #${report.id}: ${report.urllist_name} ${this.humanize_date_date_only(report.at_when)} n=${report.total_urls}`)
    },
  },
  watch: {
    locale: function () {
      this.renderTitle();
    },
    // todo: try replace with: axis: this.change_on_difference,
    axis: function (new_value, old_value) {
      this.change_on_difference(new_value, old_value);
    },
    show_average: function () {
      this.renderData();
    },
    only_show_dynamic_average: function () {
      this.renderData();
    },
    title: function (new_value, old_value) {
      this.change_on_difference(new_value, old_value);
    },
  }
};
</script>
