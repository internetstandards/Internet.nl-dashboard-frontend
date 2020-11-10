<style scoped>

</style>
<template>
    <div>
        <h3>{{ $t("header") }}</h3>
        <p>
            <span v-if="list.last_scan">
                {{ $t("last_scan_started") }}: {{ humanize_date(list.last_scan) }}. ({{ list.last_scan_state }})
            </span>
            <span v-if="!list.last_scan">
                {{ $t("last_scan_started") }}: {{ $t("not_scanned_before") }}.
            </span>
            <template class="scan-configuration">
                <div v-if="list.enable_scans">
                    {{ $t("type_of_scan_performed") }}:
                    <span title="Mail scans will be performed" v-if="list.enable_scans && list.scan_type === 'mail'">
                            <img src="/static_frontend/images/vendor/internet_nl/icon-emailtest.svg" style="height: 16px;">
                        {{ list.scan_type }}
                    </span>
                    <span title="Web scans will be performed" v-if="list.enable_scans && list.scan_type === 'web'">
                            <img src="/static_frontend/images/vendor/internet_nl/icon-website-test.svg" style="height: 16px;">
                            {{ list.scan_type }}
                    </span>
                    <span title="No scans will be performed" v-if="!list.enable_scans">
                        🚫 {{ list.scan_type }}
                    </span><br>
                    <span v-if="urls">{{ $t("number_of_domains") }}: {{ urls.length }}</span>
                    <span v-if="!urls">{{ $t("number_of_domains") }}: {{ list.num_urls }}</span>
                    <br>
                    {{ $t("scan_frequency") }}: {{ $t(`${list.automated_scan_frequency}`) }} <br>
                    <div v-if="list.automated_scan_frequency !== 'disabled'">
                        {{ $t("next_scheduled_scan") }}: {{ humanize_date(list.scheduled_next_scan) }} <br>
                    </div>
                </div>
                <div v-if="!list.enable_scans"> {{ $t("scanning_disabled") }} </div>
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
export default {
    name: "about-this-list",
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
        "last_scan_started": "Last scan started",
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