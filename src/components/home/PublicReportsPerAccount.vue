<!-- SPDX-License-Identifier: Apache-2.0 -->
<style scoped>

</style>
<template>
  <div v-if="reportsets.length > 0">
    <content-block>
      <h3>{{ $t('Recently published reports') }}</h3>
    </content-block>
    <div v-for="reportset in reportsets" :key="reportset.list.id">
      <content-block v-if="reportset.reports.length">
        <h4>{{ reportset.list.name }}</h4>
        <p style="float: right">
          <key-value-badge :k="$t('scan_frequency')" :v="$t(reportset.list.automated_scan_frequency)" v-if="reportset.list.automatically_share_new_reports" />

          <key-value-badge :k="$t('scan_type')" :v="$t(reportset.list.scan_type)" />
        </p>
        <button class="mb-2 darklink">
          <router-link :to="`published/1/${reportset.list.id}/`">{{ $t('View latest report') }}</router-link>
        </button>
        <PublicReportsTable :reports="reportset.reports"/>
      </content-block>
    </div>
  </div>
</template>
<style scoped>
.darklink a, .darklink a:visited, .darkslink a:hover, .darkslink a:active {
  color: black;
}

</style>
<script>

import http from "@/httpclient";
import PublicReportsTable from "@/components/home/PublicReportsTable";
import KeyValueBadge from "@/components/KeyValueBadge";
import sharedMessages from './../translations/dashboard.js'

export default {
  components: {KeyValueBadge, PublicReportsTable},
  i18n: {
    sharedMessages: sharedMessages,
  },

  data() {
    return {
      reportsets: Array,
      loading: false,
    }
  },

  methods: {
    load() {
      this.loading = true;
      http.get(`data/report/public/account/${this.$router.history.current.params.account}/lists/all/`).then(data => {
        this.reportsets = data.data;
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
    "Recently published reports": "Public reports",
    "Score": "Internet.nl score",
    "Name": "Report",
    "Published": "Publication date",
    "View": "View",
    "Contains": "Contains",
    "View latest report": "Direct link to newest report",
    "scan_frequency": "Next update",
    "scan_type": "Measured",
    "all": "Mail & Web"
  },
  "nl": {
    "domains": "domeinen",
    "View report": "Bekijk rapport",
    "Recently published reports": "Openbare rapporten",
    "Score": "Internet.nl score",
    "Name": "Rapport",
    "Published": "Gepubliceerd op",
    "View": "Bekijken",
    "Contains": "Bevat",
    "View latest report": "Direct naar het nieuwste rapport",
    "scan_frequency": "Volgende update",
    "scan_type": "Gemeten",
    "all": "Mail & Web"
  }
}

</i18n>