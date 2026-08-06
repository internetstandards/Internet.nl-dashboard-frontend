<!-- SPDX-License-Identifier: Apache-2.0 -->
<style scoped>
.donut-layout {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}

.donut-layout__item {
  flex: 1 1 100%;
  max-width: 300px;
  min-width: 0;
}

@media (min-width: 576px) {
  .donut-layout__item {
    flex-basis: 260px;
  }
}

@media (min-width: 1200px) {
  .donut-layout__item {
    flex-basis: 165px;
  }
}
</style>

<template>
  <div>
    <div v-for="report in reports" :key="report.id">
      <template v-if="reports.length > 1">
        <h4 class="mb-4">#{{ report.id }} - {{ report.urllist_name }}</h4>
      </template>
      <div class="donut-layout" v-if="report['calculation']['statistics_per_issue_type']">
        <div
            class="donut-layout__item"
            v-for="item in donut_items(report)"
            :key="item">
          <donut :height='300'
                 :tooltip="false"
                 :data="report['calculation']['statistics_per_issue_type'][item]"
                 :elements="['donut', 'subtitle']"
                 :title="item"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Donut from "@/components/charts/donut.vue";
import VisibleFields from "@/components/reports/VisibleFields.vue";

export default {
  name: "donuts",
  mixins: [VisibleFields],
  components: {Donut},
  props: {
    reports: {type: Array, required: true}
  },
  methods: {
    donut_items(report) {
      const statistics = report.calculation?.statistics_per_issue_type ?? {}
      const scanMethod = this.scan_methods[report.report_type === 'mail' ? 1 : 0]
      return this.visible_fields_from_scan_form(scanMethod).filter((item) => statistics[item])
    }
  }
}
</script>
