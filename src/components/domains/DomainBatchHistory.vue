<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
  <section v-if="!listId || visibleBatches.length || response">
    <div class="batch-history-header">
      <h4>{{ $t(listId ? 'domain.batch.pending' : 'domain.batch.recent') }}</h4>
      <button class="btn btn-outline-secondary btn-sm" @click="refresh">
        {{ $t('domain.batch.refreshImports') }}
      </button>
    </div>
    <server-response v-if="response" :response="response" />
    <details
      class="batch-history-item"
      v-for="batch in visibleBatches"
      :key="batch.id"
      @toggle="opened[batch.id] = $event.target.open"
    >
      <summary>
        <span class="batch-summary-content">
          <span class="batch-filename">{{ batch.filename || $t('domain.batch.domains') }}</span>
          <span class="batch-status">{{ $t(`domain.batch.status.${batch.status}`) }}</span>
          <time :datetime="batch.created_on">{{
            new Date(batch.created_on).toLocaleString()
          }}</time>
        </span>
      </summary>
      <div class="batch-history-content">
        <DomainBatchProgress
          v-if="opened[batch.id]"
          :batch="batch"
          :current-list-id="listId"
          embedded
          @updated="batch.status = $event.status"
          @completed="finish(batch, 'completed')"
          @cancelled="finish(batch, 'cancelled')"
        />
      </div>
    </details>
  </section>
</template>
<script>
import http from '@/httpclient'
import { requestError } from '@/requestError'
import DomainBatchProgress from './DomainBatchProgress.vue'
export default {
  components: { DomainBatchProgress },
  props: { listId: { type: Number, default: null } },
  emits: ['added'],
  data() {
    return { batches: [], response: null, opened: {} }
  },
  computed: {
    visibleBatches() {
      return this.listId
        ? this.batches.filter((batch) => !['completed', 'cancelled'].includes(batch.status))
        : this.batches
    },
  },
  mounted() {
    this.refresh()
  },
  methods: {
    finish(batch, status) {
      batch.status = status
      this.$emit('added')
    },
    async refresh() {
      try {
        const { data } = await http.get('/api/v1/urllists/domain-batches', {
          params: {
            urllistId: this.listId || undefined,
            pendingOnly: this.listId ? true : undefined,
          },
        })
        this.batches = data
        this.response = null
      } catch (error) {
        this.response = requestError(error)
      }
    },
  },
}
</script>

<style scoped>
.batch-history-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem 1.5rem;
  margin: 0.5rem 0 1.5rem;
}
.batch-history-header h4,
.batch-history-header > button {
  margin: 0;
}
.batch-history-item {
  margin: 0.85rem 0;
  border: 0;
  border-radius: 0.5rem;
  background: #fff;
  box-shadow: 0 0.25rem 1rem rgb(0 0 0 / 8%);
}
.batch-history-item summary {
  padding: 1rem 1.25rem;
  cursor: pointer;
  line-height: 1.6;
  color: #575757;
}
.batch-history-item summary::marker {
  color: #037584;
}
.batch-summary-content {
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
  vertical-align: middle;
  max-width: calc(100% - 1.5rem);
}
.batch-filename {
  font-weight: bold;
  overflow-wrap: anywhere;
}
.batch-status {
  padding: 0.15rem 0.6rem;
  border-radius: 20px;
  background: #eef6f9;
  color: #037584;
  font-size: 0.9rem;
}
.batch-history-item time {
  font-size: 0.85rem;
  color: #666;
}
.batch-history-content {
  padding: 0 1rem 1rem;
}
</style>
