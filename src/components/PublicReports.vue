<!-- SPDX-License-Identifier: Apache-2.0 -->
<style scoped>

</style>
<template>
  <div>
 <h3>{{$t('Recently published reports')}}</h3>
  <p>{{$t('introduction')}}</p>

  <b-table :items="reports" :fields="fields" striped hover :busy="loading">
    <template #cell(at_when)="data">
       {{ humanize_date(data.value)}},<br>{{humanize_relative_date(data.value) }}
    </template>

    <template #cell(average_internet_nl_score)="data">
       <donut class="float-left w-50" :data="{'score': data.value, 'rest': 100-data.value}" :axis="['score', 'rest']" :tooltip="false" :datalabels="false" :height='50' :elements="['donut']" />
      <span class="float-left mt-2 text-info">{{data.value}}%</span>
    </template>

    <template #cell(urllist__name)="data">
       <scan-type-icon :type="data.item.report_type" /> {{data.value}} ({{data.item.report_type}})<br />
        {{$t('Contains')}} {{data.item.total_urls}} {{$t('domains')}}
    </template>

    <template #cell(open)="data">
      <a :href="`#/shared/report/${data.item.public_report_code}`" target="_blank" rel="nofollow">{{$t('View report')}} <b-icon icon="box-arrow-in-up-right"></b-icon></a>
    </template>


  </b-table>
    </div>
</template>

<script>

import http from "@/httpclient";
import Donut from "@/components/charts/donut";
import ScanTypeIcon from "@/components/ScanTypeIcon";

export default {
  components: {ScanTypeIcon, Donut},
  data() {
    return {
      reports: Array,
      loading: false,
      fields: [
        {key: "average_internet_nl_score", sortable: true, label: this.$t('Score'), tdClass: 'col-2'},
        {key: "urllist__name", sortable: true, label: this.$t('Name'), tdClass: 'col-4'},
        {key: "at_when", sortable: true, label: this.$t('Published'), tdClass: 'col-4'},
        {key: "open", sortable: false, label: this.$t('View'), tdClass: 'col-4'},
      ]
    }
  },

  methods: {

    load() {
      this.loading = true;
      http.get('data/report/public/').then(data => {
        this.reports = data.data;
        this.loading = false;
      });
    }
  },

  mounted() {
    this.load();
  }

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
    "Contains": "Measures"
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
    "Contains": "Meet"
  }
}

</i18n>