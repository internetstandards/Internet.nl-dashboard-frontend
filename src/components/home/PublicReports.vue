<!-- SPDX-License-Identifier: Apache-2.0 -->
<style scoped>

</style>
<template>
  <div v-if="reports.length > 0">
    <content-block>
      <h3>{{ $t("public-reports.page.Public reports") }}</h3>
      <p>{{ $t("public-reports.page.introduction") }}</p>
      <PublicReportsTable :reports="reports"/>
    </content-block>
  </div>
</template>

<script>

import http from "@/httpclient";
import PublicReportsTable from "@/components/home/PublicReportsTable.vue";

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
      http.get('data/report/public').then(data => {
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
