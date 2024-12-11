<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
  <div>
  <b-pagination
    v-model="currentPage"
    :total-rows="reports.length"
    :per-page="perPage"
    class="mb-2"
    :value="currentPage"
    v-if="reports.length > perPage"
  ></b-pagination>

  <b-table :items="reports" :fields="fields" striped hover :busy="loading" v-model:sort-by="multiSortBy"
           :multisort="true"  sort-icon-left
            :current-page="currentPage"
            :per-page="perPage">

    <template #cell(at_when)="data">
       {{ humanize_date(data.value)}},<br>{{humanize_relative_date(data.value) }}
    </template>

    <template #cell(average_internet_nl_score)="data">
      <donut class="float-start" :data="{'score': data.value, 'rest': 100-data.value}" :show_number_in_center="false" :axis="['score', 'rest']" :tooltip="false" :datalabels="false" :height='25' :width='25' :elements="['donut']" />
      <div class="ml-2">{{data.value}}%</div>
    </template>

    <template #cell(urllist__name)="data">
      <a :href="`/shared/report/${data.item.public_report_code}`" target="_blank" rel="nofollow">
       <scan-type-icon :type="data.item.report_type" /> {{data.value}} ({{data.item.report_type}})<br />
        {{$t("public-reports.table.Contains")}} {{data.item.total_urls}} {{$t("public-reports.table.domains")}} <i-bi-box-arrow-in-up-right/>
      </a>
      <b-badge variant="danger" class="ml-2" v-if="data.has_public_share_code">
        <i-bi-lock/> Requires password
      </b-badge>
    </template>

  </b-table>
    </div>
</template>
<style scoped>
.text-dark {
  font-size: 40px;
}
</style>

<script>
import Donut from "@/components/charts/donut.vue";
import ScanTypeIcon from "@/components/ScanTypeIcon.vue";

export default {
  components: {ScanTypeIcon, Donut},

  props: {
    reports: {type: Array, required: true},
  },

  data() {
    return {
      loading: false,

      multiSortBy: [
        // {key: 'average_internet_nl_score', order: 'desc'},
        {key: 'at_when', order: 'desc'},
      ],

      currentPage: 1,
      perPage: 24,


      fields: [
        // tdClass: 'col-3', makes all cells 100% width which does not work in safari, therefore tdStyle is used as
        // a workaround
        {key: "average_internet_nl_score", sortable: false, label: this.$t("public-reports.table.Score")},
        {key: "urllist__name", sortable: false, label: this.$t("public-reports.table.Name")},
        {key: "at_when", sortable: false, label: this.$t("public-reports.table.Published")},
      ]
    }
  },
}
</script>
