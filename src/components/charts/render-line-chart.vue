<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
  <LineChart :chartData="testData" :height="300" :options="options"><p>{{ $t("accessibility_text") }}</p></LineChart>
</template>

<script>


import {computed, defineComponent, ref} from '@vue/composition-api';
import {LineChart} from 'vue-chart-3';
import 'chartjs-adapter-date-fns';
import {nl} from 'date-fns/locale';

export default defineComponent({
  components: {LineChart},

  props: {
    timeline_data: {type: Array, required: true},
    highlight_report_ids: {type: Array, required: false},
    i18n:  {type: Object, required: false},
  },

  setup(props, {emit}) {
    const chartRef = ref();

    const my_labels = computed(() => {
        let data = [];
        props.timeline_data.forEach((item) => {
          for (let i = 0; i < item.data.length; i++) {
            data.push(item.data[i].date);
          }
        });
        return data;
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

      let datasets = [];
        let colorset = 0;
        props.timeline_data.forEach((item) => {

          let line_data = [];
          item.data.forEach((item_data) => {
            line_data.push({
              x: item_data.date,
              y: item_data.average_internet_nl_score,
              z: item_data.urls,
              is_selected: props.highlight_report_ids.includes(item_data.report),
              report: item_data.report
            })
          });

          let line_dataset =
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
          display: true,
          text: props.i18n.t('title')
        },
      },
      responsive: true,
      maintainAspectRatio: false,
      hover: {
        mode: 'index',
        intersect: false
      },
      scales: {
        x: {
          adapters: {
            date: nl
          },
          type: 'time',
          time: {
            display: true,
            unit: 'month',
            tooltipFormat: 'dd'
          },
          title: {
            display: true,
            text: props.i18n.t('x_axis_label'),
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
            display: true,
            text: props.i18n.t('y_axis_label'),
          },
        }
      }

    }))

    const testData = computed(() => ({
      datasets: my_datasets.value,
      labels: my_labels.value,
      options
    }));

    return {testData, chartRef, options};
  },
})
</script>
