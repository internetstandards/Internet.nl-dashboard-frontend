<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
    <b-modal :visible="visible" @hidden="stop()" header-bg-variant="info"
             header-text-variant="light" no-fade scrollable>
        <h3 slot="modal-title">🛑 {{ $t("cancel.are_you_sure") }}</h3>
        <div slot="default">

            <server-response :response="response"></server-response>

            <div class="wrapper w-100">
            <span><probe /></span> &nbsp;
                <b>{{ scan.type }} {{ $t("id") }}{{ scan.id }}</b><br>
                <br>
                📘 {{ scan.list }}<br>
                <br>
                <b>{{ $t("runtime") }}</b><br>
                {{ humanize_duration(scan.runtime) }}<br>
                <br>
                <b>{{ $t("message") }}</b>
                <p>{{ $t('progress.' + scan.state) }}</p>
                <b>{{ $t("last_check") }}</b><br>
                <span :title="scan.last_check">
                {{ humanize_date(scan.last_check) }},<br>
                {{ humanize_relative_date(scan.last_check) }}
            </span><br>
                <br>
                <b>{{ $t("started_on") }}</b><br>
                <span :title="scan.started_on">
                {{ humanize_date(scan.started_on) }},<br>
                {{ humanize_relative_date(scan.started_on) }}
            </span><br>
            </div>

        </div>
        <div slot="modal-footer">
            <button class="altbutton" @click="stop()">{{ $t("cancel.cancel") }}</button>
            &nbsp;
            <button class="modal-default-button defaultbutton border-danger" @click="confirm_stop_scan()">{{
                    $t("cancel.ok")
                }}
            </button>
        </div>
    </b-modal>
</template>


<script>
import http from "@/httpclient";
import Probe from '@/components/probe'

export default {
    name: 'stop_scan',
    components: {Probe},

    data: function () {
        return {
            // cancellations:
            show_stop_scan: false,
            stop_scan: null, // the scan that will be cancelled when you hit OK
            response: {},
        }
    },
    mounted: function () {
    },
    props: {
        scan: {
            type: Object,
        },
        visible: {
            type: Boolean,
        }
    },
    methods: {
        stop: function () {
            this.$emit('cancel')
        },
        confirm_stop_scan: function () {
            http.post('/data/scan/cancel/', {'id': this.scan.id}).then(response => {
                if (response.data.success) {
                    this.$emit('scan-stopped', this.scan.id)
                }
            });
        },
    }
}
</script>
<i18n>
{
    "en": {
        "id": " scan #",
        "runtime": "Runtime",
        "message": "Status",
        "last_check": "Last status update",
        "started_on": "Started",

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
            "network_error": "network problem detected, contact the dashboard administrator",
            "configuration_error": "configuration error detected, contact the dashboard administrator",
            "timeout": "operation timed out, will retry",
            "error": "An unknown error occurred, contact the dashboard administrators",
            "cancelled": "Scan was cancelled"
        }
    },
    "nl": {
        "id": "scan #",
        "runtime": "Looptijd",
        "message": "Status",
        "last_check": "Laatste status update",
        "started_on": "Gestart",
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
            "network_error": "netwerkproblemen ontdekt, neem contact op met de dashboard beheerders",
            "configuration_error": "configuratie onjuist ingesteld, neem contact op met de dashboard beheerders",
            "timeout": "wachttijd vertreken, probeert opnieuw",
            "error": "Onbekende fout opgetreden, neem contact op met de dashboard beheerders",
            "cancelled": "Scan was gestopt"
        }
    }
}
</i18n>