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
                <span v-if="!list.enable_scans"> {{ $t("scanning_disabled") }} </span><br>
            </template>

            <DashboardIcon icon="share" :scale="0.5" class="mr-1"/>
            <span v-if="!list.automatically_share_new_reports">{{$t('Not automatically shared')}}</span>
            <span v-if="list.automatically_share_new_reports">{{$t('Automatically shared')}} <span v-if="list.default_public_share_code_for_new_reports">{{$t('with share code')}}</span></span>
             <a v-if="list.enable_report_sharing_page" :href="`/#/published/${$store.state.user.account_id}/`" target="_blank"> {{$t('Listed on sharing page')}}</a>
          <br>

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
        "Automatically shared": "Automatically shared",
        "Not automatically shared": "Not automatically shared",
        "Listed on sharing page": "on sharing page",
        "with share code": "with share code"
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
        "latest_report": "Actueelste rapportage",
        "Automatically shared": "Automatisch gedeeld",
        "Not automatically shared": "Niet automatisch gedeeld",
        "Listed on sharing page": "op openbare pagina",
        "with share code": "met deelcode"
    }
}
</i18n>