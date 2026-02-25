<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
  <div class="trend-chart-container">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<script>
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Legend,
  Tooltip
} from 'chart.js'

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Title, Legend, Tooltip)

export default {
  name: 'ActionTrendChart',
  components: { Line },
  props: {
    labels: {
      type: Array,
      default: () => []
    },
    values: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const chartData = computed(() => ({
      labels: props.labels,
      datasets: [
        {
          label: 'Amount',
          data: props.values,
          borderColor: 'rgba(21, 66, 115, 1)',
          backgroundColor: 'rgba(21, 66, 115, 0.2)',
          pointRadius: 2,
          pointHoverRadius: 4,
          borderWidth: 2,
          tension: 0.2,
          fill: false
        }
      ]
    }))

    const chartOptions = computed(() => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: Boolean(props.title),
          text: props.title
        },
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Year/Month'
          }
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Amount'
          }
        }
      }
    }))

    return { chartData, chartOptions }
  }
}
</script>

<style scoped>
.trend-chart-container {
  position: relative;
  width: 100%;
  height: clamp(240px, 38vh, 250px);
  max-height: 500px;
}
</style>
