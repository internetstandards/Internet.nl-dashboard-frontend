<template>
  <div>
    <template v-if="scan_type === 'mail' || scan_type === 'all'">
            <span v-if="url.has_mail_endpoint === true" :title='$t("domain.scan-eligibility.eligeble_mail", [url.url])'>
                <span role="img" :aria-label='$t("domain.scan-eligibility.eligeble_mail", [url.url])'>🌍</span>
            </span>
      <span v-if="url.has_mail_endpoint === 'unknown'" :title='$t("domain.scan-eligibility.unknown_eligeble_mail", [url.url])'>
                <span role="img" :aria-label='$t("domain.scan-eligibility.unknown_eligeble_mail", [url.url])'>❓</span>
            </span>
      <span v-if="url.has_mail_endpoint === false" :title='$t("domain.scan-eligibility.not_eligeble_mail", [url.url])'>
                <span role="img" :aria-label='$t("domain.scan-eligibility.not_eligeble_mail", [url.url])'>🚫</span>
            </span>
    </template>

    <template v-if="scan_type === 'web' || scan_type === 'all'">
            <span v-if="url.has_web_endpoint === true" :title='$t("domain.scan-eligibility.eligeble_web", [url.url])'>
                <span role="img" :aria-label='$t("domain.scan-eligibility.eligeble_web", [url.url])'>🌍</span>
            </span>
      <span v-if="url.has_web_endpoint === 'unknown'" :title='$t("domain.scan-eligibility.unknown_eligeble_web", [url.url])'>
                <span role="img" :aria-label='$t("domain.scan-eligibility.unknown_eligeble_web", [url.url])'>❓</span>
            </span>
      <span v-if="url.has_web_endpoint === false" :title='$t("domain.scan-eligibility.not_eligeble_web", [url.url])'>
                <span role="img" :aria-label='$t("domain.scan-eligibility.not_eligeble_web", [url.url])'>🚫</span>
            </span>
    </template>
  </div>
</template>

<script>
export default {
  name: "FormatScanEligibility",
  
  props: {
    scan_type: {type: [String, Boolean], required: true},
    url: {type: Object, required: true}
  }
}
</script>
