<!-- SPDX-License-Identifier: Apache-2.0 -->
<!-- eslint-disable vue/valid-v-slot -->
<template>
  <VApp class="report-table-v2">
    <div>
      <h2>{{ $t('report.report-table-virtual-list.report.title') }}</h2>
      <a class="anchor" name="report"></a>

      <AppliedTags />
      <p v-if="load_comparison_with_current">
        {{ $t('report.report-table-virtual-list.report.intro') }}
      </p>
      <DifferencesToCurrentList
        v-if="load_comparison_with_current"
        :report_id="reports[0].id"
      />

      <details class="report-table-v2__legend do-not-print">
        <summary>{{ $t('report.report-table-virtual-list.icon_legend.title') }}</summary>
        <div class="report-table-v2__legend-items">
          <span v-for="entry in legendEntries" :key="entry.verdict" class="report-table-v2__legend-item">
            <ReportMetricCell :label="entry.label" :metric="entry.metric" />
            {{ entry.label }}
          </span>
        </div>
      </details>

      <div class="report-table-v2__toolbar do-not-print">
        <form class="report-table-v2__search" role="search" @submit.prevent>
          <label class="visually-hidden" for="report-table-url-filter">
            {{ $t('report.report-table-virtual-list.report.url_filter') }}
          </label>
          <div class="input-group">
            <span class="input-group-text" aria-hidden="true"><i-bi-search /></span>
            <input
              id="report-table-url-filter"
              v-model="search"
              autocomplete="off"
              class="form-control"
              :placeholder="$t('report.report-table-virtual-list.report.url_filter')"
              type="search"
            />
          </div>
        </form>

        <div class="report-table-v2__group-picker">
          <p id="metric-group-explanation" class="visually-hidden">
            {{ $t('report.report-table-virtual-list.report.zoom.explanation') }}
          </p>
          <VBtnToggle
            v-model="selectedGroup"
            mandatory
            density="compact"
            color="primary"
            variant="outlined"
            aria-describedby="metric-group-explanation"
          >
            <VBtn value="overview">
              {{ $t('report.report-table-virtual-list.report.zoom.overview') }}
            </VBtn>
            <VBtn v-for="group in metricGroups" :key="group.key" :value="group.key">
              {{ group.label }}
            </VBtn>
          </VBtnToggle>
        </div>
      </div>

      <p v-if="selectedMetricGroup" class="small text-body-secondary mb-2">
        {{ $t('report.report-table-virtual-list.report.zoom.zoomed_in_on') }}
        {{ selectedMetricGroup.label }}
      </p>

      <VDataTableVirtual
        v-model:sort-by="sortBy"
        class="report-table-v2__table"
        density="compact"
        fixed-header
        hover
        :filter-keys="['url']"
        :headers="tableHeaders"
        height="70vh"
        item-value="url"
        :items="tableRows"
        :mobile="false"
        :search="normalizedSearch"
      >
        <template
          v-for="metric in metricColumns"
          :key="`header-${metric.key}`"
          #[`header.${metric.key}`]="{sortBy: currentSort}"
        >
          <span class="report-table-v2__diagonal-label">
            <span aria-hidden="true">{{ sortIndicator(currentSort, metric.key) }}</span>
            <span>{{ metric.title }}</span>
          </span>
        </template>

        <template #item.score="{item}">
          <a
            v-if="item.reportUrl"
            class="report-table-v2__score"
            :href="item.reportUrl"
            target="_blank"
            rel="noopener"
            :title="scoreTooltip(item)"
          >
            <img src="/static_frontend/images/vendor/internet_nl/favicon.png" alt="" />
            {{ item.score }}%
            <img
              v-if="item.scoreComparison"
              class="report-table-v2__score-change"
              :src="comparisonIcon(item.scoreComparison)"
              alt=""
            />
            <span v-if="item.scoreComparison" class="visually-hidden">
              {{ $t(`report.virtual-list-record.results.comparison.${item.scoreComparison}`) }}
            </span>
            <span class="visually-hidden">
              {{ $t('report.virtual-list-record.link_to_report', {url: item.url}) }}
            </span>
          </a>
          <span v-else>–</span>
        </template>

        <template #item.url="{item}">
          <div class="report-table-v2__domain" :title="item.url">{{ item.url }}</div>
          <small v-if="!item.eligible" class="text-body-secondary">
            {{ $t('report.virtual-list-record.not_eligeble_for_scanning') }}
          </small>
        </template>

        <template
          v-for="metric in metricColumns"
          :key="`cell-${metric.key}`"
          #[`item.${metric.key}`]="{item}"
        >
          <ReportMetricCell :label="metric.title" :metric="item.metrics[metric.key]" />
        </template>

        <template #no-data>
          <div class="pa-4 text-center">
            {{ $t('report.report-table-virtual-list.report.empty_report') }}
          </div>
        </template>
      </VDataTableVirtual>
    </div>
  </VApp>
</template>

<script lang="ts">
import {mapState} from 'pinia'
import type {PropType} from 'vue'
import {VApp, VBtn, VBtnToggle, VDataTableVirtual} from 'vuetify/components'
import AppliedTags from '@/components/reports/AppliedTags.vue'
import DifferencesToCurrentList from '@/components/reports/DifferencesToCurrentList.vue'
import ReportMetricCell from '@/components/reports/ReportMetricCell.vue'
import reportMixin from '@/components/reports/report_mixin.vue'
import {dashboardStore} from '@/dashboardStore'
import {
  buildReportTableRows,
  type ReportMetric,
  type ReportPayload,
  type ReportTableRow,
  type ReportUrlRecord,
} from '@/components/reports/reportTableModel'

type ScanField = {
  groupLabel?: string
  name: string
}

type ScanSubcategory = {
  fields?: ScanField[]
  label: string
}

type ScanCategory = {
  categories?: ScanSubcategory[]
  fields?: ScanField[]
  key: string
  label: string
}

type ScanMethod = {
  categories?: ScanCategory[]
  name: string
}

type MetricGroup = {
  detailFields: ScanField[]
  key: string
  label: string
  overviewFields: ScanField[]
}

type TableMetricColumn = {
  groupLabel: string
  key: string
  overview: boolean
  title: string
}

type SortEntry = {
  key: string
  order?: 'asc' | 'desc' | false
}

type LegendEntry = {
  label: string
  metric: ReportMetric
  verdict: string
}

export default {
  name: 'ReportTableVirtualListV2',
  components: {
    AppliedTags,
    DifferencesToCurrentList,
    ReportMetricCell,
    VApp,
    VBtn,
    VBtnToggle,
    VDataTableVirtual,
  },
  mixins: [reportMixin],
  props: {
    reports: {type: Array as PropType<ReportPayload[]>, required: true},
    load_comparison_with_current: {type: Boolean, default: true},
  },
  data() {
    return {
      search: '',
      selectedGroup: 'overview',
      sortBy: [{key: 'url', order: 'asc'}],
    }
  },
  computed: {
    reportCategory(): string {
      return this.reports?.[0]?.report_type || ''
    },
    scanMethod(): ScanMethod | undefined {
      return (this.scan_methods as ScanMethod[]).find((method) => method.name === this.reportCategory)
    },
    metricGroups(): MetricGroup[] {
      return (this.scanMethod?.categories || []).map((category) => ({
        detailFields: (category.categories || []).flatMap((subcategory) =>
          (subcategory.fields || []).map((field) => ({
            ...field,
            groupLabel: subcategory.label,
          })),
        ),
        key: category.key,
        label: category.label,
        overviewFields: category.fields || [],
      }))
    },
    selectedMetricGroup(): MetricGroup | undefined {
      return this.metricGroups.find((group) => group.key === this.selectedGroup)
    },
    metricColumns(): TableMetricColumn[] {
      const overview = !this.selectedMetricGroup
      const fields = this.selectedMetricGroup
        ? this.selectedMetricGroup.detailFields
        : this.metricGroups.flatMap((group) =>
          group.overviewFields.map((field) => ({...field, groupLabel: group.label})),
        )

      const visibility = this.visible_metrics as Record<string, {visible?: boolean}>

      return fields
        .filter((field) => visibility[field.name]?.visible !== false)
        .map((field) => ({
          groupLabel: field.groupLabel || '',
          key: field.name,
          overview,
          title: String(this.$t(`metric.${field.name}.title`)),
        }))
    },
    tableHeaders(): Array<Record<string, unknown>> {
      return [
        {
          align: 'start',
          cellProps: {class: 'report-table-v2__score-cell'},
          fixed: true,
          headerProps: {class: 'report-table-v2__score-header'},
          key: 'score',
          maxWidth: 88,
          minWidth: 88,
          sortable: true,
          title: this.$t('report.report-table-virtual-list.score'),
          width: 88,
        },
        {
          cellProps: {class: 'report-table-v2__domain-cell'},
          fixed: true,
          headerProps: {class: 'report-table-v2__domain-header'},
          key: 'url',
          maxWidth: 220,
          minWidth: 220,
          sortable: true,
          title: this.$t('report.report-table-virtual-list.domain'),
          width: 220,
        },
        ...this.metricColumns.map((metric, index) => ({
          align: 'start',
          cellProps: {class: 'report-table-v2__metric-cell'},
          headerProps: {
            class: 'report-table-v2__metric-header',
            style: {zIndex: String(1000 - index)},
          },
          key: metric.key,
          maxWidth: 64,
          minWidth: 64,
          sortable: true,
          title: metric.title,
          width: 64,
        })),
        {
          cellProps: {class: 'report-table-v2__spacer-cell'},
          headerProps: {class: 'report-table-v2__spacer-header'},
          key: 'table-spacer',
          maxWidth: 192,
          minWidth: 192,
          sortable: false,
          title: '',
          width: 192,
        },
      ]
    },
    tableRows(): ReportTableRow[] {
      const currentReport = this.reports?.[0]
      const previousReport = this.reports?.[1]
      const previousByUrl = previousReport?.calculation?.urls_by_url || Object.fromEntries(
        (previousReport?.calculation?.urls || []).map((record) => [record.url, record]),
      ) as Record<string, ReportUrlRecord>
      return buildReportTableRows(
        currentReport?.calculation?.urls || [],
        previousByUrl,
        this.metricColumns,
      )
    },
    normalizedSearch(): string {
      return String(this.search || '').toLowerCase()
    },
    legendEntries(): LegendEntry[] {
      return ['passed', 'failed', 'warning', 'info', 'unknown'].map((verdict, index) => ({
        label: String(this.$t(`report.virtual-list-record.results.${verdict}`)),
        metric: {comparison: '', evidence: '', overview: false, sortValue: 5 - index, verdict},
        verdict,
      }))
    },
    ...mapState(dashboardStore, ['visible_metrics']),
  },
  watch: {
    reportCategory() {
      this.selectedGroup = 'overview'
    },
  },
  methods: {
    comparisonIcon(comparison: 'improved' | 'regressed'): string {
      return `/static_frontend/images/report_comparison_${comparison}.png`
    },
    scoreTooltip(item: ReportTableRow): string {
      return item.scoreSince
        ? `${this.$t('report.virtual-list-record.since')}: ${this.humanize_date_unix_timestamp(item.scoreSince)}`
        : ''
    },
    sortIndicator(sortBy: SortEntry[], key: string): string {
      const sort = sortBy.find((entry) => entry.key === key)
      return sort?.order === 'asc' ? '↑' : sort?.order === 'desc' ? '↓' : ''
    },
  },
}
</script>

<style scoped>
.report-table-v2.v-application {
  min-height: 0;
  background: transparent;
  color: inherit;
  font-family: inherit;
}

.report-table-v2 :deep(.v-application__wrap) {
  min-height: 0;
}

.report-table-v2__legend {
  margin-bottom: 1rem;
}

.report-table-v2__legend summary {
  width: fit-content;
  cursor: pointer;
  color: var(--bs-link-color);
}

.report-table-v2__legend-items {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.25rem;
  padding: 0.75rem 0;
}

.report-table-v2__legend-item {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.report-table-v2__toolbar {
  display: grid;
  grid-template-columns: minmax(14rem, 20rem) minmax(0, 1fr);
  align-items: start;
  gap: 1rem;
  margin-bottom: 1rem;
}

.report-table-v2__search {
  width: 100%;
}

.report-table-v2__group-picker {
  display: flex;
  justify-content: flex-end;
  min-width: 0;
  padding-bottom: 0.15rem;
}

.report-table-v2__group-picker :deep(.v-btn-toggle) {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  width: auto;
  max-width: 100%;
  height: auto !important;
  gap: 0.35rem;
  overflow: visible;
  background: transparent;
}

.report-table-v2__group-picker :deep(.v-btn) {
  flex: 0 0 auto;
  max-width: 100%;
  min-width: 0;
  height: auto !important;
  min-height: var(--v-btn-height);
  border: 1px solid currentColor !important;
  border-radius: var(--bs-border-radius) !important;
}

.report-table-v2__group-picker :deep(.v-btn__content) {
  padding-block: 0.25rem;
  white-space: normal;
  text-align: right;
  line-height: 1.2;
}

.report-table-v2__table {
  border: 1px solid var(--bs-border-color);
  border-radius: var(--bs-border-radius);
}

.report-table-v2__table :deep(table) {
  width: max-content !important;
  min-width: max-content !important;
  border-collapse: separate;
  border-spacing: 0;
  table-layout: fixed;
}

.report-table-v2__table :deep(thead),
.report-table-v2__table :deep(thead tr),
.report-table-v2__table :deep(thead th) {
  overflow: visible !important;
}

.report-table-v2__table :deep(.report-table-v2__metric-header) {
  position: relative;
  width: 4rem !important;
  min-width: 4rem !important;
  max-width: 4rem !important;
  height: 18rem !important;
  padding: 0 !important;
  overflow: visible !important;
  vertical-align: bottom !important;
}

.report-table-v2__table :deep(.report-table-v2__metric-header .v-data-table-header__content) {
  height: 100%;
  overflow: visible !important;
}

.report-table-v2__table :deep(.report-table-v2__score-header),
.report-table-v2__table :deep(.report-table-v2__domain-header) {
  height: 18rem !important;
  padding-bottom: 0.75rem !important;
  vertical-align: bottom !important;
}

.report-table-v2__table :deep(.report-table-v2__score-header .v-data-table-header__content),
.report-table-v2__table :deep(.report-table-v2__domain-header .v-data-table-header__content) {
  height: 100%;
  align-items: flex-end;
}

.report-table-v2__diagonal-label {
  position: absolute;
  bottom: 0.75rem;
  left: 1.6rem;
  display: flex;
  width: max-content;
  max-width: none;
  gap: 0.3rem;
  transform: rotate(-48deg);
  transform-origin: bottom left;
  white-space: nowrap;
  text-align: left;
  font-size: 0.78rem;
  font-weight: 600;
  line-height: 1.15;
}

.report-table-v2__table :deep(.report-table-v2__metric-cell) {
  width: 4rem !important;
  min-width: 4rem !important;
  max-width: 4rem !important;
  padding-left: 0.75rem !important;
  text-align: left;
}

.report-table-v2__table :deep(.report-table-v2__score-header),
.report-table-v2__table :deep(.report-table-v2__score-cell) {
  width: 5.5rem !important;
  min-width: 5.5rem !important;
  max-width: 5.5rem !important;
}

.report-table-v2__table :deep(.report-table-v2__domain-header),
.report-table-v2__table :deep(.report-table-v2__domain-cell) {
  width: 13.75rem !important;
  min-width: 13.75rem !important;
  max-width: 13.75rem !important;
}

.report-table-v2__table :deep(.report-table-v2__spacer-header),
.report-table-v2__table :deep(.report-table-v2__spacer-cell) {
  width: 12rem !important;
  min-width: 12rem !important;
  max-width: 12rem !important;
}

.report-table-v2__score {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  white-space: nowrap;
}

.report-table-v2__score > img:first-child {
  width: 1rem;
  height: 1rem;
}

.report-table-v2__score .report-table-v2__score-change {
  width: 1rem;
  height: 1rem;
  object-fit: contain;
}

.report-table-v2__domain {
  max-width: 13rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 767.98px) {
  .report-table-v2__toolbar {
    grid-template-columns: minmax(0, 1fr);
  }

  .report-table-v2__group-picker,
  .report-table-v2__group-picker :deep(.v-btn-toggle) {
    justify-content: flex-end;
  }
}

@media print {
  .report-table-v2__table {
    height: auto !important;
  }
}
</style>
