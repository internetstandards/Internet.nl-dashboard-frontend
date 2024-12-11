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
                        <b-th>2</b-th>
                        <b-th>3</b-th>
                        <b-th>5</b-th>
                        <b-th>7</b-th>
                        <b-th>14</b-th>
                        <b-th>21</b-th>
                        <b-th>30</b-th>
                        <b-th>60</b-th>
                        <b-th>90</b-th>
                        <b-th>120</b-th>
                        <b-th>150</b-th>
                        <b-th>180</b-th>
                        <b-th>210</b-th>
                        <b-th>240</b-th>
                        <b-th>270</b-th>
                        <b-th>300</b-th>
                    </b-tr>
                    <b-tr>
                        <b-td>{{ s.users.logged_in_the_past_1_days }}</b-td>
                        <b-td>{{ s.users.logged_in_the_past_2_days }}</b-td>
                        <b-td>{{ s.users.logged_in_the_past_3_days }}</b-td>
                        <b-td>{{ s.users.logged_in_the_past_5_days }}</b-td>
                        <b-td>{{ s.users.logged_in_the_past_7_days }}</b-td>
                        <b-td>{{ s.users.logged_in_the_past_14_days }}</b-td>
                        <b-td>{{ s.users.logged_in_the_past_21_days }}</b-td>
                        <b-td>{{ s.users.logged_in_the_past_30_days }}</b-td>
                        <b-td>{{ s.users.logged_in_the_past_60_days }}</b-td>
                        <b-td>{{ s.users.logged_in_the_past_90_days }}</b-td>
                        <b-td>{{ s.users.logged_in_the_past_120_days }}</b-td>
                        <b-td>{{ s.users.logged_in_the_past_150_days }}</b-td>
                        <b-td>{{ s.users.logged_in_the_past_180_days }}</b-td>
                        <b-td>{{ s.users.logged_in_the_past_210_days }}</b-td>
                        <b-td>{{ s.users.logged_in_the_past_240_days }}</b-td>
                        <b-td>{{ s.users.logged_in_the_past_270_days }}</b-td>
                        <b-td>{{ s.users.logged_in_the_past_300_days }}</b-td>
                    </b-tr>
                </b-table-simple>
            </content-block>
            <stats_yearview :data="s.scans" :total="s.scans.total" title="Scans"></stats_yearview>
            <stats_yearview :data="s.domains" :total="s.domains.total" title="Domains"></stats_yearview>
            <stats_yearview :data="s.actions['logged in']" :total="s.actions['logged in'].total"
                            title="Log-ins"></stats_yearview>
            <stats_yearview :data="s.actions['viewed report']" :total="s.actions['viewed report'].total"
                            title="Reports viewed"></stats_yearview>
            <stats_yearview :data="s.actions['created list']" :total="s.actions['created list'].total"
                            title="Lists created"></stats_yearview>
            <stats_yearview :data="s.actions['uploaded spreadsheet']" :total="s.actions['uploaded spreadsheet'].total"
                            title="Spreadsheets uploaded"></stats_yearview>
            <stats_yearview :data="s.metrics.last_scan_moment" :total="s.metrics.total"
                            title="Scan metrics (at last scan moment)"></stats_yearview>
            <stats_yearview :data="s.metrics.rating_determined_on" :total="s.metrics.total"
                            title="Scan metrics (at rating determined on)"></stats_yearview>
        </template>
    </div>
</template>
<script>

import stats_yearview from './usage_yearview.vue'
import http from "@/httpclient";

export default {
    components: {
        stats_yearview
    },
    data: function () {
        return {
            s: null,
            loading: false
        }
    },
    mounted: function () {
        this.load()
    },
    methods: {
        load: function () {
            this.loading = true;
            http.get(`/data/usage/`).then(data => {
                this.loading = false;
                this.s = data.data;
            });
        },
    }
}
</script>
