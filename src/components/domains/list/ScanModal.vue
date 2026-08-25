<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
    <b-modal @hidden="cancel()" header-bg-variant="info" header-text-variant="light" no-close-on-backdrop no-fade scrollable>
      <template #header><h4>🔬 {{ $t("domain.list.scan.title") }}</h4></template>
        <template #default>
            <server-response :response="response"></server-response>
            <p>{{ $t("domain.list.scan.message") }}</p><br>
            <p><i>{{ $t("domain.list.scan.notices") }}</i></p>
        </template>
        <template #footer>
            <b-button variant="secondary" @click="cancel()">{{ $t("domain.list.scan.cancel") }}</b-button>
            &nbsp;
            <b-button variant="warning" :disabled="scan_now_confirmed"
                    @click="confirm_scan_now()">
                <span v-if="!scan_now_confirmed">{{ $t("domain.list.scan.ok") }}</span>
                <span v-if="scan_now_confirmed">{{ $t("domain.list.scan.starting") }}</span>
            </b-button>
        </template>
    </b-modal>
</template>

<script>
import http from "@/httpclient";
import {dashboardStore} from '@/dashboardStore'

export default {
    name: "scan-list.vue",
    props: {
        list: {
            type: Object,
        }
    },
    data: function () {
        return {
            response: {},
            scan_now_confirmed: false,
            scan_monitor_refresh_timeout: null,
            store: dashboardStore(),
        }
    },
    beforeUnmount() {
        if (this.scan_monitor_refresh_timeout !== null) {
            window.clearTimeout(this.scan_monitor_refresh_timeout)
        }
    },
    methods: {
        cancel: function () {
            this.response = {};
            this.$emit('cancel')
        },
        confirm_scan_now: function () {
            this.scan_now_confirmed = true;

            http.post(`/api/v1/urllists/${this.list.id}/scans`).then(server_response => {
                this.response = server_response.data;

                if (server_response.data.success) {
                    this.list.scan_now_available = false;
                    this.response = {};
                    this.scan_now_confirmed = false;
                    this.schedule_scan_monitor_refresh();
                    this.$emit('started')
                }

                if (server_response.data.error) {
                    this.scan_now_confirmed = false;
                }
            });
        },
        schedule_scan_monitor_refresh: function () {
            if (this.scan_monitor_refresh_timeout !== null) {
                window.clearTimeout(this.scan_monitor_refresh_timeout)
            }

            this.scan_monitor_refresh_timeout = window.setTimeout(() => {
                this.scan_monitor_refresh_timeout = null;
                this.store.load_scan_monitor_data().catch(error => {
                    console.error('Unable to refresh scan monitor data after starting a scan.', error)
                });
            }, 5000);
        },
    }
}
</script>
