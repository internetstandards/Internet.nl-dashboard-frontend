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
            <h1><i-bi-card-list /> {{ $t("domain.list-manager.title") }}</h1>
            <p class="mb-4">{{ $t("domain.list-manager.intro") }}</p>
            <p>
                <b-button variant="warning" @click="show_add_new = true" accesskey="n">📚 {{ $t("domain.list-manager.new_list.add_new_list") }}</b-button>
                &nbsp;
                <router-link to="/domains/upload" custom v-slot="{ navigate }">
                  <b-button variant="warning" @click="navigate" @keypress.enter="navigate">
                  📓 {{ $t("domain.list-manager.bulk_upload_link") }}
                  </b-button>
                </router-link>
            </p>

            <collapse-panel :title='$t("domain.list-manager.icon_legend.title")' class="mt-2">
                <template #content>
                  <b-alert variant="info" :model-value="true" >
                    <p>{{ $t("domain.list-manager.icon_legend.intro") }}</p>
                    <ul>
                        <li>
                            <span role="img" :aria-label='$t("domain.list-manager.icons.can_connect")'>🌍️</span>
                            {{ $t("domain.list-manager.icon_legend.can_connect") }}
                        </li>
                        <li>
                            <span role="img" :aria-label='$t("domain.list-manager.icons.unknown_connectivity")'>❓</span>
                            {{ $t("domain.list-manager.icon_legend.unknown_connectivity") }}
                        </li>
                        <li><span role="img" :aria-label='$t("domain.list-manager.icons.cannot_connect")'>🚫</span>
                            {{ $t("domain.list-manager.icon_legend.cannot_connect") }}
                        </li>
                    </ul>

                    </b-alert>
                </template>
            </collapse-panel>

            <b-modal id="show_add_new" v-model="show_add_new" header-bg-variant="info" header-text-variant="light" no-fade scrollable>
              <template #header><h4>📚 {{ $t("domain.list-manager.new_list.add_new_list") }}</h4></template>

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
                                      :placeholder='$t("urllist.empty_is_no_share_code")'
                                      v-model="add_new_new_list.default_public_share_code_for_new_reports">

                        </b-form-input>

                          <!-- better would be to btoa(String.fromCharCode.apply(null,self.crypto.getRandomValues(new Uint8Array(15)))).replaceAll('+','-').replaceAll('/','_') -->
                          <b-button variant="outline-success" @click="add_new_new_list.default_public_share_code_for_new_reports = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);;">{{ $t("urllist.generate_code") }}</b-button>

                      </b-input-group>
                    <br>

                    <b-form-checkbox id="enable_report_sharing_page" v-model="add_new_new_list.enable_report_sharing_page">
                      {{ $t("urllist.enable_report_sharing_page") }}.
                      <!-- move to separate component so that user variable is present via mapstate. -->
                      <a :href="`/published/user.account_id/`" target="_blank">{{$t("urllist.to_overview_page")}}</a>
                    </b-form-checkbox>

                </div>
                <template #footer>
                    <b-button variant="secondary" @click="show_add_new = false">
                        {{ $t("domain.list-manager.new_list.button_close_label") }}
                    </b-button> &nbsp;
                    <b-button variant="warning" @click="create_list()">
                        {{ $t("domain.list-manager.new_list.button_create_list_label") }}
                    </b-button>
                </template>
            </b-modal>

        </content-block>

        <loading :loading="loading"></loading>

        <content-block v-if="one_of_the_lists_contains_warnings" class="managed-url-list">
            <span class="list_warning">
                <span role="img" :aria-label='$t("domain.list-manager.icons.list_warning")'>⚠️</span> {{ $t("domain.list-manager.warning_found_in_list") }}
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
            :start_opened="!!list.start_opened"
            :maximum_domains="maximum_domains_per_list"
            :key="list.id"
            v-on:removelist="removelist"
            v-for="list in lists" />

        <content-block v-if="!lists.length">
            {{ $t("domain.list-manager.inital_list.start") }} <br>
            <b-button variant="warning" size="" v-b-modal="'show_add_new'" accesskey="n">📚 {{ $t("domain.list-manager.new_list.add_new_list") }}</b-button>
            <br>
            <br>
            <p>
                <router-link to="/domains/upload">{{ $t("domain.list-manager.inital_list.alternative_start") }}</router-link>
            </p>
        </content-block>

    </div>
</template>

<script>
import UrlList from './UrlList.vue'
import http from "@/httpclient";
import CollapsePanel from '@/components/CollapsePanel.vue'
import { dashboardStore } from '@/dashboardStore'
import {mapState} from 'pinia'


export default {
    components: {
        UrlList, CollapsePanel
    },
    data: function () {
        return {
            loading: false,
            lists: [],
            show_add_new: false,

            // possible things that can go wrong in list validation.
            maximum_domains_per_list: 10000,

            // everything that has something to do with adding a new list:
            add_new_server_response: {},
            add_new_new_list: {
              id: -1,
              name: '',
              enable_scans: true,
              scan_type: 'web',
              automated_scan_frequency: 'disabled',
              scheduled_next_scan: '1',
              automatically_share_new_reports: false,
              default_public_share_code_for_new_reports: '',
              enable_report_sharing_page: false
            },

          store: dashboardStore,
        }
    },
    mounted: function () {
      this.store = dashboardStore();
        this.get_lists();
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
            http.get('/data/urllists/get').then(data => {
                this.lists = data.data['lists'];
                this.maximum_domains_per_list = data.data['maximum_domains_per_list'];
                this.loading = false;
            });
        },
        reset_add_new_form: function () {
            // Fixes #105: we don't need an explicit enable scans checkmark.
            this.add_new_new_list = {
              id: -1,
              name: '',
              enable_scans: true,
              scan_type: 'web',
              automated_scan_frequency: 'disabled',
              scheduled_next_scan: '1',
              automatically_share_new_reports: false,
              default_public_share_code_for_new_reports: '',
              enable_report_sharing_page: false
            };
            this.add_new_server_response = {};
        },
        create_list: function () {
            http.post(`/data/urllists/create`, this.add_new_new_list).then(server_response => {
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
                    this.show_add_new = false;

                    this.reset_add_new_form();
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
            return this.store.uploads_performed
        },
        user() {
          return this.store.user
        }
    },
  // mapstate doesnt seem to work here it seems
  //...mapState(dashboardStore, ['user'])
}
</script>
