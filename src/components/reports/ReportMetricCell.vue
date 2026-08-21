<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
  <VTooltip location="top" max-width="32rem">
    <template #activator="{props: tooltipProps}">
      <span
        v-bind="tooltipProps"
        class="metric-result"
        :aria-label="accessibleLabel"
      >
        <img class="metric-result__status" :src="statusIcon" alt="" />
        <img
          v-if="metric.comparison === 'improved' || metric.comparison === 'regressed'"
          class="metric-result__comparison"
          :src="comparisonIcon"
          alt=""
        />
      </span>
    </template>

    <div class="metric-tooltip">
      <strong>{{ label }}</strong>
      <div>{{ statusLabel }}</div>
      <div v-if="metric.comparison">
        {{ $t(`report.virtual-list-record.results.comparison.${metric.comparison}`) }}
      </div>
      <div v-if="metric.since">
        {{ $t('report.virtual-list-record.since') }}: {{ humanize_date_unix_timestamp(metric.since) }}
      </div>
      <template v-if="metric.evidence">
        <div>{{ $t('report.virtual-list-record.evidence') }}:</div>
        <pre>{{ metric.evidence }}</pre>
      </template>
    </div>
  </VTooltip>
</template>

<script lang="ts">
import {VTooltip} from 'vuetify/components'
import type {PropType} from 'vue'
import type {ReportMetric} from '@/components/reports/reportTableModel'

export default {
  name: 'ReportMetricCell',
  components: {VTooltip},
  props: {
    label: {type: String, required: true},
    metric: {type: Object as PropType<ReportMetric>, required: true},
  },
  computed: {
    accessibleLabel(): string {
      const comparison = this.metric.comparison
        ? `, ${this.$t(`report.virtual-list-record.results.comparison.${this.metric.comparison}`)}`
        : ''
      return `${this.label}: ${this.statusLabel}${comparison}`
    },
    statusLabel(): string {
      const key = `report.virtual-list-record.results.${this.metric.verdict}`
      return this.$te(key) ? String(this.$t(key)) : this.metric.verdict.replaceAll('_', ' ')
    },
    comparisonIcon(): string {
      return `/static_frontend/images/report_comparison_${this.metric.comparison}.png`
    },
    statusIcon(): string {
      const icons = this.metric.overview
        ? {
            passed: 'icon-circle-check.svg',
            failed: 'icon-circle-error.svg',
            warning: 'icon-circle-warning.svg',
            info: 'icon-info.svg',
            unknown: 'icon-circle-check.svg',
            error: 'probe-error.svg',
            error_in_test: 'probe-error.svg',
          }
        : {
            passed: 'li-shield-ok.svg',
            failed: 'icon-error.svg',
            warning: 'icon-warning.svg',
            info: 'icon-info.svg',
            good_not_tested: 'icon-not-tested-question-mark.svg',
            error: 'icon-not-tested-bolt.svg',
            error_in_test: 'icon-not-tested-bolt.svg',
            not_testable: 'icon-not-tested-bolt.svg',
            unreachable: 'icon-not-tested-bolt.svg',
            untestable: 'icon-not-tested-bolt.svg',
            not_applicable: 'icon-not-tested.svg',
            not_tested: 'icon-not-tested.svg',
            no_mx: 'icon-not-tested.svg',
            unknown: 'icon-not-tested.svg',
          }
      const icon = (icons as Record<string, string>)[this.metric.verdict] || 'icon-not-tested.svg'
      return `/static_frontend/images/vendor/internet_nl/${icon}`
    },
  },
}
</script>

<style scoped>
.metric-result {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  line-height: 1;
}

.metric-result__status {
  width: 2rem;
  height: 2rem;
  object-fit: contain;
}

.metric-result__comparison {
  position: absolute;
  right: -0.65rem;
  top: -0.35rem;
  width: 1.1rem;
  height: 1.1rem;
  object-fit: contain;
}

.metric-tooltip pre {
  max-width: min(28rem, 80vw);
  max-height: 15rem;
  margin: 0.35rem 0 0;
  overflow: auto;
  white-space: pre-wrap;
  color: inherit;
  font: 0.75rem/1.35 monospace;
}
</style>
