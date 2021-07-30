<template>
  <content-block>
    <h2>
      📊 #{{ reports[0].id }} - {{ reports[0].list_name }}
    </h2>
    <span>{{ $t("type_of_scan_performed") }}:
      <img src="/static_frontend/images/vendor/internet_nl/icon-website-test.svg" style="height: 1em;"
           v-if="reports[0].type === 'web'">
      <img src="/static_frontend/images/vendor/internet_nl/icon-emailtest.svg" style="height: 1em;"
           v-if="reports[0].type === 'mail'"> {{ reports[0].type }}<br>
      {{ $t("number_of_domains") }}: {{reports[0].number_of_urls }}<br>
      {{ $t("data_from") }} {{ humanize_date(reports[0].at_when) }}<br>
      📘 <router-link :to="{ name: 'numbered_lists', params: { list: reports[0].urllist_id }}">
        {{reports[0].list_name }}
      </router-link><br>
    </span><br>

    <template v-if="reports.length > 1">
      <div v-for="report in reports" style="padding-left: 10px" :key="report.id">
        <!-- Skip the first report -->
        <template v-if="report.id !== reports[0].id">
          <h3>{{ $t("compared_to") }}: #{{ report.id }} - {{ report.list_name }}</h3>
          <span>
            {{ $t("number_of_domains") }}: {{ report.number_of_urls }}<br>
            {{ $t("data_from") }} {{ humanize_date(report.at_when) }}<br>
            📘 <router-link :to="{ name: 'numbered_lists', params: { list: report.urllist_id }}">
            {{report.list_name }}</router-link><br>
          </span>
        </template>
      </div>
    </template>

    <template v-if="reports.length > 2">
      <p style="padding-top: 1em;">⚠️ {{ $t("only_graphs") }}</p>
    </template>

  </content-block>
</template>
<script>

export default {
  props: {
    reports: {type: Array, required: true},
  },
}

</script>

<i18n>
{
  "en": {
    "type_of_scan_performed": "Type of scan performed",
    "compared_to": "Compared to",
    "number_of_domains": "Number of domains",
    "data_from": "Data from",
    "only_graphs": "Only showing the timeline and graphs because there are more than two reports selected."
  },
  "nl": {
    "type_of_scan_performed": "Uitgevoerde scan",
    "compared_to": "Vergeleken met",
    "number_of_domains": "Aantal domeinen",
    "data_from": "Rapportage van",
    "only_graphs": "Enkel de tijdlijn en grafieken worden getoond omdat er meer dan twee rapporten zijn geselecteerd."
  }
}
</i18n>