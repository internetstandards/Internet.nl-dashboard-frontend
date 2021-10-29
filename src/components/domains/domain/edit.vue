<!-- SPDX-License-Identifier: Apache-2.0 -->
<style scoped>
.inline-edit input {
    margin-bottom: 0 !important;
}

.inline-edit button {
    font-size: 0.7em !important;
    margin: 0 !important;
    height: 23px;
}
</style>

<template>
    <div v-if="visible">

        <format-scan-eligibility :scan_type="list.scan_type" :url="url" />
        &nbsp;
        <button v-if="!is_edited" class="inline-edit"
                :title="$t('start_editing_url', [edited_url_value])"
                @click="start_url_editing()" aria-expanded="false">
            🖊
            <span class="visuallyhidden">{{ $t('start_editing_url', [edited_url_value]) }}</span>
        </button>
        <button v-if="is_edited" class="inline-edit"
                :title="$t('cancel_editing_url', [edited_url_value])"
                @click="cancel_edit_url()" aria-expanded="true">
            🖊
            <span class="visuallyhidden">{{ $t('cancel_editing_url', [edited_url_value]) }}</span>
        </button>
        &nbsp;
        <template v-if="displayed_url.subdomain">
            <a v-if="!is_edited" @click="start_url_editing()">
                {{ displayed_url.subdomain }}.<b>{{ displayed_url.domain }}.{{ displayed_url.suffix }}</b>
            </a>
        </template>
        <template v-if="!displayed_url.subdomain">
            <a v-if="!is_edited" @click="start_url_editing()">
                <b>{{ displayed_url.domain }}.{{ displayed_url.suffix }}</b>
            </a>
        </template>

        <tag v-for="tag in this.displayed_url.tags" :key="tag" :value="tag" />

        <span class="inline-edit" v-if="is_edited">
            <input autofocus :placeholder="edited_url_value" v-model="edited_url_value">&nbsp;
            <button @click="save_edit_url()" :title="$t('save_edited_url', [edited_url_value])">
                {{ $t("button_labels.save") }}
                <span class="visuallyhidden">{{ $t('save_edited_url', [edited_url_value]) }}</span>
            </button>&nbsp;
            <button @click="cancel_edit_url()" :title="$t('cancel_editing_url', [edited_url_value])">
                {{ $t("button_labels.cancel") }}
                <span class="visuallyhidden">{{ $t('cancel_editing_url', [edited_url_value]) }}</span>
            </button>&nbsp;
            <button @click="remove_edit_url(list.id, url.id)" :title="$t('delete_edited_url', [edited_url_value])">
                {{ $t("button_labels.remove") }}
                <span class="visuallyhidden">{{ $t('delete_edited_url', [edited_url_value]) }}</span>
            </button>
        </span>

    </div>
</template>

<script>
import http from "@/httpclient";
import Tag from "@/components/domains/domain/tag";
import FormatScanEligibility from "@/components/domains/FormatScanEligibility";

export default {
    name: "edit",
  components: {FormatScanEligibility, Tag},
  data: function () {
        return {
            is_edited: false,
            visible: true,

            url_edit: '',
            original_url_value: '',

            edited_url_value: '',
            displayed_url: {
                subdomain: "",
                domain: "",
                suffix: "",
            }
        }
    },
    props: {
        list: {
            type: Object
        },
        url: {
            type: Object
        }
    },
    mounted: function () {
        this.edited_url_value = this.url.url;
        this.displayed_url.subdomain = this.url.subdomain;
        this.displayed_url.domain = this.url.domain;
        this.displayed_url.suffix = this.url.suffix;
        this.displayed_url.tags = this.url.tags;
        this.original_url_value = this.url.url;
    },
    methods: {
        start_url_editing: function () {
            this.is_edited = true;

        },
        cancel_edit_url: function () {
            this.edited_url_value = this.original_url_value;
            this.is_edited = false;
        },
        remove_edit_url: function (list_id, url_id) {
            let data = {'list_id': list_id, 'url_id': url_id};
            http.post('/data/urllist/url/delete/', data).then(server_response => {
                this.delete_response = server_response.data;

                if (server_response.data.success) {
                    this.is_edited = false;
                    this.$emit('domain_deleted');

                    // hide yourself from the list, instead of destroying yourself.
                    this.visible = false;
                }
            });
        },
        save_edit_url: function () {
            /*
            * This is not a real 'save' but an add to list and create if it doesn't exist operation.
            * The save does not 'alter' the existing URL in the database. It will do some list operations.
            * */
            let data = {'list_id': this.list.id, 'url_id': this.url.id, 'new_url_string': this.edited_url_value}
            http.post('/data/urllist/url/save/', data).then(server_response => {
                if (server_response.data.success === true) {
                    // now that saving was succesful, undo=ing should be to the newely saved url.
                    this.original_url_value = this.edited_url_value;

                    // in case the url is the same as the original, do not update it.
                    this.displayed_url.subdomain = server_response.data.data.created.subdomain;
                    this.displayed_url.domain = server_response.data.data.created.domain;
                    this.displayed_url.suffix = server_response.data.data.created.suffix;

                    this.is_edited = false;
                } else {
                    this.edited_url_value = this.original_url_value;
                }
            });
        },
    }
}
</script>

<i18n>
{
    "en": {
        "start_editing_url": "Edit {0}.",
        "cancel_editing_url": "Cancel editing and store the original value: {0}",
        "save_edited_url": "Save changes, the change will be applied to {0}.",
        "delete_edited_url": "Delete {0} from this list.",
        "button_labels": {
            "save": "Save",
            "cancel": "Cancel",
            "remove": "Remove"
        }
    },
    "nl": {
        "eligeble_mail": "E-mail scannen is mogelijk",
        "start_editing_url": "Bewerk {0}.",
        "button_labels": {
            "save": "Opslaan",
            "cancel": "Annuleren",
            "remove": "Verwijderen"
        }
    }
}
</i18n>