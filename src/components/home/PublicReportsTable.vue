<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
  <div>
  <b-pagination
    v-model="currentPage"
    :total-rows="reports.length"
    :per-page="perPage"
    pills
    class="mb-2"
    :value="currentPage"
    v-if="reports.length > perPage"
  ></b-pagination>

  <b-table :items="reports" :fields="fields" striped hover :busy="loading" :sort-by.sync="sortBy"
           :sort-desc.sync="sortDesc" sort-icon-left
            :current-page="currentPage"
            :per-page="perPage">

    <template #cell(at_when)="data">
       {{ humanize_date(data.value)}},<br>{{humanize_relative_date(data.value) }}
    </template>

    <template #cell(average_internet_nl_score)="data">

        <div class="text-dark">
          <donut class="float-left w-50" :data="{'score': data.value, 'rest': 100-data.value}" :show_number_in_center="false" :axis="['score', 'rest']" :tooltip="false" :datalabels="false" :height='200' :elements="['donut']" />
          <span>{{data.value}}%</span>
        </div>

    </template>

    <template #cell(urllist__name)="data">
      <a :href="`#/shared/report/${data.item.public_report_code}`" target="_blank" rel="nofollow">
       <scan-type-icon :type="data.item.report_type" /> {{data.value}} ({{data.item.report_type}})<br />
        {{$t('Contains')}} {{data.item.total_urls}} {{$t('domains')}} <b-icon icon="box-arrow-in-up-right"></b-icon>
      </a>
      <b-badge variant="danger" class="ml-2" v-if="data.has_public_share_code">
        <b-icon icon="lock"></b-icon> Requires password
      </b-badge>
    </template>

  </b-table>
    </div>
</template>
<style scoped>
.text-dark {
  font-size: 2em;

}

</style>

<script>
import Donut from "@/components/charts/donut";
import ScanTypeIcon from "@/components/ScanTypeIcon";

export default {
  components: {ScanTypeIcon, Donut},

  props: {
    reports: {type: Array, required: true},
  },

  data() {
    return {
      loading: false,

      sortBy: 'at_when',
      sortDesc: true,

      currentPage: 1,
      perPage: 24,


      fields: [
        // tdClass: 'col-3', makes all cells 100% width which does not work in safari, therefore tdStyle is used as
        // a workaround
        {key: "average_internet_nl_score", sortable: true, label: this.$t('Score'),  tdStyle: "width: 25%;"},
        {key: "urllist__name", sortable: true, label: this.$t('Name'),  tdStyle: "width: 50%"},
        {key: "at_when", sortable: true, label: this.$t('Published'), tdStyle: "width: 25%"},
      ]
    }
  },
}
</script>
<i18n>
{
  "en": {
    "domains": "domains",
    "View report": "View report",
    "Recently published reports": "Recently published reports",
    "introduction": "These reports are created, curated and shared by the internet.nl staff",
    "Score": "Internet.nl score",
    "Name": "Report",
    "Published": "Publication date",
    "View": "View",
    "Contains": "Contains"
  },
  "nl": {
    "domains": "domeinen",
    "View report": "Bekijk rapport",
    "Recently published reports": "Recent gepubliceerde rapporten",
    "introduction": "Deze rapporten worden gemaakt, samengesteld en gedeeld door internet.nl",
    "Score": "Internet.nl score",
    "Name": "Rapport",
    "Published": "Gepubliceerd op",
    "View": "Bekijken",
    "Contains": "Bevat"
  }
}

</i18n>