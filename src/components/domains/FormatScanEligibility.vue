<template>
  <div>
    <template v-if="scan_type === 'mail' || scan_type === 'all'">
            <span v-if="url.has_mail_endpoint === true" :title="$t('eligeble_mail', [url.url])">
                <span role="img" :aria-label="$t('eligeble_mail', [url.url])">🌍</span>
            </span>
      <span v-if="url.has_mail_endpoint === 'unknown'" :title="$t('unknown_eligeble_mail', [url.url])">
                <span role="img" :aria-label="$t('unknown_eligeble_mail', [url.url])">❓</span>
            </span>
      <span v-if="url.has_mail_endpoint === false" :title="$t('not_eligeble_mail', [url.url])">
                <span role="img" :aria-label="$t('not_eligeble_mail', [url.url])">🚫</span>
            </span>
    </template>

    <template v-if="scan_type === 'web' || scan_type === 'all'">
            <span v-if="url.has_web_endpoint === true" :title="$t('eligeble_web', [url.url])">
                <span role="img" :aria-label="$t('eligeble_web', [url.url])">🌍</span>
            </span>
      <span v-if="url.has_web_endpoint === 'unknown'" :title="$t('unknown_eligeble_web', [url.url])">
                <span role="img" :aria-label="$t('unknown_eligeble_web', [url.url])">❓</span>
            </span>
      <span v-if="url.has_web_endpoint === false" :title="$t('not_eligeble_web', [url.url])">
                <span role="img" :aria-label="$t('not_eligeble_web', [url.url])">🚫</span>
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
<i18n>
{
  "en": {
    "eligeble_mail": "{0} is eligible for e-mail scans",
    "unknown_eligeble_mail": "Not yet known if {0} can be mail scanned.",
    "not_eligeble_mail": "{0} is not eligible for e-mail scans. Will be checked again when starting a scan.",
    "eligeble_web": "{0} is eligible for web scans",
    "unknown_eligeble_web": "Not yet known if {0} can be web scanned.",
    "not_eligeble_web": "{0} is not eligible for web scans. Will be checked again when starting a scan."
  },
  "nl": {
    "eligeble_mail": "E-mail scannen is mogelijk",
    "unknown_eligeble_mail": "Onbekend of E-mail scannen mogelijk is",
    "not_eligeble_mail": "Kan geen E-mail scan uitvoeren (wordt opnieuw gecheckt bij het starten van de scan)",
    "eligeble_web": "Web scan is mogelijk",
    "unknown_eligeble_web": "Niet bekend of het mogelijk is een web scan uit te voeren",
    "not_eligeble_web": "Web scan kan niet worden uitgevoerd. Dit wordt opnieuw gecheckt bij het starten van de scan."
  }
}
</i18n>