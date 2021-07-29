<template>
    <b-modal :visible="visible" @hidden="cancel()" header-bg-variant="info" header-text-variant="light" no-fade
             scrollable>
        <h3 slot="modal-title">📝 {{ $t("title") }}</h3>
        <div slot="default">

            <server-response :response="response"></server-response>

            <label for="name">{{ $t("urllist.field_label_name") }}:</label><br>
            <b-form-input id="name" type="text" maxlength="120" v-model="list.name"></b-form-input>
            <br>

            <label for="scan_type">{{ $t("urllist.field_label_scan_type") }}:</label><br>
            <b-form-select id="scan_type" v-model="list.scan_type">
                <b-form-select-option value="web">{{ $t("urllist.scan_type_web") }}</b-form-select-option>
                <b-form-select-option value="mail">{{ $t("urllist.scan_type_mail") }}</b-form-select-option>
            </b-form-select>
            <br><br>

            <label for="automated_scan_frequency">
                {{ $t("urllist.field_label_automated_scan_frequency") }}:</label><br>
            <b-form-select id="automated_scan_frequency" v-model="list.automated_scan_frequency">
                <b-form-select-option value="disabled">
                    {{ $t("urllist.automated_scan_frequency.disabled") }}
                </b-form-select-option>
                <b-form-select-option value="every half year">
                    {{ $t("urllist.automated_scan_frequency.every_half_year") }}
                </b-form-select-option>
                <b-form-select-option value="at the start of every quarter">
                    {{ $t("urllist.automated_scan_frequency.every_quarter") }}
                </b-form-select-option>
                <b-form-select-option value="every 1st day of the month">
                    {{ $t("urllist.automated_scan_frequency.every_month") }}
                </b-form-select-option>
                <b-form-select-option value="twice per month">
                    {{ $t("urllist.automated_scan_frequency.twice_per_month") }}
                </b-form-select-option>
            </b-form-select>

        </div>
        <div slot="modal-footer">
            <button class='altbutton' @click="cancel()">{{ $t("cancel") }}</button>
            &nbsp;
            <button class="modal-default-button defaultbutton" @click="update_list_settings()">
                {{ $t("ok") }}
            </button>
        </div>
    </b-modal>
</template>

<script>
import sharedMessages from "@/components/translations/dashboard";
import http from "@/httpclient";

export default {
    name: "configure-list",
    i18n: {
        sharedMessages: sharedMessages,
    },
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
            old_list_settings: {},
            response: {}
        }
    },
    methods: {
        cancel: function () {
            this.response = {};
            this.list.automated_scan_frequency = this.old_list_settings.automated_scan_frequency;
            this.list.scan_type = this.old_list_settings.scan_type;
            this.list.name = this.old_list_settings.name;
            this.$emit('cancel')
        },
        update_list_settings: function () {
            http.post('/data/urllist/update_list_settings/', this.list).then(server_response => {
                this.response = server_response.data;
                if (server_response.data.success) {
                    this.old_list_settings = this.copy_json_value(server_response.data.data);
                    this.$emit("done")
                }
            });
        },
    },
    mounted: function () {
        this.old_list_settings = this.copy_json_value(this.list);
        this.response = {};
    }
}
</script>

<i18n>
{
    "en": {
        "title": "Settings",
        "cancel": "Cancel",
        "ok": "Update"
    },
    "nl": {
        "title": "Instellingen",
        "cancel": "Annuleer",
        "ok": "Opslaan"
    }
}
</i18n>