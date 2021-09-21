<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
  <collapse-panel :title='title' :custom_title_class="`level_${level}`">
    <div slot="content">
      <div style="overflow: auto; width: 100%; height: 500px; position: relative;">
        <div class="chart-container" style="position: relative; height: 500px; min-height: 500px; width: 100%;">
          <slot name="chart_content">
            Default Content
          </slot>
        </div>
      </div>
    </div>
  </collapse-panel>
</template>

<script>
export default {
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
