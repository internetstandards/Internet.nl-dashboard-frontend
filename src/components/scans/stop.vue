<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
    <b-modal :visible="visible" @hidden="stop()" header-bg-variant="info"
             header-text-variant="light" no-fade scrollable>
        <h3 slot="modal-title">🛑 {{ $t("scanmonitor.stop_form.cancel.are_you_sure") }}</h3>
        <div slot="default">

            <server-response :response="response"></server-response>

            <div class="wrapper w-100">
            <span><probe /></span> &nbsp;
                <b>{{ scan.type }} {{ $t("scanmonitor.stop_form.id") }}{{ scan.id }}</b><br>
                <br>
                📘 {{ scan.list }}<br>
                <br>
                <b>{{ $t("scanmonitor.stop_form.runtime") }}</b><br>
                {{ humanize_duration(scan.runtime) }}<br>
                <br>
                <b>{{ $t("scanmonitor.stop_form.message") }}</b>
                <p>{{ $t("scanmonitor.stop_form.progress." + scan.state) }}</p>
                <b>{{ $t("scanmonitor.stop_form.last_check") }}</b><br>
                <span :title="scan.last_check">
                {{ humanize_date(scan.last_check) }},<br>
                {{ humanize_relative_date(scan.last_check) }}
            </span><br>
                <br>
                <b>{{ $t("scanmonitor.stop_form.started_on") }}</b><br>
                <span :title="scan.started_on">
                {{ humanize_date(scan.started_on) }},<br>
                {{ humanize_relative_date(scan.started_on) }}
            </span><br>
            </div>

        </div>
        <div slot="modal-footer">
            <button class="altbutton" @click="stop()">{{ $t("scanmonitor.stop_form.cancel.cancel") }}</button>
            &nbsp;
            <button class="modal-default-button defaultbutton border-danger" @click="confirm_stop_scan()">{{
                    $t("scanmonitor.stop_form.cancel.ok")
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
