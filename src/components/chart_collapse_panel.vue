<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
  <collapse-panel :title='title' :custom_title_class="`level_${level}`">
    <div slot="content">
      <div class="w-100 overflow-auto position-relative" style="height: 500px;">
        <div class="chart-container w-100 position-relative" style="height: 500px; min-height: 500px;">
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
