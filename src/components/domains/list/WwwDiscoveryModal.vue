<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
  <b-modal :id="id" @ok="$emit('ok')" header-bg-variant="info"
           header-text-variant="light" no-fade scrollable size="lg" :ok-title='$t("domain.www-discovery-modal.ok")' :cancel-title='$t("domain.www-discovery-modal.cancel")'>
    <h3 slot="modal-title">{{ $t("domain.www-discovery-modal.title") }}</h3>
    <div slot="default">
      <p>{{ $t("domain.www-discovery-modal.message") }}</p>
    </div>
  </b-modal>
</template>
<script>

export default {
  name: "SubdomainDiscoveryModal",
  props: {
    id: {type: String}
  }
}
</script>
