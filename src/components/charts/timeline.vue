<template>
  <div>
    <h2>{{ $t("title") }}</h2>
    <p>{{ $t("intro") }}</p>

    <b-tabs content-class="mt-3">
      <b-tab :title="$t('graph')" active>
        <line-chart style="height:300px;"
            :chart_data="timeline_data"
            :highlight_report_ids="highlight_report_ids"
            :accessibility_text="$t('accessibility_text')"
            :axis="['average_internet_nl_score']">
        </line-chart>
      </b-tab>
      <b-tab :title="$t('table')">
        <b-table striped hover small :items="tabular_data" :fields="table_fields">
          <template #table-caption>{{ $t("title") }}</template>
          <template #cell(value)="data">
            {{ data.value }}%
          </template>
        </b-table>
      </b-tab>

    </b-tabs>
  </div>
</template>

<script>
import LineChart from './../charts/render-line-chart'
// where do normal reports get theri data from? from a mixin? I mean? timeline graph is just 1 graph right?
import http from "@/httpclient";

export default {
  name: "timeline",
  components: {LineChart},

  mounted() {
    this.get_timeline();
  },
  props: {
    urllist_ids: {type: Array, required: true},
    highlight_report_ids: {type: Array, required: false},
  },

  data() {
    return {
      timeline_data: [],

      table_fields: [
        {key: 'series', label: this.$i18n.t("series"), sortable: true},
        {key: 'date', label: this.$i18n.t("x_axis_label"), sortable: true},
        {key: 'value', label: this.$i18n.t("y_axis_label"), sortable: true},
        {key: 'report', label: this.$i18n.t("report"), sortable: true},
      ]
    }
  },

  watch: {
    urllist_ids() {
      this.get_timeline();
    },
    highlight_report_ids() {
      this.get_timeline();
    }
  },

  computed: {
    tabular_data() {
      let data = [];
      this.timeline_data.forEach((series) => {
        series.data.forEach((row) => {
          data.push({
            'series': series.name,
            'report': row.report,
            'date': this.humanize_date_date_only(row.date),
            'value': row.average_internet_nl_score}
            )
        })
      })
      return data;
    }
  },

  methods: {
    get_timeline() {
      http.get(`/data/report/urllist_timeline_graph/${this.urllist_ids}/`).then(data => {
        this.timeline_data = data.data;
      });
    }
  }
}
</script>
<i18n>
{
  "en": {
    "title": "Average internet.nl score over time.",
    "y_axis_label": "Average internet.nl score",
    "x_axis_label": "Date",
    "average_internet_nl_score": "Average internet.nl score",
    "accessibility_text": "A table with the content of this graph is shown in the table.",
    "intro": "This graph compares the average internet.nl score over time.",
    "series": "Series",
    "report": "Report",
    "graph": "Graph",
    "table": "Table"

  },
  "nl": {
    "title": "Adoptie van standaarden over tijd.",
    "y_axis_label": "Gemiddelde internet.nl score",
    "x_axis_label": "Datum",
    "average_internet_nl_score": "Gemiddelde internet.nl score",
    "accessibility_text": "Een tabel met de inhoud van deze grafiek wordt in de tabel getoond.",
    "intro": "Deze grafiek toont de gemiddelde internet.nl score over tijd.",
    "series": "Reeks",
    "report": "Rapport",
    "graph": "Grafiek",
    "table": "Tabel"
  }
}
</i18n>
