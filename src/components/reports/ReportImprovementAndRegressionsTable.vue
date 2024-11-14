<template>
  <b-table :items="items" :fields="fields" fixed responsive striped >
    <template #cell(url)="data">
      {{ data.item.url }}<br>
      {{$t("report.improvement-regressions-table.score_from")}} <a :href="data.item.old.report" target="_blank">{{ data.item.old.score }}%</a> {{$t("report.improvement-regressions-table.score_to")}} <a
        :href="data.item.new.report" target="_blank">{{ data.item.new.score }}%</a><br>

      {{$t("report.improvement-regressions-table.metrics")}}
      <img src="/static_frontend/images/report_comparison_improved.png"> {{ data.item.changes.improvement }} &nbsp;
      <img src="/static_frontend/images/report_comparison_regressed.png"> {{ data.item.changes.regression }} &nbsp;
      • {{ data.item.changes.neutral }}<br>

    </template>

    <template #cell(changes.improvement)="data">
      <ul>
        <li v-for="metric in data.item.changes.improved_metrics" :key="metric">{{ $t("metric." + metric + ".title") }}</li>
      </ul>
    </template>

    <template #cell(changes.regression)="data">
      <ul>
        <li v-for="metric in data.item.changes.regressed_metrics" :key="metric">{{ $t("metric." + metric + ".title") }}</li>
      </ul>
    </template>

  </b-table>
</template>

<script>
export default {
  name: "ReportImprovementAndRegressionsTable",
  props: {
    items: {
      type: Array,
      required: true
    },
  },
  data() {
    return {
      fields: [
        {key: 'url', label: this.$i18n.t("report.improvement-regressions-table.url"), sortable: true},
        {key: 'changes.improvement', label: this.$i18n.t("report.improvement-regressions-table.improvement"), sortable: true},
        {key: 'changes.regression', label: this.$i18n.t("report.improvement-regressions-table.regression"), sortable: true},
      ]
    }
  }
}
</script>
