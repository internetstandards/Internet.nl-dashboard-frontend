<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
  <div>
    <b-button variant="success" size="sm" :disabled="loading" @click="request">
      🔎 {{ $t('domain.www-discovery.find-www-subdomains') }}
    </b-button>
    <server-response v-if="response" :response="response" />
    <DomainBatchProgress v-if="batch" :batch="batch" :current-list-id="list_id" @completed="$emit('finished')" @cancelled="$emit('finished')" />
  </div>
</template>
<script>
import http from '@/httpclient'
import {requestError} from '@/requestError'
import DomainBatchProgress from '../DomainBatchProgress.vue'
export default {
  components: {DomainBatchProgress},
  props: {list_id: {type: Number, required: true}},
  emits: ['finished'],
  data() {return {loading: false, response: null, batch: null}},
  methods: {
    async request() {
      if (this.loading) return
      this.loading = true
      this.response = null
      try {
        const {data} = await http.post(`/api/v1/urllists/${this.list_id}/www-subdomain-discovery`)
        this.batch = data
      } catch (error) {this.response = requestError(error)}
      finally {this.loading = false}
    },
  },
}
</script>
