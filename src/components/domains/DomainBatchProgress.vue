<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
  <section
    v-if="current"
    class="domain-batch"
    :class="{ 'is-embedded': embedded }"
    :aria-busy="loading"
    :aria-label="$t('domain.batch.progress')"
  >
    <h5 v-if="!embedded">{{ current.filename || $t('domain.batch.domains') }}</h5>
    <p v-if="loading" class="batch-loading" role="status">
      <BSpinner small variant="info" aria-hidden="true" />
      {{ $t('app.loading.loading') }}
    </p>
    <BProgress
      v-if="busy && !loading"
      class="batch-progress"
      :class="{ 'is-waiting': indeterminate }"
      :value="indeterminate ? undefined : progressPercentage"
      :max="100"
      :striped="indeterminate"
      :animated="indeterminate"
      height="2rem"
      :aria-label="$t('domain.batch.progress')"
      :aria-valuetext="progressLabel"
    >
      <BProgressBar class="batch-progress-fill" :value="indeterminate ? 100 : progressPercentage" />
      <span class="batch-progress-label" aria-live="polite">{{ progressLabel }}</span>
    </BProgress>
    <ul v-if="resultCounts.length" class="batch-counts">
      <li v-for="result in resultCounts" :key="result.label">
        {{ $t(`domain.batch.${result.label}`, [result.count]) }}
      </li>
    </ul>
    <div
      v-if="['review', 'completed'].includes(current.status) && rejectedCount"
      class="batch-rejections"
    >
      <label :for="`rejection-filter-${current.id}`">{{ $t('domain.batch.filter') }}</label>
      <div class="input-group mb-2">
        <input
          :id="`rejection-filter-${current.id}`"
          v-model="rejectionSearch"
          type="search"
          class="form-control"
          :placeholder="$t('domain.batch.filterPlaceholder')"
          :disabled="loading || acting"
        />
        <button
          v-if="rejectionSearch"
          type="button"
          class="btn btn-outline-secondary"
          :disabled="loading || acting"
          @click="rejectionSearch = ''"
        >
          {{ $t('domain.batch.clearFilter') }}
        </button>
      </div>
      <p v-if="rejectionSearch.trim() && !loading && !response" role="status">
        {{ $t('domain.batch.filterMatches', [filteredRejections.length, rejectedCount]) }}
      </p>
      <p v-if="visibleRejections.length">{{ $t('domain.batch.correct') }}</p>
      <div v-if="visibleRejections.length" class="table-responsive">
        <table class="table table-sm">
          <thead>
            <tr>
              <th scope="col" class="batch-row-number">{{ $t('domain.batch.row') }}</th>
              <th scope="col" class="batch-list-name">{{ $t('domain.batch.list') }}</th>
              <th scope="col">{{ $t('domain.batch.input') }}</th>
              <th scope="col">{{ $t('domain.batch.reason') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in visibleRejections" :key="item.id">
              <td class="batch-row-number">{{ item.row }}</td>
              <td class="batch-list-name">
                <input
                  v-if="!current.target_list"
                  v-model="listCorrections[item.id]"
                  class="form-control"
                  :disabled="loading || acting"
                  :aria-label="$t('domain.batch.correctList', [item.row])"
                />
                <span v-else>{{ item.list_name }}</span>
              </td>
              <td>
                <div class="input-group">
                  <input
                    data-domain
                    v-model="corrections[item.id]"
                    class="form-control"
                    :disabled="loading || acting"
                    :aria-label="$t('domain.batch.correctRow', [item.row])"
                  />
                  <button
                    type="button"
                    class="btn btn-outline-danger"
                    :disabled="loading || acting || !corrections[item.id]"
                    :aria-label="$t('domain.batch.clearRow', [item.row])"
                    :title="$t('domain.batch.clearRow', [item.row])"
                    @click="corrections[item.id] = ''"
                  >
                    <i-bi-trash aria-hidden="true" />
                  </button>
                </div>
              </td>
              <td>{{ item.reason }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="filteredRejections.length > pageSize" class="batch-pagination">
        <button
          class="btn btn-outline-secondary"
          :disabled="offset === 0 || loading || acting"
          @click="page(-1)"
        >
          {{ $t('domain.batch.previous') }}
        </button>
        <span
          >{{ offset + 1 }}–{{ offset + visibleRejections.length }} /
          {{ filteredRejections.length }}</span
        >
        <button
          class="btn btn-outline-secondary"
          :disabled="
            offset + visibleRejections.length >= filteredRejections.length || loading || acting
          "
          @click="page(1)"
        >
          {{ $t('domain.batch.next') }}
        </button>
      </div>
    </div>
    <p
      v-for="capacity in capacityWarnings"
      :key="capacity.name"
      class="alert alert-warning"
      role="alert"
    >
      {{
        $t('domain.batch.limit', [
          capacity.name,
          capacity.new,
          capacity.available,
          capacity.over_limit,
        ])
      }}
    </p>
    <p v-if="current.counts.prepared">
      {{ $t('domain.batch.prepared', [current.counts.prepared]) }}
    </p>
    <p v-if="busy">{{ $t('domain.batch.continues') }}</p>
    <p v-if="current.status === 'failed'" class="alert alert-danger" role="alert">
      {{ current.message }}
    </p>
    <p v-if="current.status === 'completed'" role="status">
      {{
        $t(current.overwrite ? 'domain.batch.replaced' : 'domain.batch.finished', [
          current.counts.added || 0,
        ])
      }}
    </p>
    <p v-if="current.status === 'cancelled'" class="batch-cancelled" role="status">
      {{ $t('domain.batch.cancelled', [current.counts.added || 0]) }}
    </p>
    <nav
      v-if="destinationLists.length"
      class="batch-list-links"
      :aria-label="$t('domain.batch.viewLists')"
    >
      <router-link
        v-for="list in destinationLists"
        :key="list.id"
        class="btn btn-warning"
        :to="{ name: 'domains', query: { open: String(list.id) }, hash: `#${list.id}` }"
      >
        {{ $t('domain.batch.viewList', [list.name]) }} →
      </router-link>
    </nav>
    <div v-if="canOverwrite" class="batch-overwrite">
      <div class="form-check form-switch">
        <input
          :id="`overwrite-${current.id}`"
          v-model="overwriteRequested"
          type="checkbox"
          role="switch"
          class="form-check-input"
          :disabled="loading || acting"
          @change="overwriteRequested || (overwriteConfirmation = '')"
        />
        <label class="form-check-label" :for="`overwrite-${current.id}`">{{
          $t('domain.batch.overwriteLabel')
        }}</label>
      </div>
      <template v-if="overwriteRequested">
        <p>{{ $t('domain.batch.overwriteHelp') }}</p>
        <label :for="`overwrite-word-${current.id}`">{{
          $t('domain.batch.overwritePrompt', [overwriteWord])
        }}</label>
        <input
          :id="`overwrite-word-${current.id}`"
          v-model="overwriteConfirmation"
          class="form-control"
          type="text"
          autocomplete="off"
          autocapitalize="off"
          spellcheck="false"
          :disabled="loading || acting"
        />
        <p v-if="overwriteEnabled" class="mt-2" role="status">
          {{ $t('domain.batch.overwriteEnabled') }}
        </p>
      </template>
    </div>
    <server-response v-if="response" :response="response" />
    <div
      v-if="cancellable || rejections.length || current.resumable || response"
      class="batch-actions"
    >
      <button
        v-if="['review', 'completed'].includes(current.status) && rejections.length"
        class="btn btn-primary"
        :disabled="loading || acting || !hasCorrections"
        @click="submitCorrections"
      >
        {{ $t('domain.batch.checkCorrections') }}
      </button>
      <button
        v-if="cancellable"
        type="button"
        class="btn btn-danger"
        :disabled="loading || acting"
        @click="action('cancel')"
      >
        <i-bi-trash class="me-1" aria-hidden="true" />
        {{ $t('domain.batch.cancel') }}
      </button>
      <button
        v-if="current.status === 'review'"
        :class="['btn', overwriteEnabled ? 'btn-warning' : 'btn-success']"
        :disabled="loading || acting || hasCorrections || (overwriteRequested && !overwriteEnabled)"
        @click="action('confirm')"
      >
        {{ $t(overwriteEnabled ? 'domain.batch.confirmOverwrite' : 'domain.batch.confirm') }}
      </button>
      <button
        v-if="current.resumable"
        class="btn btn-warning"
        :disabled="loading || acting"
        @click="action('retry')"
      >
        {{ $t('domain.batch.retry') }}
      </button>
      <button
        v-if="response"
        class="btn btn-outline-secondary"
        :disabled="loading || acting"
        @click="refresh(true)"
      >
        {{ $t('domain.batch.refresh') }}
      </button>
    </div>
  </section>
</template>
<script>
import { RouterLink } from 'vue-router'
import { BProgress, BProgressBar, BSpinner } from 'bootstrap-vue-next'
import http from '@/httpclient'
import { requestError } from '@/requestError'

export default {
  components: { RouterLink, BProgress, BProgressBar, BSpinner },
  props: {
    batch: { type: Object, required: true },
    currentListId: { type: Number, default: null },
    embedded: { type: Boolean, default: false },
  },
  emits: ['completed', 'cancelled', 'updated'],
  data() {
    return {
      current: this.batch,
      response: null,
      rejections: [],
      rejectionSearch: '',
      corrections: {},
      listCorrections: {},
      offset: 0,
      pageSize: 50,
      timer: null,
      acting: false,
      loading: true,
      stopped: false,
      completedId: this.batch.status === 'completed' ? this.batch.id : null,
      cancelledId: this.batch.status === 'cancelled' ? this.batch.id : null,
      refreshVersion: 0,
      overwriteRequested: false,
      overwriteConfirmation: '',
    }
  },
  computed: {
    filteredRejections() {
      const search = this.rejectionSearch.trim().toLowerCase()
      if (!search) return this.rejections
      return this.rejections.filter((item) =>
        [item.raw_domain, item.domain, item.list_name, item.row, item.reason].some((value) =>
          String(value ?? '')
            .toLowerCase()
            .includes(search),
        ),
      )
    },
    visibleRejections() {
      return this.filteredRejections.slice(this.offset, this.offset + this.pageSize)
    },
    destinationLists() {
      return (this.current.lists || []).filter((list) => list.id !== this.currentListId)
    },
    cancellable() {
      return ['queued', 'running', 'review', 'failed'].includes(this.current.status)
    },
    canOverwrite() {
      return (
        this.current.target_list &&
        this.current.source === 'spreadsheet' &&
        this.current.status === 'review' &&
        !this.current.counts.added &&
        !this.current.counts.existing_done
      )
    },
    overwriteWord() {
      return this.$i18n?.locale === 'nl' ? 'overschrijven' : 'overwrite'
    },
    overwriteEnabled() {
      return (
        this.overwriteRequested &&
        this.overwriteConfirmation.trim().toLowerCase() === this.overwriteWord
      )
    },
    capacityWarnings() {
      if (this.current.status === 'cancelled') return []
      return this.current.limits
        .map((capacity) =>
          this.current.overwrite || this.overwriteEnabled
            ? {
                ...capacity,
                new: capacity.incoming,
                available: capacity.maximum,
                over_limit: Math.max(0, capacity.incoming - capacity.maximum),
              }
            : capacity,
        )
        .filter((capacity) => capacity.over_limit)
    },
    savingReplacement() {
      return (
        this.current.status === 'running' &&
        this.current.stage === 'addition' &&
        this.current.overwrite &&
        this.current.counts.prepared > 0 &&
        !this.current.counts.valid &&
        !this.current.counts.existing
      )
    },
    indeterminate() {
      return (
        this.busy &&
        (this.current.status === 'queued' || !this.current.total || this.savingReplacement)
      )
    },
    progressLabel() {
      if (this.savingReplacement) return this.$t('domain.batch.savingReplacement')
      return this.current.total
        ? `${this.current.processed} / ${this.current.total}`
        : this.busy
          ? this.$t('domain.batch.waiting')
          : this.$t(`domain.batch.status.${this.current.status}`)
    },
    progressPercentage() {
      return this.current.total
        ? Math.min(100, (100 * this.current.processed) / this.current.total)
        : ['completed', 'review'].includes(this.current.status)
          ? 100
          : 0
    },
    busy() {
      return ['queued', 'running'].includes(this.current.status)
    },
    resultCounts() {
      return [
        { label: 'valid', count: this.current.counts.valid || 0 },
        {
          label: 'existing',
          count: (this.current.counts.existing || 0) + (this.current.counts.existing_done || 0),
        },
        { label: 'duplicates', count: this.current.counts.duplicate || 0 },
        { label: 'rejected', count: this.rejectedCount },
      ].filter((result) => result.count > 0)
    },
    rejectedCount() {
      return ['invalid', 'unresolvable', 'limit'].reduce(
        (count, status) => count + (this.current.counts[status] || 0),
        0,
      )
    },
    hasCorrections() {
      return this.rejections.some(
        (item) =>
          this.corrections[item.id] !== item.raw_domain ||
          this.listCorrections[item.id] !== item.list_name,
      )
    },
  },
  watch: {
    rejectionSearch() {
      this.offset = 0
    },
    batch(value) {
      if (value.id !== this.current.id) {
        this.completedId = value.status === 'completed' ? value.id : null
        this.cancelledId = value.status === 'cancelled' ? value.id : null
      }
      clearTimeout(this.timer)
      this.rejectionSearch = ''
      this.current = value
      this.offset = 0
      this.overwriteRequested = false
      this.overwriteConfirmation = ''
      this.refresh(true)
    },
  },
  mounted() {
    this.refresh(true)
  },
  beforeUnmount() {
    this.stopped = true
    clearTimeout(this.timer)
  },
  methods: {
    async refresh(showLoading = false) {
      if (showLoading) this.loading = true
      clearTimeout(this.timer)
      this.timer = null
      const version = ++this.refreshVersion
      const id = this.current.id
      try {
        const { data } = await http.get(`/api/v1/urllists/domain-batches/${id}`)
        if (this.stopped || this.current.id !== id || version !== this.refreshVersion) return
        this.current = data
        this.$emit('updated', data)
        this.response = null
        if (data.status === 'completed' && this.completedId !== id) {
          this.completedId = id
          this.$emit('completed')
        }
        if (data.status === 'cancelled' && this.cancelledId !== id) {
          this.cancelledId = id
          this.$emit('cancelled')
        }
        if (['review', 'completed'].includes(data.status)) await this.loadRejections()
      } catch (error) {
        if (!this.stopped && this.current.id === id && version === this.refreshVersion)
          this.response = requestError(error)
      } finally {
        if (!this.stopped && this.current.id === id && version === this.refreshVersion) {
          this.loading = false
          if (this.busy) this.timer = setTimeout(() => this.refresh(), 1500)
        }
      }
    },
    async loadRejections() {
      const id = this.current.id
      const version = this.refreshVersion
      const { data } = await http.get(`/api/v1/urllists/domain-batches/${id}/rejections`)
      if (this.stopped || this.current.id !== id || version !== this.refreshVersion) return
      this.rejections = data
      this.corrections = Object.fromEntries(data.map((item) => [item.id, item.raw_domain]))
      this.listCorrections = Object.fromEntries(data.map((item) => [item.id, item.list_name]))
    },
    page(direction) {
      if (this.loading || this.acting) return
      const offset = this.offset + direction * this.pageSize
      if (offset >= 0 && offset < this.filteredRejections.length) this.offset = offset
    },
    async submitCorrections() {
      const corrections = this.rejections
        .filter(
          (item) =>
            this.corrections[item.id] !== item.raw_domain ||
            this.listCorrections[item.id] !== item.list_name,
        )
        .map((item) => ({
          id: item.id,
          value: this.corrections[item.id],
          ...(this.listCorrections[item.id] !== item.list_name
            ? { list_name: this.listCorrections[item.id] }
            : {}),
        }))
      await this.action('corrections', { corrections })
    },
    async action(operation, payload = {}) {
      if (
        this.acting ||
        this.loading ||
        (operation === 'confirm' && this.overwriteRequested && !this.overwriteEnabled)
      )
        return
      if (operation === 'confirm' && this.overwriteEnabled)
        payload = { overwrite: true, confirmation: this.overwriteConfirmation }
      this.acting = true
      clearTimeout(this.timer)
      this.timer = null
      this.refreshVersion += 1
      this.response = null
      const id = this.current.id
      try {
        if (operation === 'cancel') {
          await http.delete(`/api/v1/urllists/domain-batches/${id}`)
          if (this.stopped || this.current.id !== id) return
          this.current = { ...this.current, status: 'cancelled', resumable: false }
        } else {
          const { data } = await http.post(
            `/api/v1/urllists/domain-batches/${id}/${operation}`,
            payload,
          )
          if (this.stopped || this.current.id !== id) return
          this.current = data
        }
        this.overwriteRequested = false
        this.overwriteConfirmation = ''
        this.rejections = []
        this.offset = 0
        this.completedId = null
        await this.refresh(true)
      } catch (error) {
        if (!this.stopped) this.response = requestError(error)
      } finally {
        this.acting = false
        if (!this.stopped && this.busy && this.timer === null)
          this.timer = setTimeout(() => this.refresh(), 1500)
      }
    },
  },
}
</script>

<style scoped>
.domain-batch {
  padding: 1.25rem;
  margin: 1rem 0;
  border: 0;
  border-radius: 0.5rem;
  background: #fff;
  box-shadow: 0 0.25rem 1rem rgb(0 0 0 / 8%);
}
.domain-batch.is-embedded {
  padding: 0;
  margin: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
}
.is-embedded > :first-child {
  margin-top: 0;
}
.is-embedded > :last-child {
  margin-bottom: 0;
}
.domain-batch h5 {
  margin: 0 0 0.5rem;
  color: #575757;
}
.domain-batch p {
  padding: 0;
  margin: 0 0 1rem;
  line-height: 1.6;
}
.batch-loading {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.batch-progress {
  position: relative;
  overflow: hidden;
  margin: 1rem 0 1.25rem;
  border: 1px solid #037584;
  border-radius: 10px;
  background: #eef6f9;
}
.batch-progress-fill {
  background: linear-gradient(#45e7fb, #05bfd6);
  transition: width 0.2s ease;
}
.batch-progress-label {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  color: #173a40;
  font-size: 0.9rem;
  font-weight: bold;
  font-variant-numeric: tabular-nums;
  pointer-events: none;
}
.is-waiting .batch-progress-fill {
  background-color: #05bfd6;
  background-image: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.55) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.55) 50%,
    rgba(255, 255, 255, 0.55) 75%,
    transparent 75%,
    transparent
  );
  background-size: 2rem 2rem;
}
@media (prefers-reduced-motion: reduce) {
  .batch-progress-fill {
    animation: none !important;
    transition: none;
  }
}
.batch-row-number {
  width: 5ch;
  padding-inline-end: 1rem;
  text-align: right;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}
.batch-list-name {
  min-width: 9rem;
  width: 20%;
  overflow-wrap: anywhere;
}
.batch-pagination {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin: 1rem 0;
}
.batch-counts {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem 1.25rem;
  padding: 0;
  margin: 1rem 0;
  list-style: none;
}
.batch-counts li {
  padding: 0.25rem 0.5rem;
  border-radius: 5px;
  background: #f5f5f5;
  color: #575757;
}
.batch-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin: 1rem 0;
}
.batch-actions > button {
  margin: 0;
}
.batch-cancelled {
  color: #575757;
  font-weight: bold;
}
.batch-list-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin: 1.5rem 0;
}
.batch-overwrite {
  padding: 1rem;
  margin: 1.5rem 0;
  border: 1px solid #ffab4c;
  border-radius: 8px;
  background: #fff9f0;
}
.batch-overwrite .form-switch {
  margin-bottom: 0.75rem;
}
.batch-overwrite label {
  display: inline-block;
  margin-bottom: 0.5rem;
}
</style>
