<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
    <div>
        <!-- <h3>{{ $t("header") }}</h3> -->
        <p>
          <DashboardIcon icon="hourglass-split" />

            <span v-if="list.last_scan">
                {{ $t("last_scan_started") }}: {{ humanize_date(list.last_scan) }}, {{ list.last_scan_state }}.
            </span>
            <span v-if="!list.last_scan">
                {{ $t("last_scan_started") }}: {{ $t("not_scanned_before") }}.
            </span>
            <br>
            <template class="scan-configuration">
                <span v-if="list.enable_scans">

                  <DashboardIcon icon="link" />


                    {{ $t("type_of_scan_performed") }}:
                    <span v-if="list.enable_scans">
                      <scan-type-icon :type="list.scan_type" /> {{ list.scan_type }}
                    </span>
                    <span title="No scans will be performed" v-if="!list.enable_scans">
                        🚫 {{ list.scan_type }}
                    </span><br>

                  <DashboardIcon icon="arrow-repeat" :scale="0.8" />


                    {{ $t("scan_frequency") }}: {{ $t(`${list.automated_scan_frequency}`) }} <br>
                    <span v-if="list.automated_scan_frequency !== 'disabled'">
                        {{ $t("next_scheduled_scan") }}: {{ humanize_date(list.scheduled_next_scan) }} <br>
                    </span>
                </span>
                <span v-if="!list.enable_scans"> {{ $t("scanning_disabled") }} </span>
            </template>
            <span v-if="list.last_report_id">
                <router-link :to="{ name: 'numbered_report', params: { report: list.last_report_id }}">
                    <span role="img" :aria-label="$t('report')">📊</span>
                    {{ $t("latest_report") }}: {{ humanize_date(list.last_report_date) }}
                </router-link>
                <br>
            </span>
        </p>
    </div>
</template>

<script>
import ScanTypeIcon from "@/components/ScanTypeIcon";
import DashboardIcon from "@/components/DashboardIcon";
export default {
    name: "about-this-list",
  components: {DashboardIcon, ScanTypeIcon},
  props: {
        list: {
            type: Object
        },
        urls: {
            type: Array
        }
    }
}
</script>

<i18n>
{
    "en": {
        "report": "report",
        "header": "About this list",
        "number_of_domains": "Number of domains",
        "last_scan_started": "Last scan started at",
        "still_running": "still running",
        "finished": "finished",
        "not_scanned_before": "Not scanned before",
        "type_of_scan_performed": "Type of scan performed",
        "scan_frequency": "Scan frequency",
        "next_scheduled_scan": "Next scheduled scan",
        "scanning_disabled": "Scanning of this list is disabled.",
        "latest_report": "Latest report",
        "disabled": "disabled",
        "every half year": "every half year",
        "at the start of every quarter": "at the start of every quarter",
        "every 1st day of the month": "every first day of the month",
        "twice per month": "every two weeks, from the first day of the month"
    },
    "nl": {
        "report": "rapport",
        "header": "Over deze lijst",
        "number_of_domains": "Aantal domeinen",
        "last_scan_started": "Laatste scan gestart op",
        "still_running": "loopt nog",
        "finished": "afgerond",
        "not_scanned_before": "Niet eerder gescand",
        "type_of_scan_performed": "Soort scan",
        "scan_frequency": "Scan frequentie",
        "next_scheduled_scan": "Volgende ingeplande scan",
        "scanning_disabled": "Scannen van deze lijst is uitgeschakeld.",
        "latest_report": "Meest actuele rapportage",
        "disabled": "uitgeschakeld",
        "every half year": "ieder half jaar",
        "at the start of every quarter": "aan het begin van ieder kwartaal",
        "every 1st day of the month": "elke eerste dag van de maand",
        "twice per month": "om de twee weken, vanaf de 1e van de maand"
    }
}
</i18n>