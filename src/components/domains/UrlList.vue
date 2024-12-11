<!-- SPDX-License-Identifier: Apache-2.0 -->
<style scoped>
h2 {
  display: inline;
  font-size: 1.2em;
}
</style>

<template>
  <content-block v-if="!is_deleted" :id="list.id">
      <span>
            <a :name="list.id"></a>
            <h2>
                <b-button variant="warning" v-if="!is_opened" aria-expanded="false" @click="open_list()">
                    <span v-if="list_contains_warnings" :aria-label='$t("domain.urllist.icon.list_warning")' role="img">⚠️</span>
                    <span :aria-label='$t("domain.urllist.icon.list_closed")' role="img">📘</span> <probe
                    v-if="list.enable_scans && !list.scan_now_available" class="mr-2"/>{{ list.name }} <scan-type-icon
                    :type="list.scan_type"/>
                </b-button>
                <b-button variant="warning" v-if="is_opened" aria-expanded="true" @click="close_list()">
                    <span v-if="list_contains_warnings" :aria-label='$t("domain.urllist.icon.list_warning")' role="img">⚠️</span>
                    <span :aria-label='$t("domain.urllist.icon.list_opened")' role="img">📖</span> <probe
                    v-if="list.enable_scans && !list.scan_now_available" class="mr-2"/>
                  {{ list.name }} <scan-type-icon
                    :type="list.scan_type"/>
                </b-button>
            </h2>

            <div v-if="is_opened" class="float-end">
                <template v-if="urls.length">
                    <template v-if="list.enable_scans">
                        <b-button variant="warning" v-if="list.scan_now_available" @click="visible.scan = true">
                            <span :aria-label='$t("domain.urllist.icon.scan")' role="img">🔬</span> {{ $t("domain.urllist.button.scan_now") }}
                        </b-button> &nbsp;
                        <b-button variant="warning" v-if="!list.scan_now_available" :title='$t("domain.urllist.button.scan_now_scanning")'
                                disabled="disabled">
                            <probe/> {{ $t("domain.urllist.button.scan_now_scanning") }}
                        </b-button>
                    </template>
                    <b-button variant="warning" v-else :title='$t("domain.urllist.button.scanning_disabled")' disabled="disabled">
                        <span :aria-label='$t("domain.urllist.icon.scan")' role="img">🔬</span> {{ $t("domain.urllist.button.scanning_disabled") }}
                    </b-button> &nbsp;
                </template>

                <b-button variant="warning" @click="visible.configure = true">
                    <span :aria-label='$t("domain.urllist.icon.settings")' role="img">📝</span> {{ $t("domain.urllist.button.configure") }}
                </b-button> &nbsp;

              <b-button variant="warning" @click="download_list" v-if="urls.length">⬇️ {{ $t("domain.urllist.button.download") }}</b-button> &nbsp;

              <b-button variant="danger" @click="visible.delete = true">🗑️ {{ $t("domain.urllist.button.delete") }}</b-button>
            </div>
        </span>


    <div v-if="is_opened">
      <br>
      <About :list="list" :urls="urls"></About>

      <br>

      <template v-if="list.list_warnings.indexOf('WARNING_DOMAINS_IN_LIST_EXCEED_MAXIMUM_ALLOWED') > -1">
        <div class="server-response-error">
          <span :aria-label='$t("domain.urllist.icon.list_warning")' role="img">⚠️</span>{{
            $t("domain.urllist.warnings.domains_exceed_maximum", [maximum_domains])
          }}
        </div>
      </template>

      <div  style="width: 100%; text-align: right" class="mb-2">
        {{$t('domain.urllist.add domains using')}}:<br>
        <b-button variant="success" @click="visible.add_domains = true" size="sm"><span :aria-label='$t("domain.urllist.icon.bulk_add_new")' role="img">🌐</span> {{ $t("domain.urllist.button.add_domains") }}</b-button> &nbsp;
        <b-button variant="success" @click="visible.discover_subdomains = true" v-if="store.config.app.subdomain_suggestion.enabled" size="sm">🌪️️ {{ $t("domain.urllist.button.discover_subdomains") }}</b-button> &nbsp;
        <b-button variant="success" @click="visible.upload = true" size="sm">⬆️ {{ $t("domain.urllist.button.upload") }}</b-button> &nbsp;
        <!-- <button class="border-success" @click="get_urls()">⬆️ {{ $t("button.reload") }}</button> -->
        <SubdomainDiscovery v-if="urls.length" :list_id="list.id" @finished="get_urls"/>
      </div>

      <template v-if="urls.length">
        <DomainTable :loading="loading" :urllist="list" :urls="urls" @update="get_urls()"/>
        <p><small><i v-html='$t("domain.urllist.domains.intro")'></i></small></p>
      </template>

      <loading :loading="loading"></loading>

    </div>

    <Configure :list="list" :show="visible.configure" v-model="visible.configure" @cancel="visible.configure = false"
               @done="visible.configure = false"></Configure>
    <DiscoverSubdomains :list="list" :show="visible.discover_subdomains" v-model="visible.discover_subdomains" @cancel="visible.discover_subdomains = false"
               @done="visible.discover_subdomains = false; get_urls();"></DiscoverSubdomains>
    <Upload :list="list" :show="visible.upload" v-model="visible.upload" @cancel="visible.upload = false"
               @done="visible.upload = false; get_urls();"></Upload>
    <Delete :list="list" :show="visible.delete" v-model="visible.delete" @cancel="visible.delete = false"
            @removelist="is_deleted = true; visible.delete = false"></Delete>
    <Scan :list="list" :show="visible.scan" v-model="visible.scan" @cancel="visible.scan = false"
          @started="visible.scan = false"></Scan>
    <AddDomains :list="list" :show="visible.add_domains" v-model="visible.add_domains"
                @added="get_urls()" @cancel="visible.add_domains = false"></AddDomains>

    <!-- This is already auto-refreshed by a watch, but we keep this as a backup solution for edge cases like
     the monitor page not loading or the used did not open the monitor page. -->
    <autorefresh v-if="store.user.is_authenticated" :callback="get_scan_status_of_list"
                 :refresh_per_seconds="600"
                 :visible="false"></autorefresh>
  </content-block>
</template>

<script>

import Delete from './list/DeleteListModal.vue'
import Scan from './list/ScanModal.vue'
import AddDomains from './list/AddDomainsModal.vue'
import Configure from './list/ConfigurationModal.vue'
import Upload from './list/UploadModal.vue'
import About from './list/AboutThisList.vue'
import http from "@/httpclient";
import ScanTypeIcon from "@/components/ScanTypeIcon.vue";
import DomainTable from "@/components/domains/DomainTable.vue";

import autorefresh from '@/components/autorefresh.vue'
import Probe from '@/components/probe.vue'
import DiscoverSubdomains from "@/components/domains/list/DiscoverSubdomainsModal.vue";
import SubdomainDiscovery from "@/components/domains/list/WwwDiscovery.vue";

import { dashboardStore } from '@/dashboardStore'

export default {
  components: {
    SubdomainDiscovery,
    DiscoverSubdomains,

    DomainTable,
    ScanTypeIcon,
    Delete,
    Scan,
    AddDomains,
    Configure,
    About,
    Upload,
    autorefresh,
    Probe
  },
  data: function () {
    return {
      urls: [],
      is_opened: false,

      is_deleted: false,

      loading: false,

      // contains all known list data, should not be needed to individually fetch the list (again), only
      // after update.
      list: this.initial_list,

      visible: {
        configure: false,
        delete: false,
        scan: false,
        add_domains: false,
        upload: false,
        discover_subdomains: false,
      },

      store: dashboardStore(),
    }
  },
  props: {
    // Avoid mutating a prop directly since the value will be overwritten whenever the parent component re-renders.
    // Instead, use a data or computed property based on the prop's value. Prop being mutated: "list".
    // This is updated via a watch below. This allows for adding to the top of the list / real reactivity.
    initial_list: {type: Object, required: true},

    // To emulate and fix warnings that happen server side:
    maximum_domains: {type: Number, required: true, default: 10000},

    // given via router, when there is a url parameter given
    initial_list_id: {type: Number},

    start_opened: {
      type: Boolean, required: false, default: false
    }
  },
  watch: {
    initial_list: function (new_value) {
      this.list = new_value;
    },

    // support keep alive routing
    $route: function (to) {
      // https://router.vuejs.org/guide/essentials/dynamic-matching.html
      // If this param is set, and this list is the one requested, open this list.
      // todo: how to anchor-navigate to the part of the page where this list is?
      if (this.list.id === to.params.list) {
        this.open_list();

        // a little lesson in trickery
        location.hash = "#" + this.list.id;
      }
    },

    current_scan_status_from_scan_monitor: function (new_value, old_value) {
      // When the scan is cancelled via the UI, or another status update happens from the scan monitor
      // the scan state is updated automatically.

      // Do nothing when the state remains the same.
      if (new_value === old_value) {
        return
      }

      // various statusses that require a list update
      if (["finished", "cancelled", "requested"].includes(new_value)) {
        this.get_scan_status_of_list()
      }

    }
  },
  mounted: function () {
    if (this.$route.params.list) {
      if (this.list.id === parseInt(this.$route.params.list)) {
        this.open_list();
      }
    }
    if (this.start_opened) {
      this.is_opened = true;
    }
  },
  methods: {
    open_list: function () {
      this.get_urls();
      this.is_opened = true;
    },
    close_list: function () {
      this.is_opened = false;
    },
    get_urls: function () {
      this.loading = true;
      http.get(`/data/urllist_content/get/${this.list.id}/`).then(data => {
        this.urls = data.data.urls;
        this.loading = false;
        this.update_list_warnings();
      });
    },
    // update the list with the most recent data regarding reports and scanning, not intruding on the UI experience
    // this can be autorefreshed to show the most current scanning and report information
    get_scan_status_of_list: function () {
      http.get(`/data/urllist/get_scan_status_of_list/${this.list.id}/`).then(data => {
        this.list['last_report_id'] = data.data['last_report_id'];
        this.list['scan_now_available'] = data.data['scan_now_available'];
        this.list['last_report_date'] = data.data['last_report_date'];
      });
    },

    update_list_warnings: function () {
      // The list warnings is not automatically updated. So we replicate the behavior here.
      if (this.urls.length > this.maximum_domains) {
        if (this.list.list_warnings.indexOf("WARNING_DOMAINS_IN_LIST_EXCEED_MAXIMUM_ALLOWED") === -1) {
          this.list.list_warnings.push('WARNING_DOMAINS_IN_LIST_EXCEED_MAXIMUM_ALLOWED');
        }
      } else {
        let index = this.list.list_warnings.indexOf("WARNING_DOMAINS_IN_LIST_EXCEED_MAXIMUM_ALLOWED");
        if (index > -1) {
          this.list.list_warnings.splice("WARNING_DOMAINS_IN_LIST_EXCEED_MAXIMUM_ALLOWED", 1);
        }
      }
    },

    download_list(){
      let data = {
        'list-id': this.list.id,
        'file-type': 'xlsx'
      }

      http.post(`/data/urllist/download/`, data, {responseType: 'blob'}).then(response => {
        // create file link in browser's memory
        const href = URL.createObjectURL(response.data);

        // create "a" HTML element with href to file & click
        const link = document.createElement('a');
        link.href = href;
        link.setAttribute('download', `internet nl dashboard domain list ${this.list.name}.xlsx`); //or any other extension
        document.body.appendChild(link);
        link.click();

        // clean up "a" element & remove ObjectURL
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
      });
    }
  },
  computed: {
    list_contains_warnings: function () {
      // As long as we don't have the urls loaded, the warnings as they are stand.
      // see update list warnings...
      if (!this.urls.length) {
        return this.list.list_warnings.length > 0;
      }

      return this.list.list_warnings.length > 0;
    },
    // can't seem to find the mapstate method the old school way:
    current_scan_status_from_scan_monitor: function () {
      if (this.store.scan_monitor_data.length === 0)
        return "";

      // the first scan-monitor record where list_id is the same, is the one with the most recent state
      for (let i = 0; i < this.store.scan_monitor_data.length; i++) {
        if (this.store.scan_monitor_data[i].list_id === this.list.id) {
          return this.store.scan_monitor_data[i].state;
        }
      }

      // console.log("Probably no scan for this list...");
      return "";
    }
  },
}
</script>
