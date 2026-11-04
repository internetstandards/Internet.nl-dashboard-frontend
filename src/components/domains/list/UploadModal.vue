<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
  <b-modal size="lg" @hidden="$emit('cancel')" header-bg-variant="info" header-text-variant="light" no-close-on-backdrop no-fade scrollable>
    <template #header><h4>📝 {{ $t('domain.list.upload.title') }}</h4></template>
    <p>{{ $t('domain.batch.merge') }}</p>
    <p>
      <a href="/static_frontend/sample_spreadsheets/libre_office_spreadsheet_with_example_data.ods">Example.ods</a>
      · <a href="/static_frontend/sample_spreadsheets/microsoft_office_spreadsheet_with_example_data.xlsx">Example.xlsx</a>
    </p>
    <DomainBatchForm :list="list" mode="spreadsheet" auto-upload @accepted="$emit('accepted')" @added="$emit('added')" />
    <template #footer>
      <b-button variant="secondary" @click="$emit('cancel')">{{ $t('domain.batch.close') }}</b-button>
    </template>
  </b-modal>
</template>
<script>
import DomainBatchForm from '../DomainBatchForm.vue'
export default {
  components: {DomainBatchForm},
  props: {list: {type: Object, required: true}},
  emits: ['accepted', 'added', 'cancel'],
}
</script>
