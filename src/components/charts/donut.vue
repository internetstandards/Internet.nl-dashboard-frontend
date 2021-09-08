<!--
Input data is reports['statistics_per_issue_type'].
Specify the issue type, for example: internet_nl_mail_auth_dkim_exist
And specify the axis: high, medium, ok, pct_ok etc. The first axis is highlighted IN the circle.

statistics_per_issue_type
  internet_nl_mail_auth_dkim_exist
    high	0
    medium	0
    low	0
    ok	2
    not_ok	0
    not_testable	0
    not_applicable	0
    error_in_test	0
    pct_high	0
    pct_medium	0
    pct_low	0
    pct_not_applicable	0
    pct_not_testable	0
    pct_error_in_test	0
    pct_ok	100
    pct_not_ok	0

-->
<style scoped>
h3 {
  height: 2.3em;
}
</style>
<template>
  <div>
    <h3 v-if="elements.includes('title')">{{ $t(title) }}</h3>

    <template v-if="elements.includes('donut') && !elements.includes('table')">
      <donutChart
          :donut_data="data"
          :i18n="$i18n"
          :axis="axis"
          :datalabels="datalabels"
          :tooltip="tooltip"
          :height="height"
          @graph-data-updated="graph_data_to_table"
      >
      </donutChart>
    </template>
    <template v-else>
      <b-tabs content-class="mt-3" pills end>
        <b-tab :title="$t('graph')" active v-if="elements.includes('donut')">
          <donutChart
              :donut_data="data"
              :i18n="$i18n"
              :axis="axis"
              :datalabels="datalabels"
              :tooltip="tooltip"
              :height="height"
              @graph-data-updated="graph_data_to_table"
          >
          </donutChart>
        </b-tab>

        <b-tab :title="$t('table')" v-if="elements.includes('table')">
          <b-table striped hover small :items="data_from_graph" :fields="table_fields">
            <!-- <template #table-caption>{{ $t(title) }}</template>-->
            <template #cell(value)="data">
              {{ data.value }}%
            </template>
          </b-table>
          <!-- <download-data :data="data_from_graph" :fields="table_fields"></download-data> -->
        </b-tab>

      </b-tabs>
    </template>
    <p class="text-center mt-2 font-weight-bolder" v-if="elements.includes('subtitle')">{{ $t(title) }}</p>
  </div>
</template>

<script>
import donutChart from './../charts/donutChart'
// import DownloadData from './../charts/DownloadData'
import field_translations from './../field_translations'

export default {
  i18n: {
    sharedMessages: field_translations,
  },

  components: {donutChart},

  props: {
    data: {type: Object, required: true},
    title: {type: String, required: false},
    datalabels: {type: Boolean, required: false, default: true},
    tooltip: {type: Boolean, required: false, default: true},
    height: {type: Number, required: false, default: 300},
    elements: {
      type: Array, required: false, default: () => {
        return ['donut', 'table', 'title']
      }
    },
    axis: {
      type: Array, required: false, default: () => {
        return ['pct_ok', 'pct_low', 'pct_medium', 'pct_high']
      }
    },
  },

  data() {
    return {

      data_from_graph: [],

      table_fields: [
        {key: 'measurement', label: this.$i18n.t("measurement"), sortable: true},
        {key: 'value', label: this.$i18n.t("value"), sortable: true},
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
    graph_data_to_table(graph_data) {
      // Prints the table from the chart, this is done to have any rules from the chart incorporated in the table.
      // perhaps this is logically wrong and the data should be rendered here, but is the chart still reactive then?
      if (!graph_data || graph_data.length === 0)
        return

      let data = [];
      graph_data.forEach((series) => {
        let i = 0;
        series.data.forEach((row) => {
          data.push({
            'measurement': this.$i18n.t(this.axis[i]),
            'value': row
          })
          i++;
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
    "measurement": "Rating",
    "value": "Percentage",
    "graph": "Chart",
    "table": "Table"
  },
  "nl": {
    "measurement": "Waardering",
    "value": "Percentage",
    "graph": "Grafiek",
    "table": "Tabel"
  }
}
</i18n>
