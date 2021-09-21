<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
  <p>
    <template v-if="differences.both_are_equal">
      {{ $t("equal") }}
      {{ $t("both_list_contain_n_urls", [differences.number_of_urls_in_urllist]) }}
    </template>
    <template v-else>
      ⚠️ {{ $t("not_equal") }}
      <template v-if="differences.number_of_urls_in_urllist === differences.number_of_urls_in_report">
        {{ $t("both_list_contain_n_urls", [differences.number_of_urls_in_urllist]) }}
      </template>
      <template v-if="differences.number_of_urls_in_urllist !== differences.number_of_urls_in_report">
        {{
          $t("report_contains_n_urllist_contains_n", [differences.number_of_urls_in_report, differences.number_of_urls_in_urllist])
        }}
      </template>
      <template v-if="differences.in_report_but_not_in_urllist !== ''">
        {{ $t("in_report_but_not_in_urllist") }}:
        {{ differences.in_report_but_not_in_urllist }}.
      </template>
      <template v-if="differences.in_urllist_but_not_in_report !== ''">
        {{ $t("in_urllist_but_not_in_report") }}:
        {{ differences.in_urllist_but_not_in_report }}.
      </template>
    </template>
  </p>
</template>

<script>
import http from "@/httpclient";

export default {
  name: "differences_to_current_list",

  props: {
    report_id: {type: Number, required: true}
  },

  data() {
    return {
      differences: {},
    }
  },

  mounted() {
    this.load();
  },

  methods: {
    load(){
      http.get(`/data/report/differences_compared_to_current_list/${this.report_id}/`).then(data => {
        this.differences = data.data;
      });
    }

  },

  watch: {
    report_id() {
      this.load();
    }
  }
}
</script>

<style scoped>

</style>

<i18n>
{
  "en": {
    "equal": "The domains in this report are equal to the domains in the associated list of domains.",
    "not_equal": "The domains in this report differ from the domains in the associated list of domains.",
    "both_list_contain_n_urls": "Both the report and the associated list of domains contain {0} domains.",
    "report_contains_n_urllist_contains_n": "This report contains {0} domains, while the associated list contains {1}.",
    "in_report_but_not_in_urllist": "Domains in this report, but not in the list",
    "in_urllist_but_not_in_report": "Domains not in this report"
  },
  "nl": {
    "equal": "Domeinen in dit rapport zijn gelijk aan de domeinen in de bijbehorende lijst.",
    "not_equal": "Domeinen in dit rapport wijken af van de domeinen in de bijbehorende lijst.",
    "both_list_contain_n_urls": "Zowel de rapportage als de bijbehorende lijst bevatten {0} domeinen.",
    "report_contains_n_urllist_contains_n": "Deze rapportage bevat {0} domeinen terwijl de bijbehorende lijst {1} domeinen bevat.",
    "in_report_but_not_in_urllist": "Domeinen in het rapport, maar niet in de bijbehorende lijst",
    "in_urllist_but_not_in_report": "Domeinen niet in het rapport"
  }
}
</i18n>