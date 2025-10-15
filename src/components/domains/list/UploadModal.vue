<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
  <b-modal size="lg" @hidden="cancel()" header-bg-variant="info" header-text-variant="light" no-fade scrollable>
    <template #header><h4>📝 {{ $t("domain.list.upload.title") }}</h4></template>
    <template #default>
      <div style="min-height: 50vh;">

      <server-response :response="response" :message="$t(response.message)" v-if="response.message"></server-response>

      <p>{{ $t("domain.list.upload.introduction") }}</p>

      <table class="mb-4">
        <tbody>
        <tr>
          <th></th>
          <th>{{ $t("domain.list.upload.empty_file") }}</th>
          <th>{{ $t("domain.list.upload.file_with_example_data") }}</th>
        </tr>
        <tr>
          <td>
            {{ $t("domain.list.upload.open_document_spreadsheet") }}
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
            {{ $t("domain.list.upload.microsoft_office_excel") }}
          </td>
          <td>
            <a href="/static_frontend/sample_spreadsheets/microsoft_office_spreadsheet_empty.xlsx">Empty.xlsx</a>
          </td>
          <td>
            <a href="/static_frontend/sample_spreadsheets/microsoft_office_spreadsheet_with_example_data.xlsx">Example.xlsx</a>
          </td>
        </tr>
        </tbody>
      </table>

      <b-alert variant="danger" :model-value="true">{{ $t("domain.list.upload.warning") }}</b-alert>

      <input
          type="file"
          ref="file"
          id="file"
          v-on:change="handleFileUpload()"
          name="file"
          accept="text/csv, application/vnd.oasis.opendocument.spreadsheet, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      >
    </div>
    </template>
    <template #footer>
      <b-button variant="secondary" @click="cancel()">{{ $t("domain.list.upload.cancel") }}</b-button>
      &nbsp;
      <b-button variant="danger" @click="upload()">
        {{ $t("domain.list.upload.ok") }}
      </b-button>
    </template>
  </b-modal>
</template>

<script>
import http from "@/httpclient";

export default {
  name: "upload-domains",
  props: {
    list: {
      type: Object,
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

      http.post(`/data/urllist/upload/${this.list.id}`, formData, {
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
