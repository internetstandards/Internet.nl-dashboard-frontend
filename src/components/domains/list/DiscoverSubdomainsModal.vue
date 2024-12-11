<!-- SPDX-License-Identifier: Apache-2.0 -->
<style scoped>
.form-check-inline {
  /* cant get stuff per line otherwise... this is a bug in the default layout */
  display: block !important
}

</style>
<template>
  <b-modal @hidden="close()" header-bg-variant="info" header-text-variant="light" no-fade scrollable size="lg">
    <template #header><h4>📝 {{ $t("domain.discover-subdomains.title") }}</h4></template>
    <template #default>
      <div style="min-height: 50vh;">

      <label for="domain_name">{{ $t("domain.discover-subdomains.find_subdomains_header", [list.name]) }}:</label><br>

      <b-input-group class="mb-2">


      <b-form-input id="domain_name" type="text" maxlength="120" v-model="input_domain" debounce="400" :placeholder='$t("domain.discover-subdomains.enter_domain_name")'></b-form-input>


      <b-button class="lastbutton" role="link" @click="find_suggestions()" style="min-width: 120px">🔎 {{ $t("domain.discover-subdomains.search") }} <b-spinner variant="info" label="Spinning" small v-if="loading_suggestions"/></b-button>

    </b-input-group>
      <p class="mb-2">{{$t("domain.discover-subdomains.will_be_added_to", [list.name])}}</p>

      <server-response :response="response" v-if="response" :message='$t("domain.discover-subdomains." + response.message)'/>

      <b-alert variant="info" :model-value="true" v-if="response.success === true" dismissible>
        <h4>{{ $t("domain.discover-subdomains.status_report") }}</h4>
        <li v-if="response.data.duplicates_removed">
          {{ $t("domain.discover-subdomains.removed_n_duplicates", [response.data.duplicates_removed]) }}
        </li>
        <li v-if="response.data.already_in_list">{{ $t("domain.discover-subdomains.ignored_n", [response.data.already_in_list]) }}</li>
        <li>{{ $t("domain.discover-subdomains.added_n_to_list", [response.data.added_to_list]) }}
        </li>
      </b-alert>


      <div v-if="suggestions.length > 0">
        <p>
          {{ $t("domain.discover-subdomains.domains_found", [suggestions.length]) }}, <a @click="dive_into_archive">{{$t("domain.discover-subdomains.dive_into_archive", [period + this.extend_period])}}</a>
        </p>

      <b-button variant="success" @click="add_suggestions">{{ $t("domain.discover-subdomains.add_subdomains_button", [selected_suggestions.length]) }} <b-spinner variant="info" label="Spinning" small v-if="loading_add_suggestions"/></b-button><br><br>

      <b-button id="select_all" @click="toggle_all" v-model="select_all" size="sm">{{ $t("domain.discover-subdomains.select_all") }}</b-button><b-button size="sm" @click="clear_selection" class="ml-4">{{ $t("domain.discover-subdomains.clear_selection") }}</b-button>
      <br><br>

      <p>

        <b-form-checkbox-group
        id="checkbox-group-2"
        v-model="selected_suggestions"
        name="flavour-2"
      >
          <b-form-checkbox :value="suggestion" v-for="suggestion in suggestions" :key="`${suggestion}`" style="display: block">
            {{suggestion}}
          </b-form-checkbox>
        </b-form-checkbox-group>
      </p>

      <b-button variant="success" @click="add_suggestions">{{ $t("domain.discover-subdomains.add_subdomains_button", [selected_suggestions.length]) }} <b-spinner variant="info" label="Spinning" small v-if="loading_add_suggestions"/></b-button>

      </div>

      </div>
    </template>
    <template #footer>
      <b-button variant="secondary" @click="cancel()">
        {{ $t("domain.discover-subdomains.cancel") }}
      </b-button> &nbsp;
      <b-button variant="warning" @click="close()">
        {{ $t("domain.discover-subdomains.ok") }}
      </b-button>
    </template>
  </b-modal>
</template>

<script>
import http from "@/httpclient";
import { dashboardStore } from '@/dashboardStore'

export default {
  name: "discover-subdomains",
  props: {
    list: {
      type: Object,
    },

    prefill_input: {
      type: String,
      default: "",
    }
  },
  data: function () {
    return {
      response: {},
      suggestions: [],
      selected_suggestions: [],
      select_all: false,

      input_domain: "",
      period: 370,

      visible: false,

      loading_suggestions: false,
      loading_add_suggestions: false,

      store: dashboardStore(),
    }
  },
  methods: {
    close() {
      this.$emit("done");
      this.reset()
    },
    cancel() {
      this.$emit('cancel');
      this.reset()
    },
    reset() {
      this.response = {};
      this.suggestions = [];
      this.selected_suggestions = [];
      this.select_all = false;

      this.input_domain = "";
      this.period = this.store.config.app.subdomain_suggestion.default_period;
      this.extend_period = this.store.config.app.subdomain_suggestion.default_extend_period;

      this.loading_suggestions = false;
      this.loading_add_suggestions = false;
    },
    clear_selection() {
      this.selected_suggestions = [];
      this.select_all = false;
    },
    dive_into_archive() {
      this.period += this.extend_period;
      this.find_suggestions();
    },
    toggle_all(checked) {
       this.selected_suggestions = checked ? this.suggestions.slice() : []
    },
    add_suggestions(){

      // don't allow adding empty suggestions.
      if (this.selected_suggestions.length === 0)
        return;

       // send a bulk add to the server, which is already existing logic etc...
       this.loading_add_suggestions = true;

      http.post('/data/urllist/url/add/', {'urls': this.selected_suggestions.join(", "), 'list_id': this.list.id}).then(data => {
        // {'incorrect_urls': [], 'added_to_list': int, 'already_in_list': int}
        this.response = data.data;
        this.loading_add_suggestions = false;

        if (data.data.success) {
          this.$emit('added')
        }
      });
    },
    find_suggestions: function () {

      this.loading_suggestions = true;
      http.post('data/urllist/suggest-subdomains/', {domain: this.input_domain, period: this.period}).then(server_response => {
        if (server_response.data.length > 0) {
          // allow the top level domain also to be added / selected as a convenience.
          this.suggestions = [this.input_domain];
          server_response.data.forEach(suggestion => {
            this.suggestions.push(suggestion + "." + this.input_domain);
          })
        } else {
          this.suggestions = [];
        }
        this.loading_suggestions = false;
      });
    },
  },
  watch: {
    input_domain: function () {
      // make sure nothing is selected that is hidden, that would not be nice.
      this.selected_suggestions = [];
      this.find_suggestions();
      this.period = this.store.config.app.subdomain_suggestion.default_period;
    },

  },
  mounted: function () {
    this.response = {};

    this.period = this.store.config.app.subdomain_suggestion.default_period;
    this.extend_period = this.store.config.app.subdomain_suggestion.default_extend_period;


    // make it super easy to add subdomains from a certain domain...
    if (this.prefill_input) {
      this.input_domain = this.prefill_input;
      this.find_suggestions();
    }
  }
}
</script>
