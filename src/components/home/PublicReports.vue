<!-- SPDX-License-Identifier: Apache-2.0 -->
<style scoped>

</style>
<template>
  <div v-if="reports.length > 0">
    <content-block>
      <h3>{{ $t('Public reports') }}</h3>
      <p>{{ $t('introduction') }}</p>
      <PublicReportsTable :reports="reports"/>
    </content-block>
  </div>
</template>

<script>

import http from "@/httpclient";
import PublicReportsTable from "@/components/home/PublicReportsTable";

export default {
  components: {PublicReportsTable},
  data() {
    return {
      reports: [],
      loading: false,
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
    "Public reports": "Public reports created by dashboard staff",
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
    "Public reports": "Openbare rapporten samengesteld door dashboard beheerders",
    "introduction": "Deze rapporten worden gemaakt, samengesteld en gedeeld door internet.nl",
    "Score": "Internet.nl score",
    "Name": "Rapport",
    "Published": "Gepubliceerd op",
    "View": "Bekijken",
    "Contains": "Bevat"
  }
}

</i18n>