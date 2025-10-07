<!-- SPDX-License-Identifier: Apache-2.0 -->
<style scoped>
ol {
    list-style: decimal;
  padding-left: 1em;
}
.card-header {
    min-height: 5em;
}
</style>
<template>
    <b-card class="shadow ml-1 mr-1"
        :header-bg-variant="header_color"
        header-text-variant="light"
        footer-bg-variant="info-outline"
        footer-text-variant="light"
        header-tag="header"
        footer-tag="footer"
        >
        <template #header>

            <span v-if="scan.state === 'finished'">✅</span>
            <span v-if="scan.state === 'cancelled'">🛑️</span>
            <span v-if="!['finished', 'cancelled'].includes(scan.state)">
            <probe /></span>
            <b>&nbsp; {{ scan.type }} {{ $t("scanmonitor.scan.scan") }} "<span v-html="abbreviate(scan.list_name, 50)" />"</b> <scan-type-icon :type="scan.type" />

        </template>

        <b-card-text>

        <small>{{ $t("scanmonitor.scan.started_on") }}:
        <span :title="scan.started_on">{{
                humanize_date(scan.started_on)
            }},<br>{{ humanize_relative_date(scan.started_on) }}</span></small><br>
        <br>

        <template v-if="scan.finished && (scan.state !== 'cancelled')">
            <template v-if="scan.last_report_id">
                📊
                <router-link :to="{ name: 'numbered_report', params: { report: scan.last_report_id }}">
                    {{ $t("scanmonitor.scan.open_report") }}
                </router-link>
                <br>
                <br>
            </template>
            <template v-if="!scan.last_report_id">
                📊 {{ $t("scanmonitor.scan.report_is_being_generated") }}<br>
                <br>
            </template>
        </template>
        📘
        <router-link :to="{ name: 'numbered_lists', params: { list: scan.list_id }}">
            {{ $t("scanmonitor.scan.open_list") }}
        </router-link>
        <br><br>

        <b>{{ $t("scanmonitor.scan.progress_bar") }}</b><br>
        <template v-if="progress_bar_data(scan.log[0]['state']).state === 'error'">
            <b-progress :value="100" variant="danger">
                <b-progress-bar :value="100">
                    <span>{{ $t("scanmonitor.scan.progress." + scan.log[0]['state']) }}</span>
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
            <b v-if="scan.state === 'cancelled'">{{ $t("scanmonitor.scan.cancelled_on") }}</b>
            <b v-if="scan.state === 'finished'">{{ $t("scanmonitor.scan.finished_on") }}</b> <br>
            <span :title="scan.finished_on">{{
                    humanize_date(scan.finished_on)
                }},<br>{{ humanize_relative_date(scan.finished_on) }}</span><br><br>
        </template>


        <b>{{ $t("scanmonitor.scan.runtime") }}</b><br>
        {{ humanize_duration(scan.runtime) }}<br>
        <br>
        <template v-if="!['finished', 'cancelled'].includes(scan.state)">
            <b>{{ $t("scanmonitor.scan.message") }}</b>
            <p>{{ $t("scanmonitor.scan.progress." + scan.state) }}</p>
            <b>{{ $t("scanmonitor.scan.last_check") }}</b><br>
            <span :title="scan.last_check">{{
                    humanize_date(scan.last_check)
                }},<br>{{ humanize_relative_date(scan.last_check) }}</span><br>
            <br>
        </template>
        <b>{{ $t("scanmonitor.scan.started_on") }}</b><br>
        <span :title="scan.started_on">{{
                humanize_date(scan.started_on)
            }},<br>{{ humanize_relative_date(scan.started_on) }}</span><br>
        <br>

        <b>{{ $t("scanmonitor.scan.scan_support_id") }}</b><br>
        <span>Scan #{{ scan.id }}</span><br>
        <br>

        <collapse-panel :title='$t("scanmonitor.scan.scan history")'>
            <template #content>
              <b-alert variant="info" :model-value="true">
                <ol class="small" reversed>
                    <li v-for="log_item in scan.log" :key="log_item.id">
                        {{ $t("scanmonitor.scan.progress." + log_item.state) }},
                        {{ humanize_relative_date(log_item.at_when) }}
                    </li>
                </ol>
                </b-alert>
                <template v-if="!['finished', 'cancelled'].includes(scan.state)">
                    <b-button variant="danger" @click="visible.stop_scan = true">🛑 {{ $t("scanmonitor.scan.stop_scan") }}</b-button>

                    <StopScanModal
                      :scan="scan" v-model="visible.stop_scan"
                     @cancel="visible.stop_scan = false" @scan-stopped="scan_stopped()"
                    />

                </template>
            </template>
        </collapse-panel>

        </b-card-text>

        <template #footer>
            <template v-if="scan.status_url">
                🔖
                <template v-if="scan.state === 'finished'">
                    <a :href="scan.status_url + '/results'" target="_blank">{{ $t("scanmonitor.scan.open_in_api") }}</a>
                </template>
                <template v-else>
                    <a :href="scan.status_url" target="_blank">{{ $t("scanmonitor.scan.open_in_api") }}</a>
                </template>
                <br>
            </template>
        </template>
    </b-card>
</template>


<script>

import StopScanModal from './stopScanModal.vue'
import ScanTypeIcon from "@/components/ScanTypeIcon.vue";
import Probe from '@/components/probe.vue'
import CollapsePanel from '@/components/CollapsePanel.vue'

export default {
    components: {
      ScanTypeIcon,
        StopScanModal, Probe, CollapsePanel
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
    },
  computed: {
      header_color() {
        if (['cancelled'].includes(this.scan.state))
          return 'danger'

        if (['finished'].includes(this.scan.state))
          return 'success'

        return 'info'
      }


  }
}
</script>
