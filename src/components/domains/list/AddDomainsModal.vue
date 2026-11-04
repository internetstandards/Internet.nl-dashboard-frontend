<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
  <b-modal @hidden="$emit('cancel')" header-bg-variant="info" header-text-variant="light" no-close-on-backdrop no-fade scrollable size="lg">
    <template #header><h4>🌐 {{ $t('domain.list.add-domains.title') }}</h4></template>
    <DomainBatchForm :list="list" @accepted="$emit('accepted')" @added="$emit('added')" />
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
