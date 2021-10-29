<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
  <div>
    <h2>
        📊 <span v-if="show_application_links">#{{ reports[0].id }} - </span>{{ reports[0].urllist_name }}
    </h2>
    <applied-tags/>
    <donut class="mr-2 d-inline-block float-left col-2" :data="{'score': reports[0].average_internet_nl_score, 'rest': 100-reports[0].average_internet_nl_score}" :axis="['score', 'rest']" :tooltip="false" :datalabels="false" :height='100' :elements="['donut']" />
    <span>{{ $t("type_of_scan_performed") }}:
      <scan-type-icon :type="reports[0].report_type" />

      {{ reports[0].report_type }}<br>
      {{ $t("number_of_domains") }}: {{reports[0].total_urls }}<br>
      {{ $t("data_from") }} {{ humanize_date(reports[0].at_when) }}<br>
        <template v-if="show_application_links">
      📘 <router-link :to="{ name: 'numbered_lists', params: { list: reports[0].urllist_id }}">
        {{reports[0].urllist_name }}
        </router-link><br>
             </template>
    </span><br>

    <template v-if="reports.length > 1">
      <div v-for="report in reports"  class="pl-1" :key="report.id">
        <!-- Skip the first report -->
        <template v-if="report.id !== reports[0].id">
          <h3>{{ $t("compared_to") }}: <span v-if="show_application_links">#{{ report.id }} - </span>{{ report.urllist_name }}</h3>
          <span>
            {{ $t("number_of_domains") }}: {{ report.total_urls }}<br>
            {{ $t("data_from") }}: {{ humanize_date(report.at_when) }}<br>
              <template v-if="show_application_links">
            📘 <router-link :to="{ name: 'numbered_lists', params: { list: report.urllist_id }}">
            {{report.urllist_name }}</router-link><br>
                  </template>
          </span>
        </template>
      </div>
    </template>

    <template v-if="reports.length > 2">
      <p class="pt-2">⚠️ {{ $t("only_graphs") }}</p>
    </template>

  </div>
</template>
<script>

import ScanTypeIcon from "@/components/ScanTypeIcon";
import Donut from "@/components/charts/donut";
import AppliedTags from "@/components/reports/AppliedTags";
export default {
  components: {AppliedTags, Donut, ScanTypeIcon},
  props: {
    reports: {type: Array, required: true},
      show_application_links: {type: Boolean, default: true, required:false}
  },
}

</script>

<i18n>
{
  "en": {
    "type_of_scan_performed": "Type of rapport",
    "compared_to": "Compared to",
    "number_of_domains": "Number of domains",
    "data_from": "Data from",
    "only_graphs": "Only showing the timeline and graphs because there are more than two reports selected."
  },
  "nl": {
    "type_of_scan_performed": "Soort rapport",
    "compared_to": "Vergeleken met",
    "number_of_domains": "Aantal domeinen",
    "data_from": "Rapportage van",
    "only_graphs": "Enkel de tijdlijn en grafieken worden getoond omdat er meer dan twee rapporten zijn geselecteerd."
  }
}
</i18n>