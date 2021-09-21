<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
    <b-modal :visible="visible" @hidden="cancel()" header-bg-variant="danger" header-text-variant="light" no-fade
             scrollable>
        <h3 slot="modal-title">🗑️ {{ $t("delete_form.title") }}</h3>
        <div slot="default">
            <server-response :response="delete_response"></server-response>

            <p class="dialog_warning">{{ $t("delete_form.message") }}</p>

            <label for="name">{{ $t("urllist.field_label_name") }}:</label><br>
            {{ list.name }}<br>
            <br>

            <label>{{ $t("urllist.field_label_enable_scans") }}:</label><br>
            {{ list.enable_scans }}<br>
            <br>

            <label for="scan_type">{{ $t("urllist.field_label_scan_type") }}:</label><br>
            {{ list.scan_type }}<br>
            <br>

            <label for="automated_scan_frequency">{{
                    $t("urllist.field_label_automated_scan_frequency")
                }}:</label><br>
            {{ list.automated_scan_frequency }}<br>
            <br>

        </div>
        <div slot="modal-footer">
            <button class="altbutton" @click="cancel()">{{ $t("delete_form.cancel") }}</button>
            &nbsp;
            <button class="defaultbutton modal-default-button" @click="confirm_deletion()">
                {{ $t("delete_form.ok") }}
            </button>
        </div>
    </b-modal>
</template>

<script>
import sharedMessages from './../../translations/dashboard.js'
import http from "@/httpclient";

export default {
    name: "delete-list",
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
            delete_response: {},
        }
    },
    methods: {
        cancel: function () {
            this.response = {};
            this.$emit('cancel')
        },
        confirm_deletion: function () {
            http.post(`/data/urllist/delete/`, {'id': this.list.id}).then(server_response => {
                if (server_response.data.success) {
                    this.$emit('removelist', this.list.id);
                } else {
                    this.delete_response = server_response.data;
                }
            });
        },
    },
    mounted: function () {
        this.old_list_settings = this.copy_json_value(this.list);
        this.settings_update_response = {};
    }
}
</script>

<i18n>
{
    "en": {
        "delete_form": {
            "title": "Are you sure?",
            "message": "Are you sure you want to delete this list? Deleting this list cannot be undone.",
            "cancel": "No, take me back",
            "ok": "Yes, Delete"
        }
    },
    "nl": {
        "delete_form": {
            "title": "Weet u het zeker?",
            "message": "Weet u zeker dat u deze lijst wil verwijderen? Dit kan niet ongedaan worden gemaakt.",
            "cancel": "Nee, niet verwijderen",
            "ok": "Ja, verwijder"
        }
    }
}
</i18n>