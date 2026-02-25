<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
  <div>
    <content-block>
      <h1><i-bi-graph-up /> Action statistics</h1>
      <p>Overview of action usage by verb, year and month.</p>
      <loading :loading="loading" />
      <b-alert v-if="errorMessage" variant="danger" :model-value="true">{{ errorMessage }}</b-alert>
    </content-block>

    <template v-if="s">
      <content-block>
        <b-table-simple hover small caption-top responsive="true">
          <caption>Summary</caption>
          <b-tr>
            <b-th>Total tracked actions</b-th>
            <b-td>{{ s.total_actions }}</b-td>
          </b-tr>
          <b-tr>
            <b-th>Distinct action verbs</b-th>
            <b-td>{{ s.verbs.length }}</b-td>
          </b-tr>
          <b-tr>
            <b-th>Verbs</b-th>
            <b-td>
              <a
                v-for="(verb, index) in s.verbs"
                :key="verb"
                :href="`#${verbAnchorId(verb)}`"
                class="me-2"
              >
                {{ verb }}<span v-if="index < s.verbs.length - 1">,</span>
              </a>
            </b-td>
          </b-tr>
          <b-tr>
            <b-th>Years covered</b-th>
            <b-td>{{ yearsLabel }}</b-td>
          </b-tr>
        </b-table-simple>
      </content-block>

      <content-block v-for="verb in s.verbs" :id="verbAnchorId(verb)" :key="verb">
        <h2 class="h4 mb-3">{{ verbSectionTitle(verb) }}</h2>
        <stats_yearview
          :data="s.actions[verb]"
          :total="s.actions[verb].total"
          :title="`${verb} total`"
          :inline="true"
        />
        <ActionTrendChart
          :labels="s.trends[verb].labels"
          :values="s.trends[verb].values"
          :title="`${verb} over time`"
        />
      </content-block>
    </template>
  </div>
</template>

<script>
import http from "@/httpclient";
import stats_yearview from './usage_yearview.vue'
import ActionTrendChart from './ActionTrendChart.vue'

const preferredVerbOrder = [
  'logged in',
  'retrieved domain lists',
  'created list',
  'updated list',
  'deleted list',
  'uploaded spreadsheet',
  'started manual scan',
  'cancelled scan',
  'viewed report',
  'logged out'
]

export default {
  name: 'ActionStatistics',
  components: {
    stats_yearview,
    ActionTrendChart
  },
  data: function () {
    return {
      s: null,
      loading: false,
      errorMessage: ''
    }
  },
  computed: {
    yearsLabel: function () {
      if (!this.s?.years?.length) {
        return '-'
      }
      return `${this.s.years[0]} - ${this.s.years[this.s.years.length - 1]}`
    }
  },
  mounted: function () {
    this.load()
  },
  methods: {
    verbSectionTitle(verb) {
      return `Action: ${verb}`
    },

    verbAnchorId(verb) {
      return `verb-${String(verb || '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')}`
    },

    normalizeAction(rawAction, years) {
      const action = rawAction || {}
      const perYear = {}
      const perMonth = {}
      const knownPoints = []

      years.forEach((year) => {
        const yearValue = Number(action?.per_year?.[year] ?? 0)
        perYear[year] = Number.isFinite(yearValue) ? yearValue : 0

        const rawMonths = action?.per_month?.[year] || {}
        const months = {}
        for (let month = 1; month <= 12; month += 1) {
          months[month] = 0
        }

        Object.entries(rawMonths).forEach(([monthKey, monthValue]) => {
          const month = Number.parseInt(String(monthKey), 10)
          if (Number.isInteger(month) && month >= 1 && month <= 12) {
            const value = Number(monthValue)
            months[month] = Number.isFinite(value) ? value : 0
            knownPoints.push({
              year: Number.parseInt(String(year), 10),
              month
            })
          }
        })

        perMonth[year] = months
      })

      const total = Number(action?.total ?? 0)
      knownPoints.sort((a, b) => (a.year - b.year) || (a.month - b.month))
      const firstKnown = knownPoints[0] || null
      const lastKnown = knownPoints[knownPoints.length - 1] || null
      return {
        total: Number.isFinite(total) ? total : 0,
        per_year: perYear,
        per_month: perMonth,
        first_known: firstKnown,
        last_known: lastKnown
      }
    },

    buildMonthlyTrend(action, years) {
      const labels = []
      const values = []
      if (!years.length) {
        return { labels, values }
      }

      const startYear = action?.first_known?.year ?? Number.parseInt(String(years[0]), 10)
      const startMonth = action?.first_known?.month ?? 1
      const endYear = action?.last_known?.year ?? Number.parseInt(String(years[years.length - 1]), 10)
      const endMonth = action?.last_known?.month ?? 12

      if (!Number.isInteger(startYear) || !Number.isInteger(endYear) || startYear > endYear) {
        return { labels, values }
      }

      let cursorYear = startYear
      let cursorMonth = startMonth

      while (
        cursorYear < endYear ||
        (cursorYear === endYear && cursorMonth <= endMonth)
      ) {
        const yearKey = String(cursorYear)
        const value = Number(action?.per_month?.[yearKey]?.[cursorMonth] ?? 0)
        labels.push(`${yearKey}-${String(cursorMonth).padStart(2, '0')}`)
        values.push(Number.isFinite(value) ? value : 0)

        cursorMonth += 1
        if (cursorMonth > 12) {
          cursorMonth = 1
          cursorYear += 1
        }
      }

      return { labels, values }
    },

    normalizeStatistics(rawStats) {
      const stats = rawStats || {}
      const years = Array.isArray(stats.years) ? stats.years.map(String) : []
      const collectedVerbs = Array.isArray(stats.verbs) ? [...stats.verbs] : []
      const actions = {}
      const trends = {}

      // Keep backend-discovered verbs and include any extra keys that may not be listed.
      Object.keys(stats.actions || {}).forEach((verb) => {
        if (!collectedVerbs.includes(verb)) {
          collectedVerbs.push(verb)
        }
      })

      const verbs = [
        ...preferredVerbOrder.filter((verb) => collectedVerbs.includes(verb)),
        ...collectedVerbs.filter((verb) => !preferredVerbOrder.includes(verb))
      ]

      verbs.forEach((verb) => {
        const normalizedAction = this.normalizeAction(stats.actions?.[verb], years)
        actions[verb] = normalizedAction
        trends[verb] = this.buildMonthlyTrend(normalizedAction, years)
      })

      const totalActions = verbs.reduce((sum, verb) => sum + (actions[verb]?.total || 0), 0)
      return {
        years,
        verbs,
        actions,
        trends,
        total_actions: totalActions
      }
    },

    load: function () {
      this.loading = true;
      this.errorMessage = ''
      http.get('/api/v1/admin/action-statistics').then(data => {
        this.s = this.normalizeStatistics(data.data)
        this.loading = false;
      }).catch(() => {
        this.loading = false;
        this.errorMessage = 'Unable to load action statistics.'
      });
    },
  }
}
</script>
