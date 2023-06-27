<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
  <div>
    <div v-for="report in reports" :key="report.id">
      <template v-if="reports.length > 1">
        <h4 class="mb-4">#{{ report.id }} - {{ report.urllist_name }}</h4>
      </template>
      <b-row cols-sm="2" cols-md="4" v-if="report['calculation']['statistics_per_issue_type']">
        <b-col
            v-for="item in visible_fields_from_scan_form(scan_methods[report.report_type === 'mail' ? 1 : 0])"
            :key="item">
          <donut :height='400'
                 :tooltip="false"
                 :data="report['calculation']['statistics_per_issue_type'][item]"
                 :elements="['donut', 'subtitle']"
                 :title="item"
                 v-if="report['calculation']['statistics_per_issue_type'][item]"
          />
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import Donut from "@/components/charts/donut";
import VisibleFields from "@/components/reports/VisibleFields";

export default {
  name: "donuts",
  mixins: [VisibleFields],
  components: {Donut},
  props: {
    reports: {type: Array, required: true}
  }
}
</script>
