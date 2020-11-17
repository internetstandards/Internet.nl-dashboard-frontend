<style scoped>
</style>
<template>
    <div style="width: 100%;">

        <content-block>
            <h1>{{ $t("title") }}</h1>
            <p>{{ $t("intro") }}</p>
            <autorefresh :visible="true" :callback="load" :refresh_per_seconds="60"></autorefresh>
        </content-block>

        <b-container>
            <b-row cols="3">
                <template v-for="scan in scans">
                    <b-col class="p-1" v-bind:key="scan.id">
                        <ScanMonitorScan :scan="scan" @scan-stopped="load"></ScanMonitorScan>
                    </b-col>
                </template>
            </b-row>
        </b-container>

        <content-block v-if="!scans.length">{{ $t("no_scans") }}</content-block>

    </div>
</template>


<script>

import ScanMonitorScan from './ScanMonitorScan'

export default {
    components: {
        ScanMonitorScan
    },
    name: 'scan_monitor',

    data: function () {
        return {
            scans: [],
        }
    },
    mounted: function () {
        this.load();
    },
    methods: {
        load: function () {
            this.update_scan_data();
        },
        update_scan_data: function () {
            fetch(`${this.$store.state.dashboard_endpoint}/data/scan-monitor/`, {credentials: 'include'}).then(response => response.json()).then(data => {
                this.scans = data;
                this.$store.commit("update_scan_monitor_data", data);
            }).catch((fail) => {
                console.log('A loading error occurred: ' + fail);
            });
        },
    }
}
</script>
<i18n>
{
    "en": {
        "title": "Scan monitor",
        "intro": "All scans that have happened for this account are displayed here. It gives an insight into how recent the most current information is. It can also help you with comparisons to select the ideal scan.",
        "no_scans": "No scans have been performed yet."
    },
    "nl": {
        "title": "Scan monitor",
        "intro": "Alle scans die zijn uitgevoerd voor dit account staan hier. Het geeft een overzicht in hoe recent de data is. Het geeft ook inzicht in of de meest recente scan al is afgerond.",
        "no_scans": "Nog geen scans uitgevoerd."
    }
}
</i18n>