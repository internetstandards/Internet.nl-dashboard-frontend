<!-- SPDX-License-Identifier: Apache-2.0 -->
<style scoped>
.my_icon {
  height: 1em;
  width: 1em;
  display: inline-block;
}

.mail_icon {
  background: url("/static_frontend/images/vendor/internet_nl/icon-emailtest.svg");
  background-size: cover;

}

.web_icon {
  background: url("/static_frontend/images/vendor/internet_nl/icon-website-test.svg");
  background-size: cover;

}
</style>

<template>
  <span>
    <span class="my_icon web_icon mx-1" v-if="type === 'web' || type === 'all'"/>
    <span class="my_icon mail_icon mx-1" v-if="type === 'mail' || type === 'all'"/>
  </span>
</template>

<script>
export default {
  props: {
    type: {type: String, required: true}
  }
}
</script>
