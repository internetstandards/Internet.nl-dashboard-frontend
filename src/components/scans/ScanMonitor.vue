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
      <b-button variant="warning" :disabled="refreshing" :aria-busy="refreshing" @click="load">
        <b-spinner v-if="refreshing" small class="me-1" aria-hidden="true" />
        <span v-else aria-hidden="true">🔁</span>
        {{ $t("app.autorefresh.refresh_now") }}
      </b-button>
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
import { dashboardStore } from '@/dashboardStore'
import {mapState} from "pinia";

export default {
  components: {
    ScanMonitorScan
  },
  name: 'scan_monitor',

  data: function () {
    return {
      store: dashboardStore(),
      refreshing: false,
    }
  },
  methods: {
    load: async function () {
      if (this.refreshing) {
        return
      }

      this.refreshing = true
      try {
        await this.store.load_scan_monitor_data()
      } catch (error) {
        console.error('Unable to refresh scan monitor data.', error)
      } finally {
        this.refreshing = false
      }
    },
  },
  computed: {
    ...mapState(dashboardStore, ['user', 'scan_monitor_data']),
    scans() {
      return this.scan_monitor_data
    }
  },
}
</script>
