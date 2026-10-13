<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
  <b-alert v-if="hasResponse" :model-value="show || force_show"
           @update:model-value="show = $event" :variant="failed ? 'danger' : 'success'" dismissible>
    <h2>{{ failed ? '❌' : '✅' }} {{ $t(`app.server-response.${failed ? 'error' : 'success'}`) }}</h2>
    <p role="alert">{{ responseText }}</p>
  </b-alert>
</template>
<script>
import {problemTranslationKey} from "@/apiProblems";

export default {
  data() {
    return {show: false}
  },
  computed: {
    hasResponse() {
      return typeof this.response?.status === 'number'
    },
    failed() {
      return this.response?.status === 0 || this.response?.status >= 400
    },
    responseText() {
      if (!this.failed) return this.message || this.$t('app.server-response.success')
      const problem = this.response?.data || {}
      const key = problemTranslationKey(problem.type)
      if (key && this.$te?.(key)) return this.$t(key)
      return problem.detail || problem.title || this.$t('app.server-response.error')
    },
  },
  watch: {
    response: {
      immediate: true,
      handler() { this.show = this.hasResponse },
    },
  },
  props: {
    response: {type: Object, default: null},
    message: {type: String, default: ''},
    force_show: {type: Boolean, default: false},
  },
}
</script>
<style scoped>
h2 { font-size: 1.5em; }
p { margin-bottom: 0; }
</style>
