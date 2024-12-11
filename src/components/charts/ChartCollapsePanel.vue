<!-- SPDX-License-Identifier: Apache-2.0 -->
<style scoped>
.fixed_height {
  height: 500px;
  min-height: 500px;
}

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
      <div class="w-100 overflow-auto position-relative fixed_height">
        <div class="chart-container w-100 position-relative fixed_height">
          <slot name="chart_content">
            Default Content
          </slot>
        </div>
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
