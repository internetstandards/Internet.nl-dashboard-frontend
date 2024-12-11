<!-- SPDX-License-Identifier: Apache-2.0 -->
<style scoped>
.panel-content {
  padding-top: 1em;
}

.collapse_panel {
  border-top: 0px solid gray;
  border-bottom: 0px solid gray;

}

.panel-title {
  font-size: 1.0em;
  font-weight: normal;
}

.panel-title, button {
  text-decoration: underline dotted;
}


.animate_opening {
  transition: transform 200ms linear;
  transform: rotate(0deg);
  display: inline-block;
}

.animate_opening.open {
  transform: rotate(180deg);
  transition: transform 300ms linear;
}
</style>

<template>
  <div class="collapse_panel">


    <BCollapse id="my-collapse">
      <template #header="{visible, toggle, id}">

        <b-button :variant="variant" :aria-expanded="visible" :aria-controls="id" @click="() => {toggle(); status_visible = !status_visible}">
          <span :class="`panel-title`">
            <div :class="status_visible ? 'animate_opening open' : 'animate_opening'">
              <img src="/static_frontend/images/vendor/internet_nl/push-open.png" alt="open panel" height="15px">
            </div>
            {{ title }}
          </span>
        </b-button>
      </template>
      <!-- Content here -->
      <div class="panel-content">
        <slot name="content">
          default content
        </slot>
      </div>
    </BCollapse>

  </div>
</template>

<script>
export default {
  name: "collapse_panel",
  mounted: function () {
    // support being open on start using :visible.
    this.status_visible = this.visible;
  },
  data: function () {
    return {
      status_visible: false,
    }
  },
  props: {
    title: {
      type: String,
      default: ""
    },
    visible: {
      type: Boolean,
      default: false,
    },
    variant: {
      type: String,
      default: "info"
    }
  }

}
</script>
