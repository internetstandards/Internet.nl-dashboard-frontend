<!-- SPDX-License-Identifier: Apache-2.0 -->
<style scoped>
</style>
<template>
  <div>
    <content-block>
      <h1><b-icon icon="search" /> {{ $t("scanmonitor.page.title") }}</h1>
      <p>{{ $t("scanmonitor.page.intro") }}</p>
      <autorefresh :visible="true" :callback="load" :refresh_per_seconds="60" v-if="$store.state.user.is_authenticated" />
    </content-block>

    <b-row class="p-1 pl-2 pr-2" cols="1" cols-sm="1" cols-lg="3">

      <b-col class="p-1" v-bind:key="scan.id" v-for="scan in scans">
        <ScanMonitorScan :scan="scan" @scan-stopped="load"></ScanMonitorScan>
      </b-col>

    </b-row>


    <content-block v-if="!scans.length">{{ $t("scanmonitor.page.no_scans") }}</content-block>

  </div>
</template>


<script>

import ScanMonitorScan from './ScanMonitorScan'
import http from "@/httpclient";
import autorefresh from '@/components/autorefresh'

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
    this.load();
  },
  methods: {
    load: function () {
      this.update_scan_data();
    },
    update_scan_data: function () {
      http.get('/data/scan-monitor/').then(data => {
        this.scans = data.data;
        this.$store.commit("update_scan_monitor_data", data.data);
      });
    },
  }
}
</script>
