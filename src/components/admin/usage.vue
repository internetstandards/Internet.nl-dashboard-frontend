<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
    <div>
        <content-block>

            <h1><i-bi-graph-up /> {{ $t("admin.usage.title") }}</h1>
            <p>{{ $t("admin.usage.intro") }}</p>
            <p>{{ $t("admin.usage.annotations") }}:</p>
            <ol>
                <li>{{ $t("admin.usage.annotation_metrics") }}
                </li>
            </ol>
            <loading :loading="loading"/>
        </content-block>

        <template v-if="s">
            <content-block>
                <b-table-simple hover small caption-top responsive>
                    <caption>{{ s.users.total }} Users Last login moment in N days (logging in is not something that is needed often, users stay logged in for longer periods of time to increase usability)</caption>
                    <b-tr>
                        <b-th>1</b-th>
                        <b-th>7</b-th>
                        <b-th>14</b-th>
                        <b-th>30</b-th>
                        <b-th>90</b-th>
                        <b-th>180</b-th>
                        <b-th>365</b-th>
                    </b-tr>
                    <b-tr>
                        <b-td>{{ s.users.logged_in_the_past_1_days }}</b-td>
                        <b-td>{{ s.users.logged_in_the_past_7_days }}</b-td>
                        <b-td>{{ s.users.logged_in_the_past_14_days }}</b-td>
                        <b-td>{{ s.users.logged_in_the_past_30_days }}</b-td>
                        <b-td>{{ s.users.logged_in_the_past_90_days }}</b-td>
                        <b-td>{{ s.users.logged_in_the_past_180_days }}</b-td>
                        <b-td>{{ s.users.logged_in_the_past_365_days }}</b-td>
                    </b-tr>
                </b-table-simple>
            </content-block>
            <content-block v-for="section in chartSections" :key="section.key">
                <h2 class="h4 mb-3">{{ section.title }}</h2>
                <stats_yearview
                    :data="section.data"
                    :total="section.data.total"
                    :title="`${section.title} total`"
                    :inline="true"
                />
                <ActionTrendChart
                    :labels="sectionTrends[section.key].labels"
                    :values="sectionTrends[section.key].values"
                    :title="`${section.title} over time`"
                />
            </content-block>
        </template>
    </div>
</template>
<script>

import stats_yearview from './usage_yearview.vue'
import ActionTrendChart from './ActionTrendChart.vue'
import http from "@/httpclient";

export default {
    components: {
        stats_yearview,
        ActionTrendChart
    },
    data: function () {
        return {
            s: null,
            loading: false
        }
    },
    computed: {
        chartSections: function () {
            if (!this.s) {
                return []
            }

            return [
                {key: 'scans', title: 'Scans', data: this.s.scans},
                {key: 'domains', title: 'Domains', data: this.s.domains},
                {key: 'logged-in', title: 'Log-ins', data: this.s.actions?.['logged in']},
                {key: 'viewed-report', title: 'Reports viewed', data: this.s.actions?.['viewed report']},
                {key: 'created-list', title: 'Lists created', data: this.s.actions?.['created list']},
                {key: 'uploaded-spreadsheet', title: 'Spreadsheets uploaded', data: this.s.actions?.['uploaded spreadsheet']}
            ].filter((section) => Boolean(section.data))
        },
        sectionTrends: function () {
            const trends = {}
            this.chartSections.forEach((section) => {
                trends[section.key] = this.buildMonthlyTrend(section.data)
            })
            return trends
        }
    },
    mounted: function () {
        this.load()
    },
    methods: {
        buildMonthlyTrend: function (rawData) {
            const labels = []
            const values = []
            if (!rawData) {
                return {labels, values}
            }

            const knownPoints = []
            Object.entries(rawData.per_month || {}).forEach(([yearKey, months]) => {
                const year = Number.parseInt(String(yearKey), 10)
                if (!Number.isInteger(year)) {
                    return
                }

                Object.keys(months || {}).forEach((monthKey) => {
                    const month = Number.parseInt(String(monthKey), 10)
                    if (Number.isInteger(month) && month >= 1 && month <= 12) {
                        knownPoints.push({year, month})
                    }
                })
            })

            knownPoints.sort((a, b) => (a.year - b.year) || (a.month - b.month))

            let start = knownPoints[0]
            let end = knownPoints[knownPoints.length - 1]
            if (!start || !end) {
                const years = Object.keys(rawData.per_year || {})
                    .map((yearKey) => Number.parseInt(String(yearKey), 10))
                    .filter((year) => Number.isInteger(year))
                    .sort((a, b) => a - b)
                if (!years.length) {
                    return {labels, values}
                }
                start = {year: years[0], month: 1}
                end = {year: years[years.length - 1], month: 12}
            }

            let cursorYear = start.year
            let cursorMonth = start.month
            while (cursorYear < end.year || (cursorYear === end.year && cursorMonth <= end.month)) {
                const yearKey = String(cursorYear)
                const amount = Number(rawData?.per_month?.[yearKey]?.[cursorMonth] ?? 0)
                labels.push(`${yearKey}-${String(cursorMonth).padStart(2, '0')}`)
                values.push(Number.isFinite(amount) ? amount : 0)

                cursorMonth += 1
                if (cursorMonth > 12) {
                    cursorMonth = 1
                    cursorYear += 1
                }
            }

            return {labels, values}
        },
        load: function () {
            this.loading = true;
            http.get(`/api/v1/admin/usage-statistics`).then(data => {
                this.loading = false;
                this.s = data.data;
            });
        },
    }
}
</script>
