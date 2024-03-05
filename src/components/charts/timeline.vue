<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
  <div>
    <h2>{{ $t("title") }}</h2>
    <p>{{ $t("intro") }}</p>

    <b-tabs content-class="mt-3">
      <b-tab :title="$t('graph')" active>
        <time-line-chart
            :timeline_data="timeline_data"
            :highlight_report_ids="highlight_report_ids"
            :title="$t('title')"
            :x_axis_label="$t('x_axis_label')"
            :y_axis_label="$t('y_axis_label')"
            :accessibility_text="$t('accessibility_text')"
            @graph-data-updated="graph_data_to_table"
            :axis="['average_internet_nl_score']">
        </time-line-chart>
      </b-tab>

      <b-tab :title="$t('table')">
        <download-data :data="data_from_graph" :fields="table_fields"></download-data>
        <b-table striped hover small :items="data_from_graph" :fields="table_fields">
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
import TimeLineChart from './../charts/render-line-chart'
import DownloadData from './../charts/DownloadData'
// where do normal reports get theri data from? from a mixin? I mean? timeline graph is just 1 graph right?
import http from "@/httpclient";

export default {
  name: "timeline",
  components: {TimeLineChart, DownloadData},

  mounted() {
    this.get_timeline();
  },
  props: {
    urllist_ids: {type: Array, required: true},
    highlight_report_ids: {type: Array, required: false},
    report_type: {type: String, required: false, default: "web"},
  },

  data() {
    return {
      timeline_data: [],

      data_from_graph: [],

      table_fields: [
        {key: 'series', label: this.$t("series"), sortable: true},
        {key: 'date', label: this.$t("x_axis_label"), sortable: true},
        {key: 'value', label: this.$t("y_axis_label"), sortable: true},
        {key: 'report', label: this.$t("report"), sortable: true},
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

  methods: {
    get_timeline() {
      http.get(`/data/report/urllist_timeline_graph/${this.urllist_ids}/${this.report_type}/`).then(data => {
        this.timeline_data = data.data;
      });
    },
    graph_data_to_table(graph_data) {
      // Prints the table from the chart, this is done to have any rules from the chart incorporated in the table.
      // perhaps this is logically wrong and the data should be rendered here, but is the chart still reactive then?
      if (!graph_data || graph_data.length === 0)
        return

      let data = [];
      graph_data.forEach((series) => {
        series.data.forEach((row) => {
          data.push({
            'series': series.label,
            'report': row.report,
            'date': this.humanize_date_date_only(row.x),
            'value': row.y
          })
        })
      });
      this.data_from_graph = data;
    }
  }
}
</script>
<i18n>
{
  "en": {
    "title": "Average internet.nl score over time.",
    "y_axis_label": "Average internet.nl score",
    "x_axis_label": "Month",
    "average_internet_nl_score": "Average internet.nl score",
    "intro": "This graph compares the average internet.nl score over time.",
    "series": "Series",
    "report": "Report",
    "graph": "Graph",
    "table": "Table",
    "accessibility_text": "A table with the content of this graph is shown below."
  },
  "nl": {
    "title": "Adoptie van standaarden over tijd.",
    "y_axis_label": "Gemiddelde internet.nl score",
    "x_axis_label": "Maand",
    "average_internet_nl_score": "Gemiddelde internet.nl score",
    "intro": "Deze grafiek toont de gemiddelde internet.nl score over tijd.",
    "series": "Reeks",
    "report": "Rapport",
    "graph": "Grafiek",
    "table": "Tabel",
    "accessibility_text": "Een tabel met de inhoud van deze grafiek wordt hieronder getoond."
  }
}
</i18n>
