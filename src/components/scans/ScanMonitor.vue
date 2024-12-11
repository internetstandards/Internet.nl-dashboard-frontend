<!-- SPDX-License-Identifier: Apache-2.0 -->
<style scoped>
</style>
<template>
  <div>
    <content-block>
      <h1><i-bi-search /> {{ $t("scanmonitor.page.title") }}</h1>
      <p>{{ $t("scanmonitor.page.intro") }}</p>
      <autorefresh :visible="true" :callback="load" :refresh_per_seconds="60" v-if="user.is_authenticated" />
    </content-block>

    <b-row class="p-2 pl-2 pr-2" cols="1" cols-sm="1" cols-lg="3">
      <b-col class="p-1 pb-3" v-bind:key="scan.id" v-for="scan in scans">
        <ScanMonitorScan :scan="scan" @scan-stopped="load"></ScanMonitorScan>
      </b-col>
    </b-row>

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
      http.get('/data/scan-monitor/').then(data => {
        this.scans = data.data;
        this.store.update_scan_monitor_data(data.data);
      });
    },
  },
  computed: mapState(dashboardStore, ['user']),
}
</script>
