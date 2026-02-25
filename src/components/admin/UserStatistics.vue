<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
  <div>
    <content-block>
      <h1><i-bi-graph-up /> User statistics</h1>
      <p>Overview of the most active users in a selected period.</p>
      <loading :loading="loading" />
      <b-alert v-if="errorMessage" variant="danger" :model-value="true">{{ errorMessage }}</b-alert>
    </content-block>

    <content-block>
      <form @submit.prevent="load">
        <div class="row g-3 align-items-end">
          <div class="col-12 col-md-4">
            <label class="form-label" for="user-statistics-start-date">Start date</label>
            <input
              id="user-statistics-start-date"
              v-model="filters.start_date"
              class="form-control"
              type="date"
              required
            >
          </div>
          <div class="col-12 col-md-4">
            <label class="form-label" for="user-statistics-end-date">End date</label>
            <input
              id="user-statistics-end-date"
              v-model="filters.end_date"
              class="form-control"
              type="date"
              required
            >
          </div>
          <div class="col-12 col-md-4">
            <label class="form-label" for="user-statistics-max-records">Max records</label>
            <input
              id="user-statistics-max-records"
              v-model.number="filters.max_records"
              class="form-control"
              type="number"
              min="1"
              step="1"
              required
            >
          </div>
          <div class="col-12 d-flex gap-2">
            <b-button variant="warning" type="submit" :disabled="loading">Apply filters</b-button>
            <b-button variant="secondary" type="button" :disabled="loading" @click="resetToDefaults">Last month defaults</b-button>
          </div>
        </div>
      </form>
    </content-block>

    <template v-if="s">
      <content-block>
        <b-table-simple hover small caption-top responsive="true">
          <caption>Summary</caption>
          <b-tr>
            <b-th>Range start</b-th>
            <b-td>{{ s.start_date }}</b-td>
          </b-tr>
          <b-tr>
            <b-th>Range end</b-th>
            <b-td>{{ s.end_date }}</b-td>
          </b-tr>
          <b-tr>
            <b-th>Max records</b-th>
            <b-td>{{ s.max_records }}</b-td>
          </b-tr>
          <b-tr>
            <b-th>Returned users</b-th>
            <b-td>{{ s.users.length }}</b-td>
          </b-tr>
        </b-table-simple>
      </content-block>

      <content-block>
        <h2 class="h4 mb-3">Users</h2>
        <b-table-simple hover small striped responsive="true">
          <b-tr>
            <b-th>#</b-th>
            <b-th>User</b-th>
            <b-th>Total actions</b-th>
            <b-th>Distinct actions</b-th>
            <b-th>Actions</b-th>
          </b-tr>
          <b-tr v-for="(user, index) in s.users" :key="`${user.content_type_id}-${user.object_id}-${index}`">
            <b-td>{{ index + 1 }}</b-td>
            <b-td>{{ user.name }}</b-td>
            <b-td>{{ user.total_actions }}</b-td>
            <b-td>{{ user.total_distinct_actions }}</b-td>
            <b-td>
              <div v-if="user.action_items.length === 0">-</div>
              <div v-for="action in user.action_items" :key="`${user.object_id}-${action.name}`">
                {{ action.name }}: {{ action.count }}
              </div>
            </b-td>
          </b-tr>
        </b-table-simple>
        <b-alert v-if="s.users.length === 0" variant="info" :model-value="true" class="mt-3 mb-0">
          No users found for this date range.
        </b-alert>
      </content-block>
    </template>
  </div>
</template>

<script>
import http from "@/httpclient";

export default {
  name: 'UserStatistics',
  data: function () {
    return {
      s: null,
      loading: false,
      errorMessage: '',
      filters: {
        start_date: '',
        end_date: '',
        max_records: 10
      }
    }
  },
  mounted: function () {
    this.resetToDefaults()
  },
  methods: {
    toIsoDate(date) {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },

    previousMonthDefaultRange() {
      const now = new Date()
      const lastDayPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0)
      const firstDayPreviousMonth = new Date(
        lastDayPreviousMonth.getFullYear(),
        lastDayPreviousMonth.getMonth(),
        1
      )
      return {
        start_date: this.toIsoDate(firstDayPreviousMonth),
        end_date: this.toIsoDate(lastDayPreviousMonth)
      }
    },

    resetToDefaults() {
      const range = this.previousMonthDefaultRange()
      this.filters.start_date = range.start_date
      this.filters.end_date = range.end_date
      this.filters.max_records = 10
      this.load()
    },

    normalizeUser(rawUser) {
      const source = rawUser || {}
      const actions = source.actions || source.verbs || {}
      const actionItems = Object.entries(actions)
        .map(([name, count]) => ({
          name,
          count: Number.isFinite(Number(count)) ? Number(count) : 0
        }))
        .sort((a, b) => b.count - a.count)

      return {
        content_type_id: source.actor_content_type_id ?? source.user_content_type_id ?? '-',
        object_id: source.actor_object_id ?? source.user_object_id ?? '-',
        name: source.actor || source.user || '-',
        total_actions: Number.isFinite(Number(source.total_actions)) ? Number(source.total_actions) : 0,
        total_distinct_actions: Number.isFinite(Number(source.total_distinct_actions))
          ? Number(source.total_distinct_actions)
          : (
            Number.isFinite(Number(source.total_distinct_verbs))
              ? Number(source.total_distinct_verbs)
              : actionItems.length
          ),
        actions,
        action_items: actionItems
      }
    },

    normalizeResponse(rawStats) {
      const stats = rawStats || {}
      const rawUsers = Array.isArray(stats.users)
        ? stats.users
        : (Array.isArray(stats.actors) ? stats.actors : [])
      const users = rawUsers.map((user) => this.normalizeUser(user))
      return {
        start_date: stats.start_date || this.filters.start_date,
        end_date: stats.end_date || this.filters.end_date,
        max_records: Number.isFinite(Number(stats.max_records)) ? Number(stats.max_records) : this.filters.max_records,
        users
      }
    },

    load() {
      const maxRecords = Number.parseInt(String(this.filters.max_records), 10)
      if (!Number.isInteger(maxRecords) || maxRecords < 1) {
        this.errorMessage = 'Max records must be at least 1.'
        return
      }
      if (this.filters.start_date > this.filters.end_date) {
        this.errorMessage = 'Start date must be before or equal to end date.'
        return
      }

      this.loading = true
      this.errorMessage = ''
      http.get('/api/v1/admin/user-statistics', {
        params: {
          start_date: this.filters.start_date,
          end_date: this.filters.end_date,
          max_records: maxRecords
        }
      }).then((data) => {
        this.s = this.normalizeResponse(data.data)
        this.loading = false
      }).catch(() => {
        this.loading = false
        this.errorMessage = 'Unable to load user statistics.'
      })
    }
  }
}
</script>
