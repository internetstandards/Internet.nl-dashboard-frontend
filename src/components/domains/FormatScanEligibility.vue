<template>
  <div class="scan-eligibility">
    <template v-if="scan_type === 'mail' || scan_type === 'all'">
      <span
        v-if="url.has_mail_endpoint === true"
        :title='$t("domain.scan-eligibility.eligeble_mail", [url.url])'
        role="img"
        :aria-label='$t("domain.scan-eligibility.eligeble_mail", [url.url])'
      >
        <i-mdi-email-check-outline class="scan-eligibility-icon is-eligible" aria-hidden="true" />
      </span>
      <span v-if="url.has_mail_endpoint === 'unknown'" :title='$t("domain.scan-eligibility.unknown_eligeble_mail", [url.url])'>
        <span role="img" :aria-label='$t("domain.scan-eligibility.unknown_eligeble_mail", [url.url])'>
          <i-mdi-email class="scan-eligibility-icon is-unknown" aria-hidden="true" />
        </span>
      </span>
      <span
        v-if="url.has_mail_endpoint === false"
        :title='$t("domain.scan-eligibility.not_eligeble_mail", [url.url])'
        role="img"
        :aria-label='$t("domain.scan-eligibility.not_eligeble_mail", [url.url])'
      >
        <i-mdi-email-remove class="scan-eligibility-icon is-ineligible" aria-hidden="true" />
      </span>
    </template>

    <template v-if="scan_type === 'web' || scan_type === 'all'">
      <span
        v-if="url.has_web_endpoint === true"
        :title='$t("domain.scan-eligibility.eligeble_web", [url.url])'
        role="img"
        :aria-label='$t("domain.scan-eligibility.eligeble_web", [url.url])'
      >
        <i-mdi-web-check class="scan-eligibility-icon is-eligible" aria-hidden="true" />
      </span>
      <span v-if="url.has_web_endpoint === 'unknown'" :title='$t("domain.scan-eligibility.unknown_eligeble_web", [url.url])'>
        <span role="img" :aria-label='$t("domain.scan-eligibility.unknown_eligeble_web", [url.url])'>
          <i-mdi-web class="scan-eligibility-icon is-unknown" aria-hidden="true" />
        </span>
      </span>
      <span
        v-if="url.has_web_endpoint === false"
        :title='$t("domain.scan-eligibility.not_eligeble_web", [url.url])'
        role="img"
        :aria-label='$t("domain.scan-eligibility.not_eligeble_web", [url.url])'
      >
        <i-mdi-web-remove class="scan-eligibility-icon is-ineligible" aria-hidden="true" />
      </span>
    </template>
  </div>
</template>

<script lang="ts">
export default {
  name: "FormatScanEligibility",
  
  props: {
    scan_type: {type: [String, Boolean], required: true},
    url: {type: Object, required: true}
  }
}
</script>

<style scoped>
.scan-eligibility {
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
}

.scan-eligibility-icon {
  display: inline-block;
  width: 1.2em;
  height: 1.2em;
  vertical-align: -0.2em;
}

.is-eligible {
  color: #198754;
}

.is-unknown {
  color: #6c757d;
}

.is-ineligible {
  color: #dc3545;
}
</style>
