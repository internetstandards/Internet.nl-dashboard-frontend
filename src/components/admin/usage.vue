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
            http.get(`/data/usage`).then(data => {
                this.loading = false;
                this.s = data.data;
            });
        },
    }
}
</script>
