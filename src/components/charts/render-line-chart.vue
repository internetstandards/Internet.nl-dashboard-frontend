<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
  <div class="timeline-chart" :style="{height: chart_height}">
    <line-chart :data="testData" :height="canvas_height" :options="options">
      <p>{{ accessibility_text }}</p>
    </line-chart>
  </div>
</template>

<script lang="ts">


import {computed, defineComponent, ref} from 'vue';
import {Line as LineChart} from 'vue-chartjs';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels,
);

export default defineComponent({
  components: {LineChart},
  emits: ['graph-data-updated', 'report-clicked'],

  props: {
    timeline_data: {type: Array, required: true},
    highlight_report_ids: {type: Array, required: false, default: () => []},
    title: {type: String, required: false, default: ""},
    x_axis_label: {type: String, required: false, default: ""},
    y_axis_label: {type: String, required: false, default: ""},
    accessibility_text: {type: String, required: false, default: ""},
    show_legend: {type: Boolean, required: false, default: true},
    clickable_reports: {type: Boolean, required: false, default: false},
    height: {
      type: [Number, String],
      required: false,
      default: "300px",
      validator: (value) => {
        if (typeof value === "number") {
          return Number.isFinite(value) && value > 0;
        }

        return /^\d+(\.\d+)?px$/.test(value) && Number.parseFloat(value) > 0;
      },
    },
  },

  setup(props, {emit}) {
    const chartRef = ref();
    const chart_height = computed(() => {
      return typeof props.height === "number" ? `${props.height}px` : props.height;
    });
    const canvas_height = computed(() => {
      return typeof props.height === "number" ? props.height : Number.parseFloat(props.height);
    });

    const point_at_event = (event, chart) => {
      const native_event = event.native ?? event;
      return chart.getElementsAtEventForMode(
        native_event,
        'nearest',
        {intersect: true},
        true,
      )[0];
    };

    const tooltip_at_event = (event, chart) => {
      const tooltip = chart.tooltip;
      if (!tooltip || tooltip.opacity === 0) {
        return undefined;
      }

      const is_inside_tooltip = event.x >= tooltip.x
        && event.x <= tooltip.x + tooltip.width
        && event.y >= tooltip.y
        && event.y <= tooltip.y + tooltip.height;

      if (!is_inside_tooltip) {
        return undefined;
      }

      return tooltip.getActiveElements()[0];
    };

    const report_at_event = (event, chart) => {
      const active_element = point_at_event(event, chart) ?? tooltip_at_event(event, chart);
      if (!active_element) {
        return undefined;
      }

      return chart.data.datasets[active_element.datasetIndex]
        ?.data[active_element.index]
        ?.report;
    };

    const my_labels = computed(() => {
        const dates = new Set();
        props.timeline_data.forEach((item) => {
          for (let i = 0; i < item.data.length; i++) {
            dates.add(item.data[i].date);
          }
        });

        return Array.from(dates).sort((left, right) => {
          const left_timestamp = Date.parse(left);
          const right_timestamp = Date.parse(right);

          if (Number.isNaN(left_timestamp) || Number.isNaN(right_timestamp)) {
            return left.localeCompare(right);
          }

          return left_timestamp - right_timestamp;
        });
    })

    const my_datasets = computed(() => {
      /*
      [
        {
          "id": 3,
          "name": "testsites",
          "data": [
            {
              "date": "2020-01-07",
              "urls": 3,
              "average_internet_nl_score": 87.33
            },
            {
              "date": "2020-01-07",
              "urls": 3,
              "average_internet_nl_score": 87.33
            },
            {
              "date": "2020-01-07",
              "urls": 3,
              "average_internet_nl_score": 87.33
            }
          ]
        },
      */

      const color_scheme = [
          {background: 'rgba(21, 66, 115, 1)', border: 'rgba(21, 66, 115, 1)'},
          {background: 'rgba(225, 112, 0, 1)', border: 'rgba(225, 112, 0, 1)'},
          {background: 'rgba(57, 135, 12, 1)', border: 'rgba(57, 135, 12, 1)'},
          {background: 'rgba(115, 21, 66, 1)', border: 'rgba(115, 21, 66, 1)'},
          {background: 'rgb(89, 88, 92)', border: 'rgb(89, 88, 92)'},
          {background: 'rgb(0, 0, 0)', border: 'rgba(0, 0, 0, 1)'},
      ];

      const datasets = [];
        let colorset = 0;
        props.timeline_data.forEach((item) => {

          const line_data = [];
          item.data.forEach((item_data) => {
            line_data.push({
              x: item_data.date,
              y: item_data.average_internet_nl_score,
              z: item_data.urls,
              is_selected: props.highlight_report_ids.includes(item_data.report),
              report: item_data.report
            })
          });

          const line_dataset =
              {
                // Each report has their own set of dates and such, there will be many gaps.
                spanGaps: true,
                label: item.name,
                data: line_data,
                // backgrounds do not work with multiple sets, only lines.
                fill: false,
                backgroundColor: color_scheme[colorset].background,
                borderColor: color_scheme[colorset].background,
                borderWidth: 3,
                lineTension: 0,
              };

          colorset += 1;
          datasets.push(line_dataset);
        });

        emit('graph-data-updated', datasets)
        return datasets;
    })

    const options = computed(() => ({

      plugins: {
        legend: {
          display: props.show_legend,
        },
        datalabels: {
          color: '#262626',
          // setting this to true will look very ugly on the long run. See
          // https://github.com/internetstandards/Internet.nl-dashboard/issues/471
          display: 'auto',
          clamp: true, // always shows the number, also when the number 100%
          anchor: 'end', // show the number at the top of the bar.
          align: 'end', // shows the value outside of the bar,
          // format as a percentage
          formatter: function (value) {
            if (value.is_selected) {
              return `#${value.report}\n${Math.round(value.y)}%`;
            } else {
              // https://github.com/internetstandards/Internet.nl-dashboard/issues/37
              return Math.round(value.y) + '%';
            }
          }
        },
        tooltip: {
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
        },
        title: {
          display: props.title.length > 0,
          text: props.title
        },
      },
      responsive: true,
      maintainAspectRatio: false,
      onHover: (event, _active_elements, chart) => {
        const report = props.clickable_reports ? report_at_event(event, chart) : undefined;
        chart.canvas.style.cursor = report ? 'pointer' : 'default';
      },
      onClick: (event, _active_elements, chart) => {
        if (!props.clickable_reports) {
          return;
        }

        const report = report_at_event(event, chart);
        if (report) {
          emit('report-clicked', report);
        }
      },
      hover: {
        mode: 'index',
        intersect: false
      },
      scales: {
        x: {
          // adapters: {
          //   date: nl
          // },
          // type: 'time',
          // time: {
          //   display: true,
          //   unit: 'month',
          //   tooltipFormat: 'dd'
          // },
          title: {
            display: props.x_axis_label.length > 0 ,
            text: props.x_axis_label,
          }
        },
        y: {
          stacked: false,
          min: 0,
          max: 100,
          ticks: {
            padding: 20,
            stepSize: 10,
            callback: function (label) {
              return label + '%';
            }
          },
          title: {
            display: props.y_axis_label.length > 0,
            text: props.y_axis_label,
          },
        }
      }
    }))

    const testData = computed(() => ({
      datasets: my_datasets.value,
      labels: my_labels.value,
      options
    }));

    return {testData, chartRef, options, chart_height, canvas_height};
  },
})
</script>

<style scoped>
.timeline-chart {
  position: relative;
  width: 100%;
}
</style>
