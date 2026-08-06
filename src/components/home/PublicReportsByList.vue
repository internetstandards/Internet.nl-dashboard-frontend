<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
  <content-block v-if="report_groups.length > 0" class="public-reports-by-list">
    <section
      v-for="group in report_groups"
      :key="group.key"
      class="public-report-group mb-5"
    >
      <h4>{{ group.name }}</h4>

      <section
        v-for="report_set in group.report_sets"
        :key="report_set.key"
        class="public-report-set mb-4 mt-3"
      >
        <h5 class="mb-2">
          <scan-type-icon :type="report_set.report_type" />
          {{ report_set.name }}
        </h5>

        <time-line-chart
          :timeline_data="report_set.timeline_data"
          :highlight_report_ids="[]"
          :y_axis_label="$t('chart.timeline.y_axis_label')"
          :accessibility_text="$t('chart.timeline.accessibility_text')"
          :show_legend="false"
          :clickable_reports="true"
          height="140px"
          @report-clicked="open_report"
        />

        <b-table
          :items="report_set.reports"
          :fields="fields"
          :current-page="current_page(report_set.key)"
          :per-page="reports_per_page"
          striped
          hover
          small
          responsive
          class="mt-3"
        >
          <template #cell(average_internet_nl_score)="data">
            <donut
              class="float-start"
              :data="{score: data.value, rest: 100 - data.value}"
              :show_number_in_center="false"
              :axis="['score', 'rest']"
              :tooltip="false"
              :datalabels="false"
              :height="25"
              :width="25"
              :elements="['donut']"
            />
            <div class="ps-4">&nbsp;{{ data.value }}%</div>
          </template>

          <template #cell(at_when)="data">
            <a
              :href="`/shared/report/${data.item.public_report_code}`"
              target="_blank"
              rel="nofollow"
            >
              {{ humanize_date(data.value) }}
            </a>
          </template>

          <template #cell(coverage)="data">
            <a
              :href="`/shared/report/${data.item.public_report_code}`"
              target="_blank"
              rel="nofollow"
            >
              {{$t("public-reports.table.domains", [data.item.total_urls])}}
            </a>
          </template>

          <template #cell(open)="data">
            <b-button
              :href="`/shared/report/${data.item.public_report_code}`"
              target="_blank"
              variant="warning"
              rel="nofollow"
              size="sm"
            >
              {{$t("public-reports.table.view report")}}
            </b-button>
          </template>


        </b-table>

        <b-pagination
          v-if="report_set.reports.length > reports_per_page"
          :model-value="current_page(report_set.key)"
          :total-rows="report_set.reports.length"
          :per-page="reports_per_page"
          class="mt-3 mb-2"
          @update:model-value="set_current_page(report_set.key, $event)"
        />

      </section>
    </section>
  </content-block>
</template>

<script lang="ts">
import Donut from "@/components/charts/donut.vue";
import TimeLineChart from "@/components/charts/render-line-chart.vue";
import ScanTypeIcon from "@/components/ScanTypeIcon.vue";

export default {
  name: "PublicReportsByList",
  components: {Donut, ScanTypeIcon, TimeLineChart},

  props: {
    reports: {type: Array, required: true},
  },

  data() {
    return {
      current_pages: new Map(),
      reports_per_page: 3,
      fields: [
        {
          key: "average_internet_nl_score",
          sortable: false,
          label: this.$t("public-reports.table.Score"),
        },
        {
          key: "coverage",
          sortable: false,
          label: this.$t("public-reports.table.Coverage"),
        },
        {
          key: "at_when",
          sortable: false,
          label: this.$t("public-reports.table.Published"),
        },
        {
          key: "open",
          sortable: false,
          label: this.$t("public-reports.table.open"),
        },
      ],
    };
  },

  computed: {
    report_groups() {
      const groups = new Map();

      this.reports.forEach((report) => {
        const list_id = report.urllist_id ?? report.urllist__id ?? null;
        const list_name = report.urllist_name ?? report.urllist__name ?? "";

        // urllist_id is the intended grouping key. The name fallback keeps the
        // draft visible until that field is added to the public-reports response.
        const key = list_id === null ? `name:${list_name}` : `id:${list_id}`;

        if (!groups.has(key)) {
          groups.set(key, {
            key,
            id: list_id,
            name: list_name,
            reports: [],
          });
        }

        groups.get(key).reports.push(report);
      });

      return Array.from(groups.values())
        .map((group) => {
          const chronological_reports = [...group.reports].sort(
            (left, right) => this.timestamp(left.at_when) - this.timestamp(right.at_when),
          );

          return {
            ...group,
            report_sets: this.report_sets(chronological_reports, group),
          };
        })
        .sort((left, right) => left.name.localeCompare(right.name));
    },
  },

  methods: {
    open_report(public_report_code) {
      window.open(
        `/shared/report/${encodeURIComponent(public_report_code)}`,
        "_blank",
        "noopener,noreferrer",
      );
    },

    current_page(report_set_key) {
      return this.current_pages.get(report_set_key) ?? 1;
    },

    set_current_page(report_set_key, page) {
      this.current_pages.set(report_set_key, page);
    },

    timestamp(value) {
      const timestamp = Date.parse(value);
      return Number.isNaN(timestamp) ? 0 : timestamp;
    },

    report_sets(reports, group) {
      const reports_by_type = new Map();

      reports.forEach((report) => {
        if (!reports_by_type.has(report.report_type)) {
          reports_by_type.set(report.report_type, []);
        }

        reports_by_type.get(report.report_type).push(report);
      });

      const report_type_order = {web: 0, mail: 1};

      return Array.from(reports_by_type.entries())
        .map(([report_type, typed_reports]) => {
          const name = this.$t(`app.scan-type.${report_type}`);
          const data = typed_reports.map((report) => ({
            date: report.at_when.slice(0, 10),
            urls: report.total_urls,
            average_internet_nl_score: report.average_internet_nl_score,
            report: report.public_report_code,
          }));

          return {
            key: `${group.key}:${report_type}`,
            name,
            report_type,
            reports: [...typed_reports].reverse(),
            timeline_data: [{
              id: `${group.key}:${report_type}`,
              name,
              data,
            }],
          };
        })
        .sort((left, right) => {
          const left_order = report_type_order[left.report_type] ?? Number.MAX_SAFE_INTEGER;
          const right_order = report_type_order[right.report_type] ?? Number.MAX_SAFE_INTEGER;
          return left_order - right_order || left.name.localeCompare(right.name);
      });
    },
  },

  watch: {
    reports() {
      this.current_pages.clear();
    },
  },
};
</script>

<style scoped>
.public-report-group:last-child {
  margin-bottom: 0 !important;
}

.public-report-set:last-child {
  margin-bottom: 0 !important;
}
</style>
