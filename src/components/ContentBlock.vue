<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
    <b-container
      class="p-3 mb-3 mt-2 rounded bg-white"
      :class="{'content-block-full-width': fullWidth}"
      fluid="xl"
    >
        <b-row>
            <b-col>
                <slot>
                    Sample text.
                </slot>
            </b-col>
        </b-row>
    </b-container>
</template>
<script>
export default {
  props: {
    fullWidth: {type: Boolean, default: false},
  },
}
</script>

<style scoped>
@media (min-width: 1200px) {
  .content-block-full-width {
    position: relative;
    left: 50%;
    width: calc(100vw - 2rem);
    max-width: calc(100vw - 2rem);
    transform: translateX(-50%);
  }
}

@media print {
  .content-block-full-width {
    left: auto;
    width: 100%;
    max-width: 100%;
    transform: none;
  }
}
</style>
