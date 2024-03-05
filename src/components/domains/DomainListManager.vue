<!-- SPDX-License-Identifier: Apache-2.0 -->
<!--
This can do:

Done: create new lists
Done: configure lists
Done: add domains
Done: delete lists
Done: edit url
Done: delete url
Done: cancel what you're doing using escape
Done: support scan types
Done: show lists, including last scan moment
Done: Sorting of urls by domain and then subdomains.
Done: support 'scan now' button.
Done: what happens when the edited url is not valid?
Done: Add new list to the top.
Done: when scan now is clicked, disable scan now button.
Done: pasting too many urls in the select2 causes an overflow. Size it properly.
Done: Show link to last report
Done: translation
Can't reproduce: Bulk add has a bug when only adding 1 to the list, the list of submitted domains is not updated often enough / not reactive.
Fixed: When a list is added, the urls of each list are not moved to the next list. This is not reactive and might case issues.
Fixed: when deleting a list, it is re-added to the list of lists when adding a new list, this is not reactive and causes issues.
 (most of the above errors would be solved if we would only add things to the end of the list?).
-->
<style>
#lists_ .list_warning {
    font-size: 1.2em;
    font-weight: bold;
}
</style>
<template>
    <div>
        <content-block>
            <h1><b-icon icon="card-list" /> {{ $t("title") }}</h1>
            <p>{{ $t("intro") }}</p>
            <p>
                <button v-b-modal="'show_add_new'" accesskey="n">📚 {{ $t("new_list.add_new_list") }}</button>
                &nbsp;
                <router-link to="/domains/upload" custom v-slot="{ navigate }">
                  <button  @click="navigate" @keypress.enter="navigate">
                  📓 {{ $t("bulk_upload_link") }}
                  </button>
                </router-link>
            </p>

            <collapse-panel :title='$t("icon_legend.title")'>
                <div slot="content">
                    <p>{{ $t("icon_legend.intro") }}</p>
                    <ul>
                        <li>
                            <span role="img" :aria-label="$t('icons.can_connect')">🌍️</span>
                            {{ $t("icon_legend.can_connect") }}
                        </li>
                        <li>
                            <span role="img" :aria-label="$t('icons.unknown_connectivity')">❓</span>
                            {{ $t("icon_legend.unknown_connectivity") }}
                        </li>
                        <li><span role="img" :aria-label="$t('icons.cannot_connect')">🚫</span>
                            {{ $t("icon_legend.cannot_connect") }}
                        </li>
                    </ul>
                </div>
            </collapse-panel>

            <b-modal id="show_add_new" header-bg-variant="info" header-text-variant="light" no-fade scrollable>
                <h3 slot="modal-title">📚 {{ $t("new_list.add_new_list") }}</h3>

                <div slot="default">
                    <server-response :response="add_new_server_response"></server-response>

                    <label for="name">{{ $t("urllist.field_label_name") }}:</label><br>
                    <b-form-input id="name" type="text" maxlength="120" v-model="add_new_new_list.name"></b-form-input>
                    <br>

                    <label for="scan_type">{{ $t("urllist.field_label_scan_type") }}:</label><br>
                    <b-form-select id="scan_type" v-model="add_new_new_list.scan_type">
                        <b-form-select-option value="web">{{ $t("urllist.scan_type_web") }}</b-form-select-option>
                        <b-form-select-option value="mail">{{ $t("urllist.scan_type_mail") }}</b-form-select-option>
                        <b-form-select-option value="all">{{ $t("urllist.scan_type_all") }}</b-form-select-option>
                    </b-form-select>
                    <br><br>

                    <label for="automated_scan_frequency">
                        {{ $t("urllist.field_label_automated_scan_frequency") }}:
                    </label>

                    <b-form-select id="automated_scan_frequency" v-model="add_new_new_list.automated_scan_frequency">
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
                    </b-form-select><br><br>

                    <b-form-checkbox id="automatically_share_new_reports" v-model="add_new_new_list.automatically_share_new_reports">
                      {{ $t("urllist.automatically_share_new_reports") }}
                    </b-form-checkbox>
                    <br>

                    <label for="default_public_share_code_for_new_reports">{{
                        $t("urllist.default_public_share_code_for_new_reports")
                      }}:</label><br>
                      <b-input-group class="mt-3">
                        <b-form-input id="default_public_share_code_for_new_reports" type="text" maxlength="120"
                                      :placeholder="$t('urllist.empty_is_no_share_code')"
                                      v-model="add_new_new_list.default_public_share_code_for_new_reports">

                        </b-form-input>
                        <b-input-group-append>
                          <!-- better would be to btoa(String.fromCharCode.apply(null,self.crypto.getRandomValues(new Uint8Array(15)))).replaceAll('+','-').replaceAll('/','_') -->
                          <b-button variant="outline-success" @click="add_new_new_list.default_public_share_code_for_new_reports = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);;">{{ $t('urllist.generate_code') }}</b-button>
                        </b-input-group-append>
                      </b-input-group>
                    <br>

                    <b-form-checkbox id="enable_report_sharing_page" v-model="add_new_new_list.enable_report_sharing_page">
                      {{ $t("urllist.enable_report_sharing_page") }}.
                      <a :href="`/#/published/${$store.state.user.account_id}/`" target="_blank">{{$t('urllist.to_overview_page')}}</a>
                    </b-form-checkbox>

                </div>
                <div slot="modal-footer">
                    <button class='altbutton' @click="$bvModal.hide('show_add_new')">
                        {{ $t("new_list.button_close_label") }}
                    </button> &nbsp;
                    <button class="defaultbutton modal-default-button" @click="create_list()">
                        {{ $t("new_list.button_create_list_label") }}
                    </button>
                </div>
            </b-modal>

        </content-block>

        <loading :loading="loading"></loading>

        <content-block v-if="one_of_the_lists_contains_warnings" class="managed-url-list">
            <span class="list_warning">
                <span role="img" :aria-label="$t('icons.list_warning')">⚠️</span> {{ $t("warning_found_in_list") }}
            </span>
        </content-block>

        <!--
        The usage of v-bind:key="list.id" makes sure that data + props match. Would you not use a key, the
        property of the component are updated, but the data is kept. This results in weird glitches.
        https://vuejs.org/v2/guide/list.html#v-for-with-a-Component

        Keys re-render the component, so all state is destroyed. It's closed again without urls.
        What we would like is that when rerendering, the state (data) would also transfer to the correct component
        https://michaelnthiessen.com/force-re-render/
        -->
        <url-list
            :initial_list="list"
            :start_opened="list.start_opened ? true : false"
            :maximum_domains="maximum_domains_per_list"
            :key="list.id"
            v-on:removelist="removelist"
            v-for="list in lists" />

        <content-block v-if="!lists.length" class="no-content">
            {{ $t("inital_list.start") }} <br>
            <button class="border-success m-4" size="" v-b-modal="'show_add_new'" accesskey="n">📚 {{ $t("new_list.add_new_list") }}</button>
            <br>
            <br>
            <p>
                <router-link to="/domains/upload">{{ $t('inital_list.alternative_start') }}</router-link>
            </p>
        </content-block>

    </div>
</template>

<script>
import UrlList from './UrlList.vue'
import sharedMessages from './../translations/dashboard.js'
import http from "@/httpclient";
import CollapsePanel from '@/components/CollapsePanel'

export default {
    components: {
        UrlList, CollapsePanel
    },
    i18n: {
        sharedMessages: sharedMessages,
    },
    data: function () {
        return {
            loading: false,
            lists: [],

            // possible things that can go wrong in list validation.
            maximum_domains_per_list: 10000,

            // everything that has something to do with adding a new list:
            add_new_server_response: {},
            add_new_new_list: {},
        }
    },
    mounted: function () {
        this.get_lists();
        this.$root.$on('bv::modal::show', (bvEvent, modalId) => {
            if (modalId === "show_add_new") {
                this.reset_add_new_form()
            }
        })
    },
    methods: {
        removelist: function (list_id) {
            // console.log('removing');
            this.lists.forEach(function (item, index, object) {
                if (list_id === item.id) {
                    object.splice(index, 1);
                }
            });
        },
        get_lists: function () {
            this.loading = true;
            http.get('/data/urllists/get/').then(data => {
                this.lists = data.data['lists'];
                this.maximum_domains_per_list = data.data['maximum_domains_per_list'];
                this.loading = false;
            });
        },
        reset_add_new_form: function () {
            // Fixes #105: we don't need an explicit enable scans checkmark.
            this.add_new_new_list = {
                'id': -1, 'name': '', 'enable_scans': true, 'scan_type': 'web',
                'automated_scan_frequency': 'disabled', 'scheduled_next_scan': '1', automatically_share_new_reports: false, default_public_share_code_for_new_reports: '',  enable_report_sharing_page: false
            };
            this.add_new_server_response = {};
        },
        create_list: function () {
            http.post(`/data/urllist/create_list/`, this.add_new_new_list).then(server_response => {
                this.add_new_server_response = server_response.data;
                // if we get data back, the addition was succesful.
                if (!this.isEmptyObject(this.add_new_server_response.data)) {

                    // The managed url list has a property and internal list object. This internal list object is
                    // updated using a watch. This pattern is required to retain reactivity of the 'lists' object
                    // in this manager.

                    // If we would not do this, it's not possible to add to the top of the list, as the list is
                    // not truely reactive. You could then only add to the bottom of the list. Otherwise the last
                    // item of the lists was cloned.
                    // Doing it properly retains reactivity such as unshifting and reversing the list.
                    this.add_new_server_response.data.start_opened = true;
                    this.lists.unshift(this.add_new_server_response.data);
                    this.$bvModal.hide('show_add_new')
                }
            });
        }
    },
    watch: {
        uploads_performed: function (new_value, old_value) {
          console.log('uploads_performed', new_value, old_value);
            // only if the amount increases with 1, refresh the uploads. Otherwise existing uploads are loaded.
            // Uploads go one by one. No, today they go per 2 records. A 'pending' and a 'done' record.
            if (new_value > old_value &&  old_value > 0) {
                this.get_lists()
            }
        }
    },
    computed: {
        one_of_the_lists_contains_warnings: function () {
            let contains_warnings = false;
            this.lists.forEach((list) => {
                if (list.list_warnings.length)
                    contains_warnings = true;
            });
            return contains_warnings;
        },
        // can't seem to find the mapstate method the old school way:
        uploads_performed: function () {
            return this.$store.state.uploads_performed
        }
    }
}
</script>
<i18n>
{
    "en": {
        "title": "Domains",
        "intro": "Manage lists with domains",
        "bulk_upload_link": "Upload spreadsheet with domains",
        "warning_found_in_list": "One or more lists contain issues, this will prevent scans from running.",
        "icons": {
            "list_closed": "List closed",
            "list_opened": "List opened",
            "settings": "settings",
            "scan": "scan",
            "can_connect": "Can connect icon",
            "unknown_connectivity": "Unknown connectivity icon",
            "cannot_connect": "Can not connect",
            "list_warning": "Warning"
        },
        "icon_legend": {
            "title": "Legend of used icons",
            "intro": "The domains in the lists below will be included in each scan. Before a scan is performed, the eligibility of the service is checked. This check is always performed for the scan. To give an insight in how connected these services are, the last known state is presented as the first icon.",
            "can_connect": "Can connect to this service, will (probably) be scanned.",
            "unknown_connectivity": "Unknown if this service is available, will be scanned if available.",
            "cannot_connect": "Service not available, will (probably) not be scanned."
        },
        "inital_list": {
            "start": "Start creating a new list...",
            "alternative_start": "or upload a spreadsheet with domains here..."
        },
        "new_list": {
            "add_new_list": "Add new list",
            "button_close_label": "Close",
            "button_create_list_label": "Create List"
        }
    },
    "nl": {
        "title": "Domeinen",
        "intro": "Beheer lijsten met domeinen",
        "bulk_upload_link": "Spreadsheet met domeinen uploaden",
        "warning_found_in_list": "Eén of meerdere lijsten bevatten waarschuwingen. Deze lijsten worden niet gescand.",
        "icon_legend": {
            "title": "Legenda van gebruikte pictogrammen",
            "intro": "De domeinen in de lijsten hieronder worden gebruikt bij iedere scan. Voordat een scan is uitgevoerd wordt per domein gekeken of het domein aan de voorwaarden voldoet om gescand te worden. In de lijst hieronder wordt daarvan een beeld gegeven, echter kan dat beeld verouderd zijn: dit wordt ververst voor iedere scan.",
            "can_connect": "Deze dienst is bereikbaar en wordt (waarschijnlijk) gescanned.",
            "unknown_connectivity": "Niet bekend of deze dienst beschikbaar is, dit wordt later gecontroleerd.",
            "cannot_connect": "Deze dienst is niet beschikbaar, en wordt (waarschijnlijk) niet gescand."
        },
        "inital_list": {
            "start": "Maak een nieuwe lijst, voeg aan die lijst je domeinen toe...",
            "alternative_start": "of upload hier een spreadsheet met domeinen..."
        },
        "new_list": {
            "add_new_list": "Lijst toevoegen",
            "button_close_label": "Sluiten",
            "button_create_list_label": "Maak deze lijst"
        }
    }
}
</i18n>