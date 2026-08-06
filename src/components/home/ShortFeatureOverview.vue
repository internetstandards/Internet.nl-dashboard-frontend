<template>
  <b-row cols="1" cols-lg="3" class="g-4 text-start">
    <b-col>
      <b-card no-body class="feature-card h-100 border-0 shadow-sm">
        <b-card-header class="d-flex align-items-center gap-3 border-0 bg-info-subtle p-4">
          <span
            class="feature-icon d-inline-flex align-items-center justify-content-center flex-shrink-0 rounded-circle bg-info text-white"
            role="img"
            :aria-label="$t('home.short-feature-overview.icon-list')"
          >
            <i-bi-card-list aria-hidden="true" />
          </span>
          <b-card-title tag="h2" class="h4 mb-0">
            {{ $t("home.short-feature-overview.domains") }}
          </b-card-title>
        </b-card-header>
        <b-card-body class="p-4">
          <b-card-text class="fw-semibold">
            {{ $t("home.short-feature-overview.domains_text_1") }}
          </b-card-text>
          <b-card-text class="mb-0 text-body-secondary">
            {{ $t("home.short-feature-overview.domains_text_2") }}
          </b-card-text>
        </b-card-body>
      </b-card>
    </b-col>

    <b-col>
      <b-card no-body class="feature-card h-100 border-0 shadow-sm">
        <b-card-header class="d-flex align-items-center gap-3 border-0 bg-info-subtle p-4">
          <span
            class="feature-icon d-inline-flex align-items-center justify-content-center flex-shrink-0 rounded-circle bg-info text-white"
            role="img"
            :aria-label="$t('home.short-feature-overview.icon-search')"
          >
            <i-bi-search aria-hidden="true" />
          </span>
          <b-card-title tag="h2" class="h4 mb-0">
            {{ $t("home.short-feature-overview.scan") }}
          </b-card-title>
        </b-card-header>
        <b-card-body class="p-4">
          <b-card-text class="fw-semibold">
            {{ $t("home.short-feature-overview.scan_text_1") }}
          </b-card-text>
          <b-card-text class="mb-0 text-body-secondary">
            {{ $t("home.short-feature-overview.scan_text_2") }}
          </b-card-text>
        </b-card-body>
      </b-card>
    </b-col>

    <b-col>
      <b-card no-body class="feature-card h-100 border-0 shadow-sm">
        <b-card-header class="d-flex align-items-center gap-3 border-0 bg-info-subtle p-4">
          <span
            class="feature-icon d-inline-flex align-items-center justify-content-center flex-shrink-0 rounded-circle bg-info text-white"
            role="img"
            :aria-label="$t('home.short-feature-overview.icon-bar-chart')"
          >
            <i-bi-file-bar-graph aria-hidden="true" />
          </span>
          <b-card-title tag="h2" class="h4 mb-0">
            {{ $t("home.short-feature-overview.report") }}
          </b-card-title>
        </b-card-header>
        <b-card-body class="p-4">
          <b-card-text class="fw-semibold">
            {{ $t("home.short-feature-overview.report_text_1") }}
          </b-card-text>
          <b-card-text class="mb-0 text-body-secondary">
            {{ $t("home.short-feature-overview.report_text_2") }}
          </b-card-text>
        </b-card-body>
      </b-card>
    </b-col>
  </b-row>
</template>

<script lang="ts">
export default {
  name: "ShortFeatureOverview",
}
</script>

<style scoped>
.feature-card {
  overflow: hidden;
  border-radius: var(--bs-border-radius-lg);
}

.feature-icon {
  width: 3.5rem;
  height: 3.5rem;
  font-size: 1.65rem;
}
</style>
