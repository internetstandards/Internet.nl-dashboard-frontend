<template>
  <content-block class="do-not-print">
    <collapse-panel :title='`⬇️  ${$t("title", [report_id])} `' class="do-not-print">
      <div slot="content">
        <p>{{ $t("intro") }}</p>
        <ul style="list-style: none !important;">
          <li><a :href="make_downloadlink(report_id, 'xlsx')">⬇️ {{ $t("xlsx") }}</a></li>
          <li><a :href="make_downloadlink(report_id, 'ods')">⬇️ {{ $t("ods") }}</a></li>
          <li><a :href="make_downloadlink(report_id, 'csv')">⬇️ {{ $t("csv") }}</a></li>
        </ul>
      </div>
    </collapse-panel>
  </content-block>
</template>
<script>
export default {
  props: {
    report_id: {type: Number, required: true}
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
    "title": "Download metrics of report {0}",
    "intro": "Report data is available in the following formats:",
    "xlsx": "Excel Spreadsheet (Microsoft Office), .xlsx",
    "ods": "Open Document Spreadsheet (Libre Office), .ods",
    "csv": "Comma Separated (for programmers), .csv"
  },
  "nl": {
    "title": "Download meetwaarden van rapport {0}",
    "intro": "De data in dit rapport is beschikbaar in de volgende formaten:",
    "xlsx": "Excel Spreadsheet (voor o.a. Microsoft Office), .xlsx",
    "ods": "Open Document Spreadsheet (voor o.a. Libre Office), .ods",
    "csv": "Comma Separated (voor programmeurs), .csv"
  }
}
</i18n>