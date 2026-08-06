<!-- SPDX-License-Identifier: Apache-2.0 -->
<style scoped>
.chart-data-table {
  table-layout: fixed;
}

.chart-data-table th,
.chart-data-table td {
  overflow-wrap: anywhere;
  vertical-align: middle;
}

.chart-data-table__category {
  width: 22%;
}

.chart-data-card__metric {
  align-items: center;
  display: grid;
  gap: 1rem;
  grid-template-columns: minmax(0, 1fr) auto;
  padding: 0.35rem 0.5rem;
}

.chart-data-card__metric:nth-child(odd) {
  background-color: var(--bs-tertiary-bg);
}
</style>

<template>
  <template v-if="hasData">
    <div v-if="showDesktopTable" class="d-none d-lg-block">
      <b-table-simple class="chart-data-table mb-0" striped hover small>
        <b-thead>
          <b-tr>
            <b-th class="chart-data-table__category">
              {{ $t("report.nested-report-charts.category") }}
            </b-th>
            <b-th v-for="dataset in chartData.datasets" :key="dataset.label">
              {{ dataset.label }}
            </b-th>
          </b-tr>
        </b-thead>
        <b-tbody>
          <b-tr v-for="(label, rowIndex) in chartData.labels" :key="`${categoryLabel(label)}-${rowIndex}`">
            <b-td>{{ categoryLabel(label) }}</b-td>
            <b-td v-for="(dataset, datasetIndex) in chartData.datasets" :key="`${rowIndex}-${datasetIndex}`">
              {{ dataset.data[rowIndex] }}%
            </b-td>
          </b-tr>
        </b-tbody>
      </b-table-simple>
    </div>

    <div class="chart-data-cards" :class="{'d-lg-none': showDesktopTable}">
      <b-card
        v-for="(label, rowIndex) in chartData.labels"
        :key="`${categoryLabel(label)}-${rowIndex}`"
        class="chart-data-card mb-2"
        body-class="p-3"
      >
        <h3 class="h6 mb-3">{{ categoryLabel(label) }}</h3>
        <dl class="mb-0">
          <div
            v-for="(dataset, datasetIndex) in chartData.datasets"
            :key="`${rowIndex}-${datasetIndex}`"
            class="chart-data-card__metric"
          >
            <dt class="fw-normal">{{ dataset.label }}</dt>
            <dd class="mb-0 fw-semibold">{{ dataset.data[rowIndex] }}%</dd>
          </div>
        </dl>
      </b-card>
    </div>
  </template>
</template>

<script setup>
import {computed} from 'vue'

const props = defineProps({
  chartData: {type: Object, required: false, default: undefined}
})

const hasData = computed(() => Boolean(props.chartData?.labels?.length && props.chartData?.datasets?.length))
const showDesktopTable = computed(() => props.chartData?.datasets?.length <= 7)

function categoryLabel(label) {
  return Array.isArray(label) ? label[0] : label
}
</script>
