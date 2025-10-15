<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
  <div>
    <shared-report :requested_report_ids="requested_report_ids" />
  </div>
</template>
<script>
import http from "@/httpclient";
import SharedReport from "@/components/reports/SharedReport.vue";
export default {
  components: {SharedReport},
  data() {
    return {
      requested_report_ids: [],
      loading: false,
    }
  },
  methods: {
    get_report_type(){
       let report_type = '';
        if (this.$route.path.includes('/mail')) {
          report_type ='mail';
        }
        if (this.$route.path.includes('/web')) {
          report_type ='web';
        }
        return report_type
    },
    load() {
        // a list can create both a web and mail report. Those are added to the system in random order.
      // So you can specify web or mail to have more certainty.
      let urllist_id = this.$route.params.list_id;

      let url = `/data/public/lists/${urllist_id}/latest`
      if(this.get_report_type())
        url += `/${this.get_report_type()}`

      this.loading = true;
      http.get(url).then(data => {
        if (!data.data.latest_report_public_report_code) {
          this.loading = false;
          return;
        }

        this.requested_report_ids = [data.data.latest_report_public_report_code];
        this.loading = false;
      });
    }
  },
  mounted() {
    this.load();
  },
  watch: {
    $route: function () {
      this.load();
    }
  },

}
</script>
