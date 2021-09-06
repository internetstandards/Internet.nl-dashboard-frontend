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

.nice-label {
  font-size: 3em;
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


</style>
<template>
  <div class="relative">
    <DoughnutChart :chartData="testData" :height="300" :options="options"></DoughnutChart>
    <div class="absolute-center text-center"><span :class="'nice-label ' +  axis[0]">{{donut_data[axis[0]]}}%</span></div>
  </div>
</template>

<script>


import {computed, defineComponent, ref} from '@vue/composition-api';
import {DoughnutChart} from 'vue-chart-3';
import 'chartjs-adapter-date-fns';


export default defineComponent({
  components: {DoughnutChart},

  props: {
    donut_data: {type: Object, required: true},
    axis: {
      type: Array, required: false, default: () => {
        return ['pct_ok', 'pct_high', 'pct_medium', 'pct_low']
      }
    },
    i18n: {type: Object, required: false},
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

      plugins: {

        datalabels: {
          color: "#ffffff",
          display: true,
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
