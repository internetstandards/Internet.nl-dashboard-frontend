<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
  <p v-if="differences.number_of_urls_in_urllist">
    <template v-if="differences.both_are_equal">
      {{ $t("report.differences.equal") }}
      {{ $t("report.differences.both_list_contain_n_urls", [differences.number_of_urls_in_urllist]) }}
    </template>
    <template v-else>
      ⚠️ {{ $t("report.differences.not_equal") }}
      <template v-if="differences.number_of_urls_in_urllist === differences.number_of_urls_in_report">
        {{ $t("report.differences.both_list_contain_n_urls", [differences.number_of_urls_in_urllist]) }}
      </template>
      <template v-if="differences.number_of_urls_in_urllist !== differences.number_of_urls_in_report">
        {{
          $t("report.differences.report_contains_n_urllist_contains_n", [differences.number_of_urls_in_report, differences.number_of_urls_in_urllist])
        }}
      </template>
      <template v-if="differences.in_report_but_not_in_urllist !== ''">
        {{ $t("report.differences.in_report_but_not_in_urllist") }}:
        {{ differences.in_report_but_not_in_urllist }}.
      </template>
      <template v-if="differences.in_urllist_but_not_in_report !== ''">
        {{ $t("report.differences.in_urllist_but_not_in_report") }}:
        {{ differences.in_urllist_but_not_in_report }}.
      </template>
    </template>
  </p>
  <p v-else>
    {{$t("report.differences.retrieving_differences")}}
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
