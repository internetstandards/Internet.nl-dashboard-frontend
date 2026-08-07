<!-- SPDX-License-Identifier: Apache-2.0 -->
<style scoped>
.scan-monitor-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: minmax(0, 1fr);
  padding: 0.5rem;
}

@media (min-width: 768px) {
  .scan-monitor-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 992px) {
  .scan-monitor-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
<template>
  <div>
    <content-block>
      <h1><i-bi-search /> {{ $t("scanmonitor.page.title") }}</h1>
      <p>{{ $t("scanmonitor.page.intro") }}</p>
      <autorefresh :visible="true" :callback="load" :refresh_per_seconds="60" v-if="user.is_authenticated" />
    </content-block>

    <div class="scan-monitor-grid">
      <ScanMonitorScan
        v-for="scan in scans"
        :key="scan.id"
        :scan="scan"
        @scan-stopped="load"
      />
    </div>

    <content-block v-if="!scans.length">{{ $t("scanmonitor.page.no_scans") }}</content-block>

  </div>
</template>


<script>

import ScanMonitorScan from './ScanMonitorScan.vue'
import http from "@/httpclient";
import autorefresh from '@/components/autorefresh.vue'
import { dashboardStore } from '@/dashboardStore'
import {mapState} from "pinia";

export default {
  components: {
    ScanMonitorScan,
    autorefresh
  },
  name: 'scan_monitor',

  data: function () {
    return {
      scans: [],
    }
  },
  mounted: function () {
    this.store = dashboardStore();
    this.load();
  },
  methods: {
    load: function () {
      this.update_scan_data();
    },
    update_scan_data: function () {
      http.get('/api/v1/scans').then(data => {
        this.scans = data.data;
        this.store.update_scan_monitor_data(data.data);
      });
    },
  },
  computed: mapState(dashboardStore, ['user']),
}
</script>
