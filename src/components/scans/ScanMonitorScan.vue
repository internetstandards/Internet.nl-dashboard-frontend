<style scoped>

.monitor-block h2 {
    color: white;
    font-size: 1.2em;
    display: inline-block;
    margin: 0;
    margin-top: -0.3em;
}
</style>
<template>
    <div class="wrapper">
        <h2>
            <span v-if="scan.state === 'finished'">✅</span>
            <span v-if="scan.state === 'cancelled'">⭕</span>
            <span v-if="!['finished', 'cancelled'].includes(scan.state)">
            <probe /></span>
            &nbsp; {{ scan.type }} {{ $t("id") }}{{ scan.id }}</h2><br>
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
        <router-link :to="{ name: 'numbered_lists', params: { list: scan.list_id }}">{{
                scan.list
            }}
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

        <collapse-panel :title='$t("scan history")'>
            <div slot="content">
                <ul style="font-size: 0.7em;">
                    <li v-for="log_item in scan.log" :key="log_item.id">
                        - {{ $t('progress.' + log_item.state) }},
                        {{ humanize_relative_date(log_item.at_when) }}
                    </li>
                </ul>
                <template v-if="!['finished', 'cancelled'].includes(scan.state)">
                    <button @click="start_stop_scan(scan)">{{ $t("stop_scan") }}</button>

                    <!-- This element is duplicated so that cancelling this dialog will put you on the right place on the
                    page if you navigate the site by keyboard. -->
                    <internet_nl_modal v-if="show_stop_scan" @close="stop_stop_scan()">
                        <h3 slot="header">🛑 {{ $t("cancel.are_you_sure") }}</h3>
                        <div slot="body">

                            <server-response :response="stop_scan_server_response"></server-response>

                            <div class="wrapper" style="width: 100%">
                            <span><probe /></span> &nbsp;
                                <b>{{ stop_scan.type }} {{ $t("id") }}{{ stop_scan.id }}</b><br>
                                <br>
                                📘 {{ stop_scan.list }}<br>
                                <br>
                                <b>{{ $t("runtime") }}</b><br>
                                {{ humanize_duration(stop_scan.runtime) }}<br>
                                <br>
                                <b>{{ $t("message") }}</b>
                                <p>{{ $t('progress.' + stop_scan.state) }}</p>
                                <b>{{ $t("last_check") }}</b><br>
                                <span :title="stop_scan.last_check">
                                {{ humanize_date(stop_scan.last_check) }},<br>
                                {{ humanize_relative_date(stop_scan.last_check) }}
                            </span><br>
                                <br>
                                <b>{{ $t("started_on") }}</b><br>
                                <span :title="stop_scan.started_on">
                                {{ humanize_date(stop_scan.started_on) }},<br>
                                {{ humanize_relative_date(stop_scan.started_on) }}
                            </span><br>
                            </div>

                        </div>
                        <div slot="footer">
                            <button class="altbutton" @click="stop_stop_scan()">{{ $t("cancel.cancel") }}</button>
                            &nbsp;
                            <button class="modal-default-button defaultbutton" @click="confirm_stop_scan()">{{
                                    $t("cancel.ok")
                                }}
                            </button>
                        </div>
                    </internet_nl_modal>

                </template>
            </div>
        </collapse-panel>

        <br>

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
    </div>
</template>


<script>
export default {
    name: 'scan_monitor',

    data: function () {
        return {
            // cancellations:
            show_stop_scan: false,
            stop_scan: null, // the scan that will be cancelled when you hit OK
            stop_scan_server_response: {},

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
        start_stop_scan: function (scan) {
            this.stop_scan = scan;
            this.show_stop_scan = true;
        },
        stop_stop_scan: function () {
            this.stop_scan = null;
            this.show_stop_scan = false;
        },
        confirm_stop_scan: function () {
            this.asynchronous_json_post(
                `${this.$store.state.dashboard_endpoint}/data/scan/cancel/`, {'id': this.stop_scan.id}, () => {
                    this.$emit('scan-stopped', this.stop_scan.id)
                    this.stop_stop_scan();
                }
            );
        },
        progress_bar_data: function (current_scan_state) {
            let data = this.scan_state_and_progress[current_scan_state]
            if (data === undefined) {
                data = {percentage: 0, state: "error"}
            }
            return data
        },
    }
}
</script>
<i18n>
{
    "en": {
        "id": " scan #",
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
        "last_check": "Last status update",
        "report_is_being_generated": "Report is being generated.",
        "processing_results": "Processing results.",
        "progress_bar": "Progress",
        "scan history": "Performed tasks in this scan",
        "stop_scan": "Stop scan",
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
            "storing scan results": "storing scan results",
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
        "id": "scan #",
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
        "last_check": "Laatste status update",
        "report_is_being_generated": "Report wordt gemaakt.",
        "processing_results": "Resultaten worden verwerkt.",
        "progress_bar": "Voortgang",
        "scan history": "Uitgevoerde stappen in scan",
        "stop_scan": "Stop scan",
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
            "storing scan results": "scanresultaten opslaan",
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