<!-- SPDX-License-Identifier: Apache-2.0 -->
<style scoped>
.level_2 {

  font-size: 0.9em;
}

.level_3 {
  padding-left: 2em;
  font-size: 0.8em;
}

</style>
<template>
  <collapse-panel :title='title' :class="`level_${level}`" variant="warning" class="mb-2">
    <template #content>
      <div class="w-100 position-relative">
        <slot name="chart_content">
          Default Content
        </slot>
      </div>
    </template>
  </collapse-panel>
</template>

<script>

import CollapsePanel from '@/components/CollapsePanel.vue'

export default {
  components: {
    CollapsePanel
  },
  name: "chart_collapse_panel",
  props: {
    title: {
      type: String,
      default: ""
    },
    level: {
      type: Number,
      default: 1,
    }
  }
}
</script>
