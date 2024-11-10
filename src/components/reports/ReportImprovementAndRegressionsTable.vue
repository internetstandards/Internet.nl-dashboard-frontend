<template>
  <b-table :items="items" :fields="fields" fixed responsive striped >
    <template #cell(url)="data">
      {{ data.item.url }}<br>
      {{$t("score_from")}} <a :href="data.item.old.report" target="_blank">{{ data.item.old.score }}%</a> {{$t("score_to")}} <a
        :href="data.item.new.report" target="_blank">{{ data.item.new.score }}%</a><br>

      {{$t("metrics")}}
      <img src="/static_frontend/images/report_comparison_improved.png"> {{ data.item.changes.improvement }} &nbsp;
      <img src="/static_frontend/images/report_comparison_regressed.png"> {{ data.item.changes.regression }} &nbsp;
      • {{ data.item.changes.neutral }}<br>

    </template>

    <template #cell(changes.improvement)="data">
      <ul>
        <li v-for="metric in data.item.changes.improved_metrics" :key="metric">{{ $t(metric) }}</li>
      </ul>
    </template>

    <template #cell(changes.regression)="data">
      <ul>
        <li v-for="metric in data.item.changes.regressed_metrics" :key="metric">{{ $t(metric) }}</li>
      </ul>
    </template>

  </b-table>
</template>

<script>
import field_translations from '../FieldTranslations'

export default {
  i18n: {
    sharedMessages: field_translations,
  },
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
        {key: 'url', label: this.$i18n.t("url"), sortable: true},
        {key: 'changes.improvement', label: this.$i18n.t("improvement"), sortable: true},
        {key: 'changes.regression', label: this.$i18n.t("regression"), sortable: true},
      ]
    }
  }
}
</script>

<style scoped>

</style>
<i18n>
{
  "en": {
    "improvement": "Improvements",
    "regression": "Regressions",
    "url": "Domain",
    "metrics": "Metrics",
    "score_from": "Score from",
    "score_to": "to"
  },
  "nl": {
    "improvement": "Verbeteringen",
    "regression": "Verslechteringen",
    "url": "Domein",
    "metrics": "Metingen",
    "score_from": "Score van",
    "score_to": "naar"
  }
}
</i18n>