<!-- SPDX-License-Identifier: Apache-2.0 -->
<style scoped>
.lastbutton {
  border-radius: 0 4px 4px 0 !important;
}
</style>

<style>

.v-select button, .v-select button:hover, .vs__clear, .vs__deselect {
  margin: 0 auto 0em !important;
  background: transparent !important;
  border: solid 0 #ffab4c !important;
}

.vs__open-indicator {
  margin-top: 3px;
  margin-right: 5px;
  margin-left: 20px;
}

.vs__dropdown-option {
  min-width: 100%;
}

.v-select li {
  display: inline-block;
}

.v-select li:nth-child(even) {
  background-color: rgba(0, 0, 0, 0.1) !important;
}

.v-select li:nth-child(even):hover {
  background-color: #5897FB !important;
}

.w-87 {
  width: 87%
}

</style>
<template>
  <div aria-live="polite">
    <b-input-group>
    <v-select
        v-model="selected_reports"
        :placeholder="$t('select_report')"
        :options="filtered_recent_reports"
        label="label"
        :spinner="loading"
        class="w-87"
        :multiple="true"
        :selectable="() => selected_reports.length < 6"
    >
      <slot name="no-options">{{ $t('no_options') }}</slot>
      <template v-slot:option="option">
        <div class="rowline d-block">
          <div class="d-inline-block col-1">{{ option.id }}</div>
          <div class="d-inline-block col-2" >
            <scan-type-icon :type="option.type"/>
            {{ option.type }}
          </div>
          <div class="d-inline-block">{{ option.list_name }}</div>
          <div class="d-inline-block float-right">{{ humanize_date(option.at_when) }}
            ({{ humanize_relative_date(option.at_when) }})
          </div>
        </div>
      </template>
    </v-select>

    <b-input-group-append>
    <b-button class="lastbutton" variant="info" role="link" @click="get_recent_reports()">🔁 {{ $t("reload_list") }}</b-button>
      </b-input-group-append>
    </b-input-group>

    <br>
    <report-tag-filter :urllist_id="this.selected_reports[0].urllist_id" v-if="this.selected_reports.length > 0" @tags_applied="$emit('tags_applied')"/>

    <!-- The dropdown with recent reports is updated automatically when scans finish. But if that page
     had never loaded, this is a fallback that still tries to get the recent report every ten minutes. -->
    <autorefresh :visible="false" :callback="get_recent_reports" :refresh_per_seconds="600"></autorefresh>
  </div>
</template>
<script>
import http from "@/httpclient";
import ReportTagFilter from "@/components/reports/ReportTagFilter";
import ScanTypeIcon from "@/components/ScanTypeIcon";

export default {
  components: {ScanTypeIcon, ReportTagFilter},
  /**
   * Manipulates the following globals:
   * - Current report type, a string in one of the following: ["web", "mail"]
   * - Current reports, an Array of integers. These integers are report id's.
   *
   * This should be reactive to what is in the address bar...
   */

  data: function () {
    return {
      loading: false,

      // List of all available reports for selection. These reports are fetched on load or on change of length of the
      // amount of finished reports.
      available_recent_reports: [],

      // the filtered set only shows the same type as the first selected report.
      // It's not possible to open two reports of different types: fields differ and thus no comparison is possible.
      filtered_recent_reports: [],

      // all options selected in the dropdown, these are objects with id, name, type and more
      selected_reports: [],

      // list of integers, shared in global state
      selected_report_ids: [],
    }
  },

  mounted() {
    this.get_recent_reports();
    this.match_with_environment(this.$router.history.current);
  },

  methods: {
    get_recent_reports() {
      // reload the select
      this.loading = true;
      http.get(`/data/report/recent/`).then(response => {
        let data = response.data;
        data.forEach(o => {o.label = `#${o.id} - ${o.list_name} - type: ${o.type} - from: ${o.at_when.human_date()}`});
        this.available_recent_reports = this.filtered_recent_reports = data;
        this.loading = false;
      });
    },

      match_with_environment(to){
        let request_parameters = []

      if (to.params.report !== undefined)
          request_parameters.push(parseInt(to.params.report));

      if (to.params.compare_with !== undefined)
          request_parameters.push(parseInt(to.params.compare_with));

      // do not update anything if there is nothing to update, otherwise selection gets lost with navigation on the site
          if (request_parameters.length === 0) {
              return
          }

       this.selected_reports = this.available_recent_reports.filter(item => request_parameters.includes(item.id))
      }
  },

  watch: {

    $route(to) {
      this.match_with_environment(to)
    },

    selected_reports(dropdown_items, old_value) {
      // console.log("Selected reports changed...")
      // console.log(dropdown_items)
      // console.log(old_value)

      // don't reload the page uselessly
      if (dropdown_items === old_value)
        return;

      // Nothing in the list, for example when the cross hair was used or all items where deleted: reset this object
      if (dropdown_items[0] === undefined) {
        this.filtered_recent_reports = this.available_recent_reports;
        return;
      }

      // prevent useless reloading
      // if (old_value !== undefined) {
      //   if (dropdown_items[0].id === old_value[0].id)
      //     return;
      // }

      // All reports in the list have to match the type of the first selected item, otherwise they cannot be compared
      this.filtered_recent_reports = this.available_recent_reports.filter(item => item.type === dropdown_items[0].type);

      // create a list of id's, these id's are shared in the app for other controls.
      this.selected_report_ids = dropdown_items.map(item => item.id);
      this.$store.commit("set_report_ids", this.selected_report_ids);

      // Always update the URL to reflect the latest report, so it can be easily shared and the page reloaded

      if (dropdown_items[1] !== undefined)
        history.pushState({}, null, `/#/report/${dropdown_items[0].id}/${dropdown_items[1].id}`);
      else
        history.pushState({}, null, `/#/report/${dropdown_items[0].id}`);

    },

    amount_of_finished_scans(new_value, old_value) {
      // If there are more scans finished, this list is updated.
      if (new_value === old_value)
        return;

      this.get_recent_reports();
    },
  },

  computed: {
    amount_of_finished_scans(){
      // this helps auto-reloading the list of available reports
      // todo: if there is a limit of amount of finished scans (eg: 30), will this then stay the same at 30 even though
      //  other scans end?

      // In the case no scans
      if (this.$store.state.scan_monitor_data.length === 0)
        return 0;

      let finished = 0;
      // the first scan-monitor record where list_id is the same, is the one with the most recent state
      for (let i = 0; i < this.$store.state.scan_monitor_data.length; i++) {
        if (this.$store.state.scan_monitor_data[i].state === "finished") {
          finished++;
        }
      }
      return finished;
    }
  }
}
</script>
<i18n>
{
  "en": {
    "select_report": "Select report...",
    "no_options": "No reports available.",
    "reload_list": "Update"
  },
  "nl": {
    "select_report": "Selecteer rapport...",
    "no_options": "Geen rapporten beschikbaar.",
    "reload_list": "Bijwerken"
  }
}
</i18n>
