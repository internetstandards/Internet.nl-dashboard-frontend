<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
  <div>
    <page-header
      :title="$t('domain.spreadsheet-upload.upload.bulk_data_uploader.title')"
      :subtitle="$t('domain.spreadsheet-upload.upload.bulk_data_uploader.introduction')"
    >
      <template #icon>
        <i-bi-file-earmark-spreadsheet />
      </template>
      <template #actions>
        <router-link to="/domains" custom v-slot="{ navigate }">
          <b-button variant="warning" @click="navigate" @keypress.enter="navigate">
            📚 {{ $t("domain.spreadsheet-upload.back_to_domains") }}
          </b-button>
        </router-link>
      </template>
    </page-header>
    <content-block>
      <table>
        <tbody>
        <tr>
          <th></th>
          <th>{{ $t("domain.spreadsheet-upload.upload.empty_file") }}</th>
          <th>{{ $t("domain.spreadsheet-upload.upload.file_with_example_data") }}</th>
        </tr>
        <tr>
          <td>
            {{ $t("domain.spreadsheet-upload.upload.open_document_spreadsheet") }}
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
            {{ $t("domain.spreadsheet-upload.upload.microsoft_office_excel") }}
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
      <p>{{ $t('domain.batch.spreadsheetHelp') }}</p>
      <DomainBatchForm mode="spreadsheet" auto-upload @accepted="accepted" @added="refreshLists" />
    </content-block>
    <content-block><DomainBatchHistory ref="history" @added="refreshLists" /></content-block>
  </div>
</template>
<script>
import DomainBatchForm from './DomainBatchForm.vue'
import DomainBatchHistory from './DomainBatchHistory.vue'
import {dashboardStore} from '@/dashboardStore'
export default {
  components: {DomainBatchForm, DomainBatchHistory},
  props: {max_urls: {type: Number, required: true}, max_lists: {type: Number, required: true}},
  methods: {
    accepted() {this.$refs.history.refresh()},
    refreshLists() {dashboardStore().set_uploads_performed(Date.now())},
  },
}
</script>
