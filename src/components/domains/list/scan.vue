<style scoped>

</style>

<template>
    <b-modal :visible="visible" @hidden="cancel()" header-bg-variant="info" header-text-variant="light" no-fade
             scrollable>
        <h3 slot="modal-title">🔬 {{ $t("title") }}</h3>
        <div slot="default">
            <server-response :response="response"></server-response>
            <p>{{ $t("message") }}</p>
            <p><i>{{ $t("notices") }}</i></p>
        </div>
        <div slot="modal-footer">
            <button class='altbutton' @click="cancel()">{{ $t("cancel") }}</button>
            &nbsp;
            <button class="defaultbutton modal-default-button" :disabled="scan_now_confirmed"
                    @click="confirm_scan_now()">
                <span v-if="!scan_now_confirmed">{{ $t("ok") }}</span>
                <span v-if="scan_now_confirmed">{{ $t("starting") }}</span>
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

<i18n>
{
    "en": {
        "title": "Confirm to scan",
        "message": "Click 'Scan now' to start scanning.",
        "notices": "The scan is visible at the scan monitor. You can cancel a scan at any time in the scan monitor.",
        "cancel": "Cancel",
        "ok": "Scan now",
        "starting": "Starting..."
    },
    "nl": {
        "title": "Nu scannen?",
        "message": "Klik op 'nu scannen' om de scan te starten.",
        "notices": "De scan is te volgen in de scan monitor. Daar is het ook mogelijk om de scan te stoppen.",
        "cancel": "Annuleer",
        "ok": "Nu scannen",
        "starting": "Opstarten..."
    }
}
</i18n>