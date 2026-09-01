<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
  <div>
    <Doughnut aria-hidden="true"
        ref="chartRef"
        :data="testData" :height="height" :width="width" :options="options" :plugins="[canvasTextPlugin]"
        :aria-label="accessibleLabel"
        :aria-text="accessibleLabel"
        :aria-description="accessibleLabel"
        :aria-value="accessibleLabel"
        :alt="accessibleLabel"
        :title="accessibleLabel"
    ></Doughnut>
  </div>
</template>

<script>


import {computed, defineComponent, ref} from 'vue';
import {Doughnut} from 'vue-chartjs';
// todo: add date fns again
// import 'chartjs-adapter-date-fns';

const backgroundColors = {
  'pct_ok': "#009E46",
  'pct_low': "#08236B",
  'pct_medium': "#FFAA56",
  'pct_high': "#A71810",
  'internetnlscore': "#05BFD6",
  'score': "#05BFD6",
  'internetnlscore_rest': "#FFAC40",
  'rest': "#FFAC40",
  'clear': "#FFFFFF00",
  'pct_not_applicable': "rgba(41,41,41,0.73)",
  'pct_error_in_test': "rgba(41,41,41,0.73)",
  'pct_not_testable': "rgba(109,109,109,0.8)",
};

function wrapCanvasText(context, text, maxWidth, maxLines = 4) {
  const words = String(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let line = '';

  words.forEach((word) => {
    const candidate = line ? `${line} ${word}` : word;
    if (line && context.measureText(candidate).width > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  });
  if (line) {
    lines.push(line);
  }

  if (lines.length > maxLines) {
    const visibleLines = lines.slice(0, maxLines);
    let lastLine = visibleLines[maxLines - 1];
    while (lastLine && context.measureText(`${lastLine}…`).width > maxWidth) {
      lastLine = lastLine.slice(0, -1);
    }
    visibleLines[maxLines - 1] = `${lastLine}…`;
    return visibleLines;
  }

  return lines;
}


export default defineComponent({
  components: {Doughnut},

  props: {
    donut_data: {type: Object, required: true},
    height: {type: Number, required: false, default: 300},
    width: {type: Number, required: false, default: 300},
    datalabels: {type: Boolean, required: false, default: false},
    tooltip: {type: Boolean, required: false, default: true},
    show_number_in_center: {type: Boolean, required: false, default: true},
    description: {type: String, required: false, default: ''},
    axis: {
      type: Array, required: false, default: () => {
        return [
          'pct_ok',
          'pct_low',
          'pct_medium',
          'pct_high',
          'pct_not_testable',
          'pct_not_applicable',
          'pct_error_in_test',
        ]
      }
    },
    i18n: {type: Object, required: false},
  },

  methods: {
      round_one_decimal(some_value) {
        return Math.round(some_value * 10) / 10
      }
  },

  setup(props, {emit}) {
    const chartRef = ref();

    const my_labels = computed(() => {
      return props.axis;
    })

    const my_datasets = computed(() => {
      const datasets = [];

      const newDataset = {
        backgroundColor: [],
        borderColor: 'transparent',
        borderWidth: 0,
        data: [],
        hoverBorderWidth: 0,
      };

      props.axis.forEach(ax => {

        newDataset.data.push(props.donut_data[ax])
        newDataset.backgroundColor.push(backgroundColors[ax])

      })
      datasets.push(newDataset);

      emit('graph-data-updated', datasets)
      return datasets;
    })

    const options = computed(() => ({
      // there are no interactions on a donut, so remove the links / animation as it confuses screen readers
      events: null,
      animation: false,
      devicePixelRatio: Math.max(window.devicePixelRatio || 1, 2),
      layout: {
        padding: {
          bottom: props.description ? 72 : 0,
        },
      },
      plugins: {

        datalabels: {
          color: "#ffffff",
          display: props.datalabels,
          formatter: function (value) {
            // Needs to be wide enough to show the label.
            if (value < 10)
              return ""
            return Math.round(value) + '%';
          }
        },
        legend: {
          display: false,
          position: "bottom",
        },
        tooltip: {
          mode: 'index',
          enabled: props.tooltip,
          intersect: true,
          callbacks: {
            // https://www.chartjs.org/docs/latest/configuration/tooltip.html#label-callback
            label: function (context) {
              return `${props.i18n.t(context.label)}: ${Math.round(context.parsed * 100) / 100}%`;
            }
          },
          // add the Z axis to the data, is harder, so (n) is unclear...
        },
        title: {
          display: false,
        },
      },
      responsive: true,
      maintainAspectRatio: false,
      hover: {
        mode: 'index',
        intersect: false
      },


    }))

    const testData = computed(() => ({
      datasets: my_datasets.value,
      labels: my_labels.value,
      options
    }));

    const accessibleLabel = computed(() => {
      const score = `${Math.round(Number(props.donut_data[props.axis[0]]) * 10) / 10}%`;
      return props.description
        ? `${props.description}: ${score} positive score.`
        : `Doughnut chart indicating ${score} positive score.`;
    });

    const canvasTextPlugin = {
      id: 'donutCanvasText',
      afterDraw(chart) {
        const {ctx, chartArea} = chart;
        if (!chartArea) {
          return;
        }

        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        if (props.show_number_in_center) {
          const score = Math.round(Number(props.donut_data[props.axis[0]]) * 10) / 10;
          const fontSize = Math.max(12, Math.min(40, chartArea.width * 0.14));
          ctx.fillStyle = backgroundColors[props.axis[0]] || '#000000';
          ctx.font = `700 ${fontSize}px sans-serif`;
          ctx.fillText(`${score}%`, chartArea.left + chartArea.width / 2, chartArea.top + chartArea.height / 2);
        }

        if (props.description) {
          ctx.fillStyle = '#212529';
          ctx.font = '600 12px sans-serif';
          const lines = wrapCanvasText(ctx, props.description, Math.max(80, chart.width - 16));
          const startY = chartArea.bottom + 18;
          lines.forEach((line, index) => {
            ctx.fillText(line, chart.width / 2, startY + index * 14);
          });
        }

        ctx.restore();
      },
    };

    const download = (filename) => {
      const chart = chartRef.value?.chart;
      if (!chart) {
        return;
      }

      const downloadLink = document.createElement('a');
      downloadLink.download = filename || 'donut.png';
      downloadLink.href = chart.toBase64Image('image/png', 1);
      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();
    };

    return {accessibleLabel, canvasTextPlugin, testData, chartRef, options, download};
  },
})
</script>
