<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
  <div>
    <h2>{{ $t("chart.timeline.title") }}</h2>
    <p>{{ $t("chart.timeline.intro") }}</p>

    <b-tabs content-class="mt-3">
      <b-tab :title='$t("chart.timeline.graph")' active>
        <time-line-chart
            :timeline_data="timeline_data"
            :highlight_report_ids="highlight_report_ids"
            :title='$t("chart.timeline.title")'
            :x_axis_label='$t("chart.timeline.x_axis_label")'
            :y_axis_label='$t("chart.timeline.y_axis_label")'
            :accessibility_text='$t("chart.timeline.accessibility_text")'
            @graph-data-updated="graph_data_to_table"
            :axis="['average_internet_nl_score']">
        </time-line-chart>
      </b-tab>

      <b-tab :title='$t("chart.timeline.table")'>
        <download-data :data="data_from_graph" :fields="table_fields"></download-data>
        <b-table striped hover small :items="data_from_graph" :fields="table_fields">
          <template #table-caption>{{ $t("chart.timeline.title") }}</template>
          <template #cell(value)="data">
            {{ data.value }}%
          </template>
        </b-table>
      </b-tab>

    </b-tabs>
  </div>
</template>

<script>
import TimeLineChart from './../charts/render-line-chart.vue'
import DownloadData from './../charts/DownloadData.vue'
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
        {key: 'series', label: this.$t("chart.timeline.series"), sortable: true},
        {key: 'date', label: this.$t("chart.timeline.x_axis_label"), sortable: true},
        {key: 'value', label: this.$t("chart.timeline.y_axis_label"), sortable: true},
        {key: 'report', label: this.$t("chart.timeline.report"), sortable: true},
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
      http.get(`/data/report/urllist_timeline_graph/${this.urllist_ids}/${this.report_type}`).then(data => {
        this.timeline_data = data.data;
      });
    },
    graph_data_to_table(graph_data) {
      // Prints the table from the chart, this is done to have any rules from the chart incorporated in the table.
      // perhaps this is logically wrong and the data should be rendered here, but is the chart still reactive then?
      if (!graph_data || graph_data.length === 0)
        return

      const data = [];
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
