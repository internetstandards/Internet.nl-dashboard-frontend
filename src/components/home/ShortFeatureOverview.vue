<template>
  <b-row cols="1" cols-md="3">
    <b-col class="text-center p-4">
      <span style="display: inline-block; font-size: 3.7em; background-color: var(--bs-info); border-radius: 200px; height: 150px; width: 150px; padding-top:0.4em;" class="mb-2" :aria-label='$t("home.short-feature-overview.icon-list")'>
        <i-bi-card-list style="color: white" />
      </span>
      <h2>{{ $t("home.short-feature-overview.domains") }}</h2>
      <p>{{ $t("home.short-feature-overview.domains_text_1") }}</p>
      <p>{{ $t("home.short-feature-overview.domains_text_2") }}</p>

    </b-col>
    <b-col class="text-center p-4">
      <span style="display: inline-block; font-size: 3.7em; background-color: var(--bs-info); border-radius: 200px; height: 150px; width: 150px; padding-top:0.4em;" class="mb-2" :aria-label='$t("home.short-feature-overview.icon-search")'>
        <i-bi-search style="color: white"/>
      </span>
      <br>
      <h2>{{ $t("home.short-feature-overview.scan") }}</h2>
      <p>{{ $t("home.short-feature-overview.scan_text_1") }}</p>
      <p>{{ $t("home.short-feature-overview.scan_text_2") }}</p>
    </b-col>
    <b-col class="text-center p-4">
      <span style="display: inline-block; font-size: 3.7em; background-color: var(--bs-info); border-radius: 200px; height: 150px; width: 150px; padding-top:0.4em;" class="mb-2" :aria-label='$t("home.short-feature-overview.icon-bar-chart")'>
        <i-bi-file-bar-graph style="color: white"/>
      </span>
      <br>
      <h2>{{ $t("home.short-feature-overview.report") }}</h2>
      <p>{{ $t("home.short-feature-overview.report_text_1") }}</p>
      <p>{{ $t("home.short-feature-overview.report_text_2") }}</p>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: "ShortFeatureOverview",
}
</script>
