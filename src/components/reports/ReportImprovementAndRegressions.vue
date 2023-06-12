<template>
  <content-block v-if="!comparison.previous_report_available">
    <loading :loading="loading"/>
    Er zijn geen gegevens beschikbaar van het vorige rapport.
  </content-block>
  <content-block v-else>
    <loading :loading="loading"/>
    <p>Het vorige rapport werd {{comparison.days_between_current_and_previous_report}} dagen geleden gemaakt.</p>
    <p>Overzicht van wijzigingen in meetresultaten ten opzichte van het vorige rapport:</p>
    <ul>
      <li>{{comparison.improvement}} Verbeteringen</li>
      <li>{{comparison.regression}} Verslechteringen</li>
      <li>{{comparison.neutral}} Ongewijzigd</li>
    </ul>

    <div v-if="comparison.domains_exclusive_in_current_report.length">
      Domeinen exclusief in het huidige rapport: {{comparison.domains_exclusive_in_current_report}}
    </div>
    <div v-if="comparison.domains_exclusive_in_other_report.length">
      Domeinen exlcusief in het vorige rapport: {{comparison.domains_exclusive_in_other_report}}
    </div>

    <b-tabs v-if="comparison.comparison_table_improvement.length || comparison.comparison_table_regression.length">
      <b-tab title="Verbeteringen" v-if="comparison.comparison_table_improvement.length">
        {{comparison.comparison_table_improvement}}
        <ReportImprovementAndRegressionsTable :items="comparison.comparison_table_improvement"/>
      </b-tab>
      <b-tab title="Verslechteringen" v-if="comparison.comparison_table_regression.length">
        <ReportImprovementAndRegressionsTable :items="comparison.comparison_table_regression"/>
        {{comparison.comparison_table_regression}}
      </b-tab>
    </b-tabs>

  </content-block>
</template>

<script>
import http from "@/httpclient";
import ReportImprovementAndRegressionsTable from "@/components/reports/ReportImprovementAndRegressionsTable";

export default {
  name: "ReportImprovementAndRegressions",
  components: {ReportImprovementAndRegressionsTable},
  props: {
    report_id: {
      type: Number,
      required: true
    }
  },
  mounted() {
    this.load();
  },
  data() {
    return {
      loading: false,
      comparison: {
        "previous_report_available": false,
        "previous_report_average_internet_nl_score": 0,
        "current_report_average_internet_nl_score": 0,
        "compared_report_id": 0,
        "comparison_is_empty": true,
        "improvement": 0,
        "regression": 0,
        "neutral": 0,
        "comparison_report_available": false,
        "comparison_report_contains_improvement": false,
        "comparison_report_contains_regression": false,
        "days_between_current_and_previous_report": 0,
        "comparison_table_improvement": [],
        "comparison_table_regression": [],
        "domains_exclusive_in_current_report": [],
        "domains_exclusive_in_other_report": [],
      }
    }
  },
  methods: {
    //
    load() {
      this.loading = true;
      http.get(`data/report/get_improvements_and_regressions/${this.report_id}/`).then(data => {
        this.comparison = data.data;
        this.loading = false;
      });
    }
  }
}
</script>

<style scoped>

</style>