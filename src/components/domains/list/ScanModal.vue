<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
    <b-modal :visible="visible" @hidden="cancel()" header-bg-variant="info" header-text-variant="light" no-fade
             scrollable>
        <h3 slot="modal-title">🔬 {{ $t("domain.list.scan.title") }}</h3>
        <div slot="default">
            <server-response :response="response"></server-response>
            <p>{{ $t("domain.list.scan.message") }}</p>
            <p><i>{{ $t("domain.list.scan.notices") }}</i></p>
        </div>
        <div slot="modal-footer">
            <button class='altbutton' @click="cancel()">{{ $t("domain.list.scan.cancel") }}</button>
            &nbsp;
            <button class="defaultbutton modal-default-button" :disabled="scan_now_confirmed"
                    @click="confirm_scan_now()">
                <span v-if="!scan_now_confirmed">{{ $t("domain.list.scan.ok") }}</span>
                <span v-if="scan_now_confirmed">{{ $t("domain.list.scan.starting") }}</span>
            </button>
        </div>
    </b-modal>
</template>

<script>
import http from "@/httpclient";

export default {
    name: "scan-list.vue",
    props: {
        list: {
            type: Object,
        },
        visible: {
            type: Boolean,
        }
    },
    data: function () {
        return {
            response: {},
            scan_now_confirmed: false,
        }
    },
    methods: {
        cancel: function () {
            this.response = {};
            this.$emit('cancel')
        },
        confirm_scan_now: function () {
            let data = {'id': this.list.id};

            this.scan_now_confirmed = true;

            http.post('/data/urllist/scan_now/', data).then(server_response => {
                this.response = server_response.data;

                if (server_response.data.success) {
                    this.list.scan_now_available = false;
                    this.response = {};
                    this.scan_now_confirmed = false;
                    this.$emit('started')
                }

                if (server_response.data.error) {
                    this.scan_now_confirmed = false;
                }
            });
        },
    }
}
</script>
