<!-- SPDX-License-Identifier: Apache-2.0 -->
<style scoped>
.incorrect_urls {
    width: 100%; background-color: #ffd9d9; height: 60px; overflow: scroll;
}
.url_textarea {
    width: 100%; height: 180px;
}
</style>

<template>
    <b-modal :visible="visible" @hidden="stop()" header-bg-variant="info"
             header-text-variant="light" no-fade scrollable size="xl">
        <h3 slot="modal-title">🌐 {{ $t("title") }}</h3>
        <div slot="default">

            <server-response :response="response" v-if="response" :message="$t('' + response.message)" />

            <ul v-if="response.success === true">
                <li v-if="response.data.duplicates_removed">
                    {{ $t("removed_n_duplicates", [response.data.duplicates_removed]) }}
                </li>
                <li v-if="response.data.already_in_list">{{ $t("ignored_n", [response.data.already_in_list]) }}</li>
                <li>{{ $t("added_n_to_list", [response.data.added_to_list]) }}
                </li>
            </ul>

            <template v-if="response.data">
                <span v-if="response.data.incorrect_urls.length">
                    ⚠️ <b>{{ $t("warning") }}</b><br>
                    <span v-html='$t("warning_message")'></span>:
                    <div class="incorrect_urls">{{ response.data.incorrect_urls.join(', ') }}</div>
                </span>
                <br>
            </template>

            <label for="dms">{{ $t("domains_label") }}:</label>
            <textarea id="dms" v-model="new_domains" class="url_textarea" :placeholder="$t('message')"></textarea>
            <br>
            <br>

        </div>
        <div slot="modal-footer">
            <button class="altbutton" @click="stop()">{{ $t("cancel") }}</button>
            &nbsp;
            <template v-if="!loading">
                <button class="defaultbutton modal-default-button" @click="bulk_add_new()">
                    {{ $t("ok") }}
                </button>
            </template>
            <template v-else>
                <button disabled="disabled" class="defaultbutton modal-default-button"><probe />
                    {{ $t("loading") }}
                </button>
            </template>
        </div>
    </b-modal>
</template>

<script>
import http from "@/httpclient";
import Probe from '@/components/probe'

export default {
    name: "AddDomains",
    components: {
        Probe
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
            new_domains: "",
            response: {},
            loading: false,
        }
    },
    methods: {
        stop: function () {
            this.reset();
            this.$emit('cancel')
        },
        reset: function() {
            this.new_domains = "";
            this.response = {};
        },
        bulk_add_new: function () {
            this.loading = true;

            http.post('/data/urllist/url/add/', {'urls': this.new_domains, 'list_id': this.list.id}).then(data => {
                // {'incorrect_urls': [], 'added_to_list': int, 'already_in_list': int}
                this.response = data.data;
                this.loading = false;

                if (data.data.success) {
                    this.$emit('added')
                }
            });
        },
    }
}
</script>

<i18n>
{
    "en": {
        "title": "Add domains",
        "domains_label": "Add domains in the text field below",
        "message": "Domains are separated by a comma, space or new line. These can be mixed. For example: \n\ninternet.nl, dashboard.internet.nl\nexample.com www.example.com, \nhttps://my.example.com:80/index.html",
        "ok": "Add the above domains to the list",
        "cancel": "Close",
        "status": "Status",
        "nothing_added": "nothing added yet.",
        "added_n_to_list": "{0} domains added to this list. Take care: if the new domains are not shown in the list right away, wait a short while and reload the list.",
        "removed_n_duplicates": "{0} duplicates removed from the input.",
        "ignored_n": "{0} domains are already in this list.",
        "warning": "Warning!",
        "warning_message": "Some domains where not added because they are in an incorrect format. The following domains where not added",
        "loading": "Domains are being processed",
        "add_domains_valid_urls_added": "New domains have processed, see the status report for details.",
        "add_domains_list_does_not_exist": "This list does not exist.",
        "undefined": "undefined",
        "too_many_domains": "The amount of domains in this list exceeds the total amount of domains allowed in a list."
    },
    "nl": {
        "title": "Domeinen toevoegen",
        "domains_label": "Voer nieuwe domeinen in",
        "message": "Domeinen worden gescheiden door een komma, spatie, nieuwe regel. Deze mogen ook door elkaar worden gebruikt. Bijvoorbeeld: \n\ninternet.nl, dashboard.internet.nl\nexample.com www.example.com\nhttps://my.example.com:80/index.html",
        "ok": "Voeg bovenstaande domeinen toe aan de lijst",
        "status": "Status",
        "cancel": "Sluiten",
        "nothing_added": "nog niets toegevoegd.",
        "added_n_to_list": "{0} domeinen zijn aan de lijst toegevoegd. Let op: als de nieuwe domeinen niet direct in de lijst staan, wacht dan even en herlaad de lijst.",
        "removed_n_duplicates": "{0} dubbel ingevoerde domeinen zijn overgeslagen.",
        "ignored_n": "{0} domeinen zitten al in de lijst.",
        "warning": "Waarschuwing!",
        "warning_message": "Sommige domeinen zijn niet in een geldig formaat. Controleer de volgende domeinen en probeer het opnieuw:",
        "loading": "Domeinen worden verwerkt",
        "add_domains_valid_urls_added": "Nieuwe domeinen zijn verwerkt, zie het statusoverzicht voor details.",
        "add_domains_list_does_not_exist": "Deze lijst bestaat niet.",
        "undefined": "undefined",
      "too_many_domains": "Het aantal domeinen is deze lijst is groter dan is toegestaan."
    }
}
</i18n>