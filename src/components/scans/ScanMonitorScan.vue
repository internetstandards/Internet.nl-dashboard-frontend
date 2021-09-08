<!-- SPDX-License-Identifier: Apache-2.0 -->
<style scoped>
ol {
    list-style: decimal;
}
.card-header {
    min-height: 5em;
}
</style>
<template>
    <b-card class="shadow"
        header-bg-variant="info"
        header-text-variant="light"
        footer-bg-variant="info-outline"
        footer-text-variant="light"
        header-tag="header"
        footer-tag="footer"

        >
        <template #header>

            <span v-if="scan.state === 'finished'">✅</span>
            <span v-if="scan.state === 'cancelled'">⭕</span>
            <span v-if="!['finished', 'cancelled'].includes(scan.state)">
            <probe /></span>
            <b>&nbsp; {{ scan.type }} {{ $t("scan") }} "<span v-html="abbreviate(scan.list, 50)" />"</b>

        </template>

        <b-card-text>

        <small>{{ $t("started_on") }}:
        <span :title="scan.started_on">{{
                humanize_date(scan.started_on)
            }},<br>{{ humanize_relative_date(scan.started_on) }}</span></small><br>
        <br>

        <template v-if="scan.finished && (scan.state !== 'cancelled')">
            <template v-if="scan.last_report_id">
                📊
                <router-link :to="{ name: 'numbered_report', params: { report: scan.last_report_id }}">
                    {{ $t("open_report") }}
                </router-link>
                <br>
                <br>
            </template>
            <template v-if="!scan.last_report_id">
                📊 {{ $t("report_is_being_generated") }}<br>
                <br>
            </template>
        </template>
        📘
        <router-link :to="{ name: 'numbered_lists', params: { list: scan.list_id }}">
            {{ $t("open_list") }}
        </router-link>
        <br><br>

        <b>{{ $t("progress_bar") }}</b><br>
        <template v-if="progress_bar_data(scan.log[0]['state']).state === 'error'">
            <b-progress :value="100" variant="danger">
                <b-progress-bar :value="100">
                    <span>{{ $t('progress.' + scan.log[0]['state']) }}</span>
                </b-progress-bar>
            </b-progress>
        </template>
        <template v-else>
            <b-progress show-progress variant="info"
                        :animated="progress_bar_data(scan.log[0]['state']).percentage!==100">
                <b-progress-bar :value="progress_bar_data(scan.log[0]['state']).percentage">
                    <span>{{ progress_bar_data(scan.log[0]['state']).percentage }}%</span>
                </b-progress-bar>
            </b-progress>
        </template>
        <br>

        <template v-if="['finished', 'cancelled'].includes(scan.state)">
            <b v-if="scan.state === 'cancelled'">{{ $t("cancelled_on") }}</b>
            <b v-if="scan.state === 'finished'">{{ $t("finished_on") }}</b> <br>
            <span :title="scan.finished_on">{{
                    humanize_date(scan.finished_on)
                }},<br>{{ humanize_relative_date(scan.finished_on) }}</span><br><br>
        </template>


        <b>{{ $t("runtime") }}</b><br>
        {{ humanize_duration(scan.runtime) }}<br>
        <br>
        <template v-if="!['finished', 'cancelled'].includes(scan.state)">
            <b>{{ $t("message") }}</b>
            <p>{{ $t('progress.' + scan.state) }}</p>
            <b>{{ $t("last_check") }}</b><br>
            <span :title="scan.last_check">{{
                    humanize_date(scan.last_check)
                }},<br>{{ humanize_relative_date(scan.last_check) }}</span><br>
            <br>
        </template>
        <b>{{ $t("started_on") }}</b><br>
        <span :title="scan.started_on">{{
                humanize_date(scan.started_on)
            }},<br>{{ humanize_relative_date(scan.started_on) }}</span><br>
        <br>

        <b>{{ $t("scan_support_id") }}</b><br>
        <span>Scan #{{ scan.id }}</span><br>
        <br>

        <collapse-panel :title='$t("scan history")'>
            <div slot="content">
                <ol style="font-size: 0.7em;" reversed>
                    <li v-for="log_item in scan.log" :key="log_item.id">
                        {{ $t('progress.' + log_item.state) }},
                        {{ humanize_relative_date(log_item.at_when) }}
                    </li>
                </ol>
                <template v-if="!['finished', 'cancelled'].includes(scan.state)">
                    <button @click="visible.stop_scan = true">{{ $t("stop_scan") }}</button>

                    <StopScan :scan="scan" :show="visible.stop_scan" :visible="visible.stop_scan" @cancel="visible.stop_scan = false" @scan-stopped="scan_stopped()" ></StopScan>

                </template>
            </div>
        </collapse-panel>

        </b-card-text>

        <template #footer>
            <template v-if="scan.status_url">
                🔖
                <template v-if="scan.state === 'finished'">
                    <a :href="scan.status_url + '/results'" target="_blank">{{ $t("open_in_api") }}</a>
                </template>
                <template v-else>
                    <a :href="scan.status_url" target="_blank">{{ $t("open_in_api") }}</a>
                </template>
                <br>
            </template>
        </template>
    </b-card>
</template>


<script>

import StopScan from './stop'

export default {
    components: {
        StopScan
    },
    name: 'scan_monitor',

    data: function () {
        return {
            // cancellations:

            visible: {
                stop_scan: false,
            },

            // states of a scan, to visualize a progress bar:
            scan_state_and_progress: {
                "requested": {"percentage": 5, "state": "good"},
                "discovering endpoints": {"percentage": 7, "state": "good"},
                "discovered endpoints": {"percentage": 10, "state": "good"},
                "retrieving scannable urls": {"percentage": 12, "state": "good"},
                "retrieved scannable urls": {"percentage": 15, "state": "good"},
                "registering scan at internet.nl": {"percentage": 17, "state": "good"},
                "registered scan at internet.nl": {"percentage": 20, "state": "good"},
                "running scan": {"percentage": 25, "state": "good"},
                "registered": {"percentage": 25, "state": "good"},
                "scan results ready": {"percentage": 50, "state": "good"},
                "importing scan results": {"percentage": 60, "state": "good"},
                "imported scan results": {"percentage": 65, "state": "good"},
                "storing scan results": {"percentage": 70, "state": "good"},
                "processing scan results": {"percentage": 72, "state": "good"},
                "scan results stored": {"percentage": 74, "state": "good"},
                "creating report": {"percentage": 75, "state": "good"},
                "created report": {"percentage": 80, "state": "good"},
                "sending mail": {"percentage": 90, "state": "good"},
                "sent mail": {"percentage": 95, "state": "good"},
                "finished": {"percentage": 100, "state": "good"},

                "skipped sending mail: no mail server configured": {"percentage": 95, "state": "good"},
                "skipped sending mail: no e-mail addresses associated with account": {
                    "percentage": 95,
                    "state": "good"
                },

                "network_error": {"percentage": 0, "state": "error"},
                "configuration_error": {"percentage": 0, "state": "error"},
                "timeout": {"percentage": 0, "state": "error"},
                "error": {"percentage": 0, "state": "error"},
                "cancelled": {"percentage": 100, "state": "good"},
            }
        }
    },
    mounted: function () {
    },
    props: {
        scan: {
            type: Object,
        }
    },
    methods: {
        progress_bar_data: function (current_scan_state) {
            let data = this.scan_state_and_progress[current_scan_state]
            if (data === undefined) {
                data = {percentage: 0, state: "error"}
            }
            return data
        },
        scan_stopped: function() {
            this.visible.stop_scan = false;
            // events don't bubble up, so trigger it again here.
            this.$emit('scan-stopped', this.scan.id)
        },
        abbreviate: function(text, max_length){

            if (max_length === undefined){
                max_length = 30;
            }

            if (text.length < (max_length + 3))
                return text

            return `${text.substring(0, max_length)}...`
        },
    }
}
</script>
<i18n>
{
    "en": {
        "scan": "scan",
        "type": "Type",
        "list": "List",
        "started_on": "Started",
        "finished_on": "Finished",
        "cancelled_on": "Cancelled",
        "message": "Status",
        "live": "API",
        "report": "Report",
        "runtime": "Runtime",
        "open_in_api": "Open on internet.nl API",
        "open_report": "Open report",
        "open_list": "Open list",
        "last_check": "Last status update",
        "report_is_being_generated": "Report is being generated.",
        "processing_results": "Processing results.",
        "progress_bar": "Progress",
        "scan history": "Performed tasks",
        "stop_scan": "Stop scan",
        "scan_support_id": "Scan Support ID",
        "cancel": {
            "are_you_sure": "Do you want to cancel this scan?",
            "scan_id": "scan",
            "list": "list",
            "ok": "Stop scan",
            "cancel": "Continue scanning"
        },
        "progress": {
            "requested": "requested",
            "discovering endpoints": "discovering endpoints",
            "discovered endpoints": "discovered endpoints",
            "retrieving scannable urls": "retrieving scannable urls",
            "retrieved scannable urls": "retrieved scannable urls",
            "registering scan at internet": {
                "nl": "registering scan"
            },
            "registered scan at internet": {
                "nl": "registered scan"
            },
            "running scan": "running scan",
            "registered": "registered scan",
            "scan results ready": "scan results ready",
            "importing scan results": "importing scan results",
            "imported scan results": "imported scan results",
            "processing scan results": "processing scan results",
            "storing scan results": "storing scan results",
            "scan results stored": "scan results stored",
            "creating report": "creating report",
            "created report": "created report",
            "sending mail": "sending mail",
            "sent mail": "sent mail",
            "finished": "finished",
            "skipped sending mail: no mail server configured": "skipped sending mail: no mail server configured",
            "skipped sending mail: no e-mail addresses associated with account": "skipped sending mail: no e-mail addresses associated with account",
            "network_error": "network problem detected, contact internet.nl",
            "configuration_error": "configuration error detected, contact internet.nl",
            "timeout": "operation timed out, will retry",
            "error": "An unknown error occurred, contact internet.nl",
            "cancelled": "Scan was cancelled"
        }
    },
    "nl": {
        "id": "scan",
        "type": "Soort",
        "list": "Lijst",
        "started_on": "Gestart",
        "finished_on": "Klaar",
        "cancelled_on": "Gestopt",
        "message": "Status",
        "live": "API",
        "report": "Rapport",
        "runtime": "Looptijd",
        "open_in_api": "Open internet.nl API resultaat",
        "open_report": "Open rapport",
        "open_list": "Bekijk lijst",
        "last_check": "Laatste status update",
        "report_is_being_generated": "Report wordt gemaakt.",
        "processing_results": "Resultaten worden verwerkt.",
        "progress_bar": "Voortgang",
        "scan history": "Uitgevoerde stappen",
        "stop_scan": "Stop scan",
        "scan_support_id": "Scan supportnummer",
        "cancel": {
            "are_you_sure": "Deze scan stoppen?",
            "scan_id": "scan",
            "list": "lijst",
            "ok": "Stop scan",
            "cancel": "Blijf scannen"
        },
        "progress": {
            "requested": "aangevraagd",
            "discovering endpoints": "inventariseren mogelijke scans",
            "discovered endpoints": "mogelijke scans bekend",
            "retrieving scannable urls": "ophalen scanbare domeinen",
            "retrieved scannable urls": "scanbare domeinen opgehaald",
            "registering scan at internet": {
                "nl": "scan registreren"
            },
            "registered scan at internet": {
                "nl": "scan geregistreerd"
            },
            "running scan": "scan wordt uitgevoerd",
            "registered": "scan geregistreerd",
            "scan results ready": "scanresultaten beschikbaar",
            "importing scan results": "scanresultaten importeren",
            "imported scan results": "scanresultaten geïmporteerd",
            "processing scan results": "verwerken van scan resultaten",
            "storing scan results": "scanresultaten opslaan",
            "scan results stored": "scanresultaten opgeslagen",
            "creating report": "rapport wordt gemaakt",
            "created report": "rapport gemaakt",
            "sending mail": "versturen e-mails",
            "sent mail": "mail verstuurd",
            "finished": "klaar",
            "skipped sending mail: no mail server configured": "sturen van mail overgeslagen: geen mailserver ingesteld",
            "skipped sending mail: no e-mail addresses associated with account": "sturen van mail overgeslagen: geen mail adres bekend",
            "network_error": "netwerkproblemen ontdekt, neem contact op met internet.nl",
            "configuration_error": "configuratie onjuist ingesteld, neem contact op met internet.nl",
            "timeout": "wachttijd vertreken, probeert opnieuw",
            "error": "Onbekende fout opgetreden, neem contact op met internet.nl",
            "cancelled": "Scan was gestopt"
        }
    }
}
</i18n>