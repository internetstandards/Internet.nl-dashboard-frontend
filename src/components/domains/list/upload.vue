<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
  <b-modal size="lg" :visible="visible" @hidden="cancel()" header-bg-variant="info" header-text-variant="light" no-fade
           scrollable>
    <h3 slot="modal-title">📝 {{ $t("title") }}</h3>
    <div slot="default" style="min-height: 50vh;">

      <server-response :response="response" :message="$t(response.message)"></server-response>

      <p>{{ $t('introduction') }}</p>

      <table class="mb-4">
        <tr>
          <th></th>
          <th>{{ $t("empty_file") }}</th>
          <th>{{ $t("file_with_example_data") }}</th>
        </tr>
        <tr>
          <td>
            {{ $t("open_document_spreadsheet") }}
          </td>
          <td>
            <a href="/static_frontend/sample_spreadsheets/libre_office_spreadsheet_empty.ods">Empty.ods</a>
          </td>
          <td>
            <a href="/static_frontend/sample_spreadsheets/libre_office_spreadsheet_with_example_data.ods">Example.ods</a>
          </td>
        </tr>
        <tr>
          <td>
            {{ $t("microsoft_office_excel") }}
          </td>
          <td>
            <a href="/static_frontend/sample_spreadsheets/microsoft_office_spreadsheet_empty.xlsx">Empty.xlsx</a>
          </td>
          <td>
            <a href="/static_frontend/sample_spreadsheets/microsoft_office_spreadsheet_with_example_data.xlsx">Example.xlsx</a>
          </td>
        </tr>
      </table>

      <b-alert variant="danger" show>{{ $t('warning') }}</b-alert>

      <input
          type="file"
          ref="file"
          id="file"
          v-on:change="handleFileUpload()"
          name="file"
          accept="text/csv, application/vnd.oasis.opendocument.spreadsheet, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      >

    </div>
    <div slot="modal-footer">
      <button class='altbutton' @click="cancel()">{{ $t("cancel") }}</button>
      &nbsp;
      <button class="modal-default-button defaultbutton border-danger" @click="upload()">
        {{ $t("ok") }}
      </button>
    </div>
  </b-modal>
</template>

<script>
import sharedMessages from "@/components/translations/dashboard";
import http from "@/httpclient";

export default {
  name: "upload-domains",
  i18n: {
    sharedMessages: sharedMessages,
  },
  props: {
    list: {
      type: Object,
    },
    visible: {
      type: Boolean,
    }
  },
  data: function () {
    return {
      file: '',
      response: {}
    }
  },
  methods: {
    cancel: function () {
      this.$emit('cancel')
    },
    handleFileUpload() {
      this.file = this.$refs.file.files[0];
      console.log('>>>> 1st element in files array >>>> ', this.file);
    },
    upload: function () {

      let formData = new FormData();
      formData.append('file', this.file);

      http.post(`/data/urllist/upload/${this.list.id}/`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          },
      ).then(server_response => {
        this.response = server_response.data;
        if (server_response.data.success) {
          this.$emit("done")
        }
      });
    },
  },
  mounted: function () {
    this.response = {};
  }
}
</script>

<i18n>
{
  "en": {
    "title": "Upload domains (overwrite)",
    "cancel": "Cancel",
    "ok": "Overwrite domains",
    "warning": "Warning: Uploading a spreadsheet of domains will overwrite all domains in this list. This cannot be undone. Make you have downloaded a copy of this list in advance. A copy can be made with the 'Download domains' button on the domain list.",
    "too_many_domains": "The amount of domains in this list exceeds the total amount of domains allowed in a list.",
    "introduction": "It's possible to upload large amounts of internet addresses and lists using spreadsheets. To do so, please expand on the example spreadsheets listed below. This shows how the data has to be structured. Examples with and without data are provided as Open Document Spreadsheet, Microsoft Office Excel and Comma Separated. Below are some example files that specify the exact format.",
    "empty_file": "Empty file",
    "file_with_example_data": "File with example data",
    "open_document_spreadsheet": "Open Document Spreadsheet (Libre Office)",
    "microsoft_office_excel": "Excel Spreadsheet (Microsoft Office)"
  },
  "nl": {
    "title": "Domeinen uploaden (overschrijven)",
    "cancel": "Annuleer",
    "ok": "Overschrijf domeinen",
    "warning": "Let op: het uploaden van domeinen vervangt alle domeinen in deze lijst. Dit kan niet ongedaan worden gemaakt. Zorg dus dat je een backup heb gedownload van deze lijst. Een kopie is te maken met de 'Domeinen downloaden' knop bij de domeinenlijst.",
    "too_many_domains": "Het aantal domeinen is deze lijst is groter dan is toegestaan.",
    "introduction": "Hiermee is het mogelijk om grote hoeveelheden internet adressen en lijsten toe te voegen. Dit gebeurd met spreadsheets. Begin met het downloaden van de voorbeelden hieronder, deze geven aan wat het juiste formaat is. De voorbeeldbestanden zijn te downloaden in het Open Document formaat, Microsoft Office formaat en Kommagescheiden. Hieronder staan een aantal voorbeeldbestanden waarin het exacte juiste formaat wordt aangegeven.",
    "empty_file": "Empty file",
    "file_with_example_data": "File with example data",
    "open_document_spreadsheet": "Open Document Spreadsheet (Libre Office)",
    "microsoft_office_excel": "Excel Spreadsheet (Microsoft Office)"
  }
}
</i18n>