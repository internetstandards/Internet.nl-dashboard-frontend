<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>

    <b-row>
      <b-col cols="3">
        ⬇️ {{$t("report.download.title", [report.id, report.urllist_name])}}
      </b-col>
      <b-col>
        <i-bi-file-earmark-spreadsheet/> <a :href="make_downloadlink(report.id, 'xlsx')">{{ $t("report.download.xlsx") }}</a>
      </b-col>
      <b-col>
        <i-bi-file-earmark-spreadsheet/> <a :href="make_downloadlink(report.id, 'ods')">{{ $t("report.download.ods") }}</a>
      </b-col>
      <b-col>
       <i-bi-file-text/> <a :href="make_downloadlink(report.id, 'csv')">{{ $t("report.download.csv") }}</a>
      </b-col>
    </b-row>

</template>
<script>
export default {
  props: {
    report: {type: Object, required: true}
  },
  methods: {
    make_downloadlink: function (report_id, filetype) {
      return `${import.meta.env.VITE_VUE_APP_DJANGO_PATH}/data/report/spreadsheet/${report_id}/${filetype}`
    },
  }
}
</script>
