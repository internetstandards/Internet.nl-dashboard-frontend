<!-- SPDX-License-Identifier: Apache-2.0 -->
<style scoped>
.fixed_height {
  height: 500px;
  min-height: 500px;
}
</style>
<template>
  <collapse-panel :title='title' :custom_title_class="`level_${level}`">
    <div slot="content">
      <div class="w-100 overflow-auto position-relative fixed_height">
        <div class="chart-container w-100 position-relative fixed_height">
          <slot name="chart_content">
            Default Content
          </slot>
        </div>
      </div>
    </div>
  </collapse-panel>
</template>

<script>

import CollapsePanel from '@/components/CollapsePanel'

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
