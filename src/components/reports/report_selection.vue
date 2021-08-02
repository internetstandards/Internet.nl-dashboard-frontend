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

</style>
<template>
  <div aria-live="polite">
    <v-select
        v-model="selected_reports"
        :placeholder="$t('select_report')"
        :options="filtered_recent_reports"
        label="label"
        :spinner="loading"
        :multiple="true"
        :selectable="() => selected_reports.length < 6"
    >
      <slot name="no-options">{{ $t('no_options') }}</slot>
      <template v-slot:option="option">
        <div style="display:block;" class="rowline">
          <div style="width: 4em; display:inline-block;">{{ option.id }}</div>
          <div v-if="option.type === 'web'" style="width: 4em; display:inline-block;">
            <img src="/static_frontend/images/vendor/internet_nl/icon-website-test.svg"
                 style="height: 16px;"> {{ option.type }}
          </div>
          <div v-else style="width: 4em; display:inline-block;">
            <img src="/static_frontend/images/vendor/internet_nl/icon-emailtest.svg"
                 style="height: 16px;"> {{ option.type }}
          </div>
          <div style="display:inline-block;">{{ option.list_name }}</div>
          <div style="display:inline-block; float: right;">{{ humanize_date(option.at_when) }}
            ({{ humanize_relative_date(option.at_when) }})
          </div>
        </div>
      </template>
    </v-select>
    <br>
    <button role="link" @click="get_recent_reports()">🔁 {{ $t("reload_list") }}</button>

    <!-- The dropdown with recent reports is updated automatically when scans finish. But if that page
     had never loaded, this is a fallback that still tries to get the recent report every ten minutes. -->
    <autorefresh :visible="false" :callback="get_recent_reports" :refresh_per_seconds="600"
                 v-if="$store.state.user.is_authenticated"></autorefresh>
  </div>
</template>
<script>
import http from "@/httpclient";

export default {
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

    // todo: reflect content based on url values.
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

        // See if we can reflect the select box based on the parameters in the url:

      });
    },

  },

  watch: {
    selected_reports(dropdown_items) {

      // Nothing in the list, for example when the cross hair was used or all items where deleted: reset this object
      if (dropdown_items[0] === undefined) {
        this.filtered_recent_reports = this.available_recent_reports;
        this.loading = false;
        return;
      }

      // All reports in the list have to match the type of the first selected item, otherwise they cannot be compared
      this.filtered_recent_reports = this.available_recent_reports.filter(item => item.type === dropdown_items[0].type);

      // create a list of id's, these id's are shared in the app for other controls.
      this.selected_report_ids = [];
      for (let i = 0; i < dropdown_items.length; i++) {
        this.selected_report_ids.push(dropdown_items[i].id);
      }

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
    "reload_list": "Reload available reports"
  },
  "nl": {
    "select_report": "Selecteer rapport...",
    "no_options": "Geen rapporten beschikbaar.",
    "reload_list": "Lijst met beschikbare rapporten opnieuw laden"
  }
}
</i18n>
