<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>

    <b-row>
      <b-col cols="3">
        ⬇️ {{$t("title", [report.id, report.urllist_name])}}
      </b-col>
      <b-col>
        <b-icon icon="file-earmark-spreadsheet"/> <a :href="make_downloadlink(report.id, 'xlsx')">{{ $t("xlsx") }}</a>
      </b-col>
      <b-col>
        <b-icon icon="file-earmark-spreadsheet"/> <a :href="make_downloadlink(report.id, 'ods')">{{ $t("ods") }}</a>
      </b-col>
      <b-col>
       <b-icon icon="file-text"/> <a :href="make_downloadlink(report.id, 'csv')">{{ $t("csv") }}</a>
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
      return `${process.env.VUE_APP_DJANGO_PATH}/data/download-spreadsheet/${report_id}/${filetype}/`
    },
  }
}
</script>
<i18n>
{
  "en": {
    "title": "Download #{0} as",
    "intro": "Report data is available in the following formats:",
    "xlsx": "Microsoft Excel (xlsx)",
    "ods": "Open Spreadsheet (ods)",
    "csv": "Comma Separated (csv)"
  },
  "nl": {
    "title": "Download #{0} als",
    "intro": "De data in dit rapport is beschikbaar in de volgende formaten:",
    "xlsx": "Microsoft Excel (xlsx)",
    "ods": "Open Document (ods)",
    "csv": "Kommagescheiden (csv)"
  }
}
</i18n>