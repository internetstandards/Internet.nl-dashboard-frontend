<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
  <b-modal :id="id" @ok="$emit('ok')" @close="$emit('close')"  header-bg-variant="info" header-text-variant="light" no-fade scrollable size="lg">

    <template #header><h4>{{ $t("domain.www-discovery-modal.title") }}</h4></template>
    <template #default>
      <p>{{ $t("domain.www-discovery-modal.message") }}</p>
    </template>
    <template #footer>
      <b-button variant="secondary" @click="$emit('close');">{{ $t("domain.www-discovery-modal.cancel") }}</b-button>
      &nbsp;
      <b-button variant="success" @click="$emit('ok')">{{ $t("domain.www-discovery-modal.ok") }}</b-button>
    </template>
  </b-modal>
</template>
<script>

export default {
  name: "WwwDiscoveryModal",
  props: {
    id: {type: String}
  }
}
</script>
