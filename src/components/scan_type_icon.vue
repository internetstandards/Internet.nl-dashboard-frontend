<!-- SPDX-License-Identifier: Apache-2.0 -->
<style scoped>
  .mail_icon {
    background: url("/static_frontend/images/vendor/internet_nl/icon-emailtest.svg");
    height: 1em;
    width: 1em;
    background-size: cover;
    display: inline-block;
  }
  .web_icon {
    background: url("/static_frontend/images/vendor/internet_nl/icon-website-test.svg");
    height: 1em;
    width: 1em;
    background-size: cover;
    display: inline-block;
  }
</style>

<template>
  <span>
    <span class="web_icon" v-if="type === 'web'" />
    <span class="mail_icon" v-if="type === 'mail'" />
  </span>
</template>

<script>
export default {
  name: "scan_type_icon",
  props: {
    type: {type: String, requred: true}
  }
}
</script>
