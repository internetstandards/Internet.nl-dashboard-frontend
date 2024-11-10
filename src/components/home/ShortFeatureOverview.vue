<template>
  <b-row>
    <b-col class="w-100 text-center">
      <dashboard-icon icon="card-list" :stackscale="6" class="mb-2" :aria-label='$t("home.short-feature-overview.icon-list")'/>
      <h2>{{ $t("home.short-feature-overview.domains") }}</h2>
      <p>{{ $t("home.short-feature-overview.domains_text_1") }}</p>
      <p>{{ $t("home.short-feature-overview.domains_text_2") }}</p>

    </b-col>
    <b-col class="w-100 text-center">
      <dashboard-icon icon="search" :stackscale="6" class="mb-2" :aria-label='$t("home.short-feature-overview.icon-search")'/>
      <br>
      <h2>{{ $t("home.short-feature-overview.scan") }}</h2>
      <p>{{ $t("home.short-feature-overview.scan_text_1") }}</p>
      <p>{{ $t("home.short-feature-overview.scan_text_2") }}</p>
    </b-col>
    <b-col class="w-100 text-center">
      <dashboard-icon icon="file-bar-graph" :stackscale="6" class="mb-2" :aria-label='$t("home.short-feature-overview.icon-bar-chart")'/>
      <br>
      <h2>{{ $t("home.short-feature-overview.report") }}</h2>
      <p>{{ $t("home.short-feature-overview.report_text_1") }}</p>
      <p>{{ $t("home.short-feature-overview.report_text_2") }}</p>
    </b-col>
  </b-row>
</template>

<script>
import DashboardIcon from "@/components/DashboardIcon";
export default {
  name: "ShortFeatureOverview",
  components: {DashboardIcon}
}
</script>
