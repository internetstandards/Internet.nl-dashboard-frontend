<!-- SPDX-License-Identifier: Apache-2.0 -->
<style scoped>
/* https://stackoverflow.com/questions/20966817/how-to-add-text-inside-the-doughnut-chart-using-chart-js */
.relative {
  position: relative;
}

.absolute-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.text-center {
  text-align: center;
}

.nice-label-0\.5 {
  font-size: 0.0em;
}

.nice-label-1 {
  font-size: 1em;
}
.nice-label-2 {
  font-size: 2em;
}
.nice-label-3 {
  font-size: 2.5em;
}
.nice-label-4 {
  font-size: 2em;
}

.pct_ok {
  color: #009E46;
}

.pct_high {
  color: #A71810;
}

.pct_medium {
  color: #FFAA56;
}

.pct_low {
  color: #08236B;
}

.internetnlscore {
  color: #05BFD6;
}

.score{
  color: black;
  font-weight: bold;
}

.internetnlscore_rest, .rest{
  color: #FFAC40;
}

.clear{
  color: #FFFFFF00;
}

</style>
<template>
  <div class="relative">
    <Doughnut aria-hidden="true"
        :data="testData" :height="height" :width="width" :options="options"
        :aria-label="`Doughnut chart indicating ${donut_data[axis[0]]}% positive score.`"
        :aria-text="`Doughnut chart indicating ${donut_data[axis[0]]}% positive score.`"
        :aria-description="`Doughnut chart indicating ${donut_data[axis[0]]}% positive score.`"
        :aria-value="`Doughnut chart indicating ${donut_data[axis[0]]}% positive score.`"
        :alt="`Doughnut chart indicating ${donut_data[axis[0]]}% positive score.`"
        :title="`Doughnut chart indicating ${donut_data[axis[0]]}% positive score.`"
    ></Doughnut>
    <div class="absolute-center text-center" v-if="show_number_in_center"><span :class="`nice-label-${height/100} ${axis[0]}`">{{round_one_decimal(donut_data[axis[0]])}}%</span></div>
  </div>
</template>

<script>


import {computed, defineComponent, ref} from 'vue';
import {Doughnut} from 'vue-chartjs';
// todo: add date fns again
// import 'chartjs-adapter-date-fns';


export default defineComponent({
  components: {Doughnut},

  props: {
    donut_data: {type: Object, required: true},
    height: {type: Number, required: false, default: 300},
    width: {type: Number, required: false, default: 300},
    datalabels: {type: Boolean, required: false, default: true},
    tooltip: {type: Boolean, required: false, default: true},
    show_number_in_center: {type: Boolean, required: false, default: true},
    axis: {
      type: Array, required: false, default: () => {
        return ['pct_ok', 'pct_high', 'pct_medium', 'pct_low']
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

      const background_colors = {
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

      let datasets = [];

      const newDataset = {
        backgroundColor: [],
        data: [],
      };

      props.axis.forEach(ax => {

        newDataset.data.push(props.donut_data[ax])
        newDataset.backgroundColor.push(background_colors[ax])

      })
      datasets.push(newDataset);

      emit('graph-data-updated', datasets)
      return datasets;
    })

    const options = computed(() => ({
      // there are no interactions on a donut, so remove the links / animation as it confuses screen readers
      events: null,
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

    return {testData, chartRef, options};
  },
})
</script>
