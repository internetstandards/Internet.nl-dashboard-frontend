<template>
  <b-row>
    <b-col class="w-100 text-center">
      <dashboard-icon icon="card-list" :stackscale="6" class="mb-2"/>
      <h2>{{ $t('domains') }}</h2>
      <p>{{ $t('domains_text_1') }}</p>
      <p>{{ $t('domains_text_2') }}</p>

    </b-col>
    <b-col class="w-100 text-center">
      <dashboard-icon icon="search" :stackscale="6" class="mb-2"/>
      <br>
      <h2>{{ $t('scan') }}</h2>
      <p>{{ $t('scan_text_1') }}</p>
      <p>{{ $t('scan_text_2') }}</p>
    </b-col>
    <b-col class="w-100 text-center">
      <dashboard-icon icon="file-bar-graph" :stackscale="6" class="mb-2"/>
      <br>
      <h2>{{ $t('report') }}</h2>
      <p>{{ $t('report_text_1') }}</p>
      <p>{{ $t('report_text_2') }}</p>
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
<i18n>
{
  "en": {
    "domains": "Manage domains",
    "domains_text_1": "Manage thousands of domains with labels.",
    "domains_text_2": "Convenient importing with spreadsheet or comma separated.",
    "scan": "Bulk scan",
    "scan_text_1": "Scan domains on dozens of modern internet standerds.",
    "scan_text_2": "Receive mails with reports when scans are finished.",
    "report": "Report",
    "report_text_1": "Browse extensive reports with graphs and metrics per category.",
    "report_text_2": "Publish a report online or via a spreadsheet."
  },
  "nl": {
    "domains": "Beheer domeinen",
    "domains_text_1": "Beheer tot duizenden domeinen tegelijkertijd met labels.",
    "domains_text_2": "Handig domeinen importeren met spreadsheet of kommagescheiden.",
    "scan": "Bulk scan",
    "scan_text_1": "Scan domeinen op tientallen moderne internetstandaarden.",
    "scan_text_2": "Ontvang een mail wanneer het rapport klaar staat, met rapportage.",
    "report": "Rapporteer",
    "report_text_1": "Bekijk een uitgebreide rapportage met grafieken en gegevens per categorie.",
    "report_text_2": "Publiceer het rapport online of via een spreadsheet."
  }
}
</i18n>