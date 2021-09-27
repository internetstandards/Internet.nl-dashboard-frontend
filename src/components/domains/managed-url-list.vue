<!-- SPDX-License-Identifier: Apache-2.0 -->
<style scoped>
h2 {
  display: inline;
  font-size: 1.2em;
}
</style>

<template>
  <content-block :id="list.id" v-if="!is_deleted">
        <span>
            <a :name="list.id"></a>
            <h2>

                <button v-if="!is_opened" @click="open_list()" aria-expanded="false">
                    <span role="img" v-if="list_contains_warnings" :aria-label="$t('icon.list_warning')">⚠️</span>
                    <span role="img" :aria-label="$t('icon.list_closed')">📘</span> {{ list.name }} <scan-type-icon
                    :type="list.scan_type"/>
                </button>

                <button v-if="is_opened" @click="close_list()" aria-expanded="true">
                    <span role="img" v-if="list_contains_warnings" :aria-label="$t('icon.list_warning')">⚠️</span>
                    <span role="img" :aria-label="$t('icon.list_opened')">📖</span> {{ list.name }} <scan-type-icon
                    :type="list.scan_type"/>
                </button>

                <probe v-if="list.enable_scans && !list.scan_now_available" class="m-2 pb-1"/>
            </h2>

            <div v-if="is_opened" style="float:right;">
                <button @click="visible.configure = true">
                    <span role="img" :aria-label="$t('icon.settings')">📝</span> {{ $t("button.configure") }}
                </button> &nbsp;

                <button @click="visible.add_domains = true">
                    <span role="img" :aria-label="$t('icon.bulk_add_new')">🌐</span> {{ $t("button.add_domains") }}
                </button> &nbsp;
                <template v-if="urls.length">
                    <template v-if="list.enable_scans">
                        <button v-if="list.scan_now_available" @click="visible.scan = true">
                            <span role="img" :aria-label="$t('icon.scan')">🔬</span> {{ $t("button.scan_now") }}
                        </button> &nbsp;
                        <button v-if="!list.scan_now_available" disabled="disabled"
                                :title='$t("button.scan_now_scanning")'>
                            <probe/> {{ $t("button.scan_now_scanning") }}
                        </button>
                    </template>
                    <button v-else disabled="disabled" :title='$t("button.scanning_disabled")'>
                        <span role="img" :aria-label="$t('icon.scan')">🔬</span> {{ $t("button.scanning_disabled") }}
                    </button> &nbsp;
                </template>
                <button @click="visible.delete = true" class="border-danger">🗑️ {{ $t("button.delete") }}</button>
            </div>
        </span>


    <div v-if="is_opened">
      <br>
      <About :list="list" :urls="urls"></About>

      <br>

      <template v-if="list.list_warnings.indexOf('WARNING_DOMAINS_IN_LIST_EXCEED_MAXIMUM_ALLOWED') > -1">
        <div class="server-response-error">
          <span role="img" :aria-label="$t('icon.list_warning')">⚠️</span>{{
            $t("warnings.domains_exceed_maximum", [maximum_domains])
          }}
        </div>
      </template>


      <div v-if="!urls.length">
        <button @click="visible.add_domains = true" class="border-success">🌐 {{ $t("button.add_domains") }}</button>
      </div>

      <loading :loading="loading"></loading>

      <template v-if="urls.length">
        <DomainTable :urls="urls" :loading="loading" :urllist="list"></DomainTable>
        <p><i v-html="$t('domains.intro')" ></i></p>
      </template>

      <!--
      <ul style="column-count: 2; list-style: none;">
        <li v-for="url in urls" :key="url.id">
          <EditDomain :list="list" :url="url" @domain_deleted="update_list_warnings()"></EditDomain>
        </li>
      </ul>EditDomain
      <br>
      -->

      <button v-if="urls.length" @click="view_csv = !view_csv" value="load">
        📋 {{ $t("button.view_csv") }}
      </button>
      <br>
      <b-form-textarea
          id="textarea"
          v-model="csv_value"
          style="border: 1px solid silver; padding: 5px;"
          v-if="view_csv"
          plaintext
      ></b-form-textarea>
    </div>

    <Configure :list="list" :show="visible.configure" :visible="visible.configure" @cancel="visible.configure = false"
               @done="visible.configure = false"></Configure>
    <Delete :list="list" :show="visible.delete" :visible="visible.delete" @cancel="visible.delete = false"
            @removelist="is_deleted = true; visible.delete = false"></Delete>
    <Scan :list="list" :show="visible.scan" :visible="visible.scan" @cancel="visible.scan = false"
          @started="visible.scan = false"></Scan>
    <AddDomains :list="list" :show="visible.add_domains" :visible="visible.add_domains"
                @cancel="visible.add_domains = false" @added="get_urls()"></AddDomains>

    <!-- This is already auto-refreshed by a watch, but we keep this as a backup solution for edge cases like
     the monitor page not loading or the used did not open the monitor page. -->
    <autorefresh :visible="false" :callback="get_scan_status_of_list" :refresh_per_seconds="600"
                 v-if="$store.state.user.is_authenticated"></autorefresh>
  </content-block>
</template>

<script>
import sharedMessages from './../translations/dashboard.js'

import Delete from './list/delete'
import Scan from './list/scan'
import AddDomains from './list/add domains'
import Configure from './list/configure'
import About from './list/about-this-list'
import http from "@/httpclient";
import ScanTypeIcon from "@/components/scan_type_icon";
import DomainTable from "@/components/domains/DomainTable";

export default {
  components: {
    DomainTable,
    ScanTypeIcon,
    Delete,
    Scan,
    AddDomains,
    Configure,
    About,
  },
  i18n: {
    sharedMessages: sharedMessages,
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

      view_csv: false,

      visible: {
        configure: false,
        delete: false,
        scan: false,
        add_domains: false
      },
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
    if (this.$router.history.current.params.list) {
      if (this.list.id === parseInt(this.$router.history.current.params.list)) {
        this.open_list();
      }
    }
    if (this.start_opened){
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
  },
  computed: {
    csv_value: function () {
      let urls = [];
      this.urls.forEach(function (item) {
        urls.push(item.url);
      });
      return urls.join(', ');
    },
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
      if (this.$store.state.scan_monitor_data.length === 0)
        return "";

      // the first scan-monitor record where list_id is the same, is the one with the most recent state
      for (let i = 0; i < this.$store.state.scan_monitor_data.length; i++) {
        if (this.$store.state.scan_monitor_data[i].list_id === this.list.id) {
          return this.$store.state.scan_monitor_data[i].state;
        }
      }

      // console.log("Probably no scan for this list...");
      return "";
    }
  },
}
</script>
<i18n>
{
  "en": {
    "icon": {
      "list_closed": "List closed",
      "list_opened": "List opened",
      "settings": "settings",
      "scan": "scan",
      "bulk_add_new": "Add domains in bulk",
      "remove_filter": "Show categories",
      "report": "report"
    },
    "button": {
      "configure": "Configure",
      "add_domains": "Add domains",
      "scan_now": "Scan now",
      "scan_now_scanning": "Scanning",
      "scan_now_scanning_title": "The scan now option is available only once a day, when no scan is running.",
      "delete": "Delete",
      "view_csv": "View as .CSV file",
      "scanning_disabled": "Scanning disabled"
    },
    "domains": {
      "header": "Domains",
      "intro": "These domains will be included in the scan. Eligibility for scanning is checked just before requesting the scan. The icons before each domain is based on archived information on the most recent reachability of services. This is checked and updated prior to every scan."
    },
    "warnings": {
      "domains_exceed_maximum": "The amount of domains in this list exceeds the maximum of {0}. Scanning is paused."
    }
  },
  "nl": {
    "icon": {
      "list_closed": "Lijst geopend",
      "list_opened": "Lijst gesloten",
      "settings": "Instellingen",
      "scan": "scannen",
      "bulk_add_new": "Voeg domeinen toe in bulk",
      "remove_filter": "Bekijk categorien",
      "report": "rapport"
    },
    "button": {
      "configure": "Instellingen",
      "add_domains": "Domeinen toevoegen",
      "scan_now": "Nu scannen",
      "scan_now_scanning": "Aan het scannen",
      "scan_now_scanning_title": "Nu scannen is alleen beschikbaar als er geen scan draait, en kan maximaal 1x per dag worden aangeroepen.",
      "delete": "Verwijder",
      "view_csv": "Bekijk CSV bestand",
      "scanning_disabled": "Scans uitgeschakeld"
    },
    "domains": {
      "header": "Domeinen",
      "intro": "Deze domeinen worden meegenomen in een scan. De mogelijkheid om te scannen wordt voor aanvang van de scan bijgewerkt. De iconen geven een beeld van de bereikbaarheid van deze domeinen op basis van archiefinformatie. De bereikbaarheid wordt voor aanvang van iedere scan opnieuw gecontroleerd en bijgewerkt."
    },
    "warnings": {
      "domains_exceed_maximum": "Het aantal domeinen in deze lijst is meer dan het maximum aantal van {0}. Scanning is gepauzeerd."
    }
  }
}
</i18n>