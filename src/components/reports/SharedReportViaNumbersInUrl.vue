<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
  <shared-report :requested_report_ids="requested_report_ids" v-if="requested_report_ids"/>
</template>
<script>

import SharedReport from "@/components/reports/SharedReport";
export default {
  components: {SharedReport},
  data() {
    return {
      requested_report_ids: [],
    }
  },
  mounted() {
    let router_params = this.$router.history.current.params;
    // the route to this component can determine what is shown
    this.requested_report_ids = [router_params.report, router_params.compare_with].filter(Boolean);
  },
}
</script>
