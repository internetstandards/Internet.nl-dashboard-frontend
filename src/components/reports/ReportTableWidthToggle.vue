<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
  <div class="d-none d-xl-flex justify-content-end mb-3 do-not-print">
    <b-button
      type="button"
      size="sm"
      variant="outline-secondary"
      @click="$emit('update:modelValue', !modelValue)"
    >
      <i-bi-fullscreen-exit v-if="modelValue" aria-hidden="true" />
      <i-bi-arrows-fullscreen v-else aria-hidden="true" />
      <span class="ms-1">
        {{ $t(modelValue ? 'report.page.use_standard_width' : 'report.page.use_full_width') }}
      </span>
    </b-button>
  </div>
</template>

<script lang="ts">
export default {
  name: 'ReportTableWidthToggle',
  emits: ['update:modelValue'],
  props: {
    modelValue: {type: Boolean, default: false},
  },
}
</script>
