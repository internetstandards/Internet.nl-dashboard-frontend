<!-- SPDX-License-Identifier: Apache-2.0 -->
<style scoped>

</style>
<template>
  <div v-if="reportsets.length > 0">
    <content-block>
      <h1>{{ $t("public-reports.per-account.Recently published reports") }}</h1>
    </content-block>
    <div v-for="reportset in reportsets" :key="reportset.list.id">
      <content-block v-if="reportset.reports.length">
        <h4>{{ reportset.list.name }}</h4>
        <p style="float: right">
          <key-value-badge :k='$t("public-reports.per-account.scan_frequency")' :v="$t('app.frequency' + reportset.list.automated_scan_frequency)" v-if="reportset.list.automatically_share_new_reports" />

          <key-value-badge :k='$t("public-reports.per-account.scan_type")' :v="$t('app.scan-type.' + reportset.list.scan_type)" />
        </p>
        <template v-if="reportset.list.scan_type === 'all'">
          <button class="mb-2 mr-2 darklink">
            <router-link :to="`/latest/${reportset.list.id}/mail/`">{{ $t("public-reports.per-account.View latest mail report") }}</router-link>
          </button>
          <button class="mb-2 darklink">
            <router-link :to="`/latest/${reportset.list.id}/web/`">{{ $t("public-reports.per-account.View latest web report") }}</router-link>
          </button>
        </template>
        <button class="mb-2 darklink" v-if="reportset.list.scan_type === 'web' || reportset.list.scan_type === 'mail'">
          <router-link :to="`/latest/${reportset.list.id}/`">{{ $t("public-reports.per-account.View latest report") }}</router-link>
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

export default {
  components: {KeyValueBadge, PublicReportsTable},

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
