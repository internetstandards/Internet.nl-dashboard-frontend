<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
  <b-modal :visible="visible" @hidden="close()" header-bg-variant="info" header-text-variant="light" no-fade
           scrollable size="lg">
    <h3 slot="modal-title">📝 {{ $t("title") }}</h3>
    <div slot="default" style="min-height: 50vh;">

      <label for="domain_name">{{ $t("find_subdomains_header", [list.name]) }}:</label><br>

      <b-input-group class="mb-2">


      <b-form-input id="domain_name" type="text" maxlength="120" v-model="input_domain" debounce="400" :placeholder="$t('enter_domain_name')"></b-form-input>

      <b-input-group-append>
        <b-button class="lastbutton" role="link" @click="find_suggestions()" style="min-width: 120px">🔎 {{ $t("search") }} <b-spinner variant="info" label="Spinning" small v-if="loading_suggestions"/></b-button>
      </b-input-group-append>
    </b-input-group>
      <p class="mb-2">{{$t('will_be_added_to', [list.name])}}</p>

      <server-response :response="response" v-if="response" :message="$t('' + response.message)"/>

      <b-alert variant="info" show v-if="response.success === true" dismissible>
        <h4>{{ $t('status_report') }}</h4>
        <li v-if="response.data.duplicates_removed">
          {{ $t("removed_n_duplicates", [response.data.duplicates_removed]) }}
        </li>
        <li v-if="response.data.already_in_list">{{ $t("ignored_n", [response.data.already_in_list]) }}</li>
        <li>{{ $t("added_n_to_list", [response.data.added_to_list]) }}
        </li>
      </b-alert>


      <div v-if="suggestions.length > 0">
        <p>
          {{ $t("domains_found", [suggestions.length]) }}, <a @click="dive_into_archive">{{$t("dive_into_archive", [period + this.extend_period])}}</a>
        </p>

      <b-button @click="add_suggestions">{{ $t("add_subdomains_button", [selected_suggestions.length]) }} <b-spinner variant="info" label="Spinning" small v-if="loading_add_suggestions"/></b-button><br><br>

      <b-button id="select_all" @click="toggle_all" v-model="select_all" size="sm">{{ $t("select_all") }}</b-button><b-button size="sm" @click="clear_selection" class="ml-4">{{ $t("clear_selection") }}</b-button>
      <br><br>

      <p>

        <b-form-checkbox-group
        id="checkbox-group-2"
        v-model="selected_suggestions"
        name="flavour-2"
      >
          <b-form-checkbox :value="suggestion" style="width: 100%"
                           v-for="suggestion in suggestions" :key="`${suggestion}`">
              {{suggestion}}
          </b-form-checkbox>
        </b-form-checkbox-group>
      </p>

      <b-button @click="add_suggestions">{{ $t("add_subdomains_button", [selected_suggestions.length]) }} <b-spinner variant="info" label="Spinning" small v-if="loading_add_suggestions"/></b-button>

      </div>


    </div>
    <div slot="modal-footer">
      <button class="modal-default-button altbutton" @click="cancel()">
        {{ $t("cancel") }}
      </button> &nbsp;
      <button class="modal-default-button defaultbutton" @click="close()">
        {{ $t("ok") }}
      </button>
    </div>
  </b-modal>
</template>

<script>
import http from "@/httpclient";

export default {
  name: "discover-subdomains",
  props: {
    list: {
      type: Object,
    },
    visible: {
      type: Boolean,
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

      loading_suggestions: false,
      loading_add_suggestions: false,
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
      this.period = this.$store.state.config.app.subdomain_suggestion.default_period;
      this.extend_period = this.$store.state.config.app.subdomain_suggestion.default_extend_period;

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
      this.period = this.$store.state.config.app.subdomain_suggestion.default_period;
    },

  },
  mounted: function () {
    this.response = {};

    this.period = this.$store.state.config.app.subdomain_suggestion.default_period;
    this.extend_period = this.$store.state.config.app.subdomain_suggestion.default_extend_period;


    // make it super easy to add subdomains from a certain domain...
    if (this.prefill_input) {
      this.input_domain = this.prefill_input;
      this.find_suggestions();
    }
  }
}
</script>

<i18n>
{
  "en": {
    "title": "Discover Subdomains",
    "cancel": "Cancel",
    "ok": "Done",
    "find_subdomains_header": "Enter a domain name to find subdomains",
    "will_be_added_to": "selected subdomains will be added to the list named {0}.",
    "added_n_to_list": "{0} domains added to this list. Take care: if the new domains are not shown in the list right away, wait a short while and reload the list.",
    "removed_n_duplicates": "{0} duplicates removed from the input.",
    "ignored_n": "{0} domains are already in this list.",
    "add_domains_valid_urls_added": "New domains have processed, see the status report for details.",
    "status_report": "Status report",
    "domains_found": "{0} subdomains found",
    "select_all": "Select all",
    "clear_selection": "Clear selection",
    "dive_into_archive": "search for older subdomains, up to {0} days ago.",
    "add_subdomains_button": "Add {0} selected subdomains",
    "search": "Search",
    "enter_domain_name": "Enter a domain name, such as internet.nl to find subdomains..."
  },
  "nl": {
    "title": "Subdomeinen Zoeker",
    "cancel": "Annuleer",
    "ok": "Klaar",
    "find_subdomains_header": "Voer een domeinnaam in om subdomeinen te vinden",
    "will_be_added_to": "geselecteerde subdomeinen worden toegevoegd aan de lijst genaamd {0}.",
    "added_n_to_list": "{0} domeinen zijn aan de lijst toegevoegd. Let op: als de nieuwe domeinen niet direct in de lijst staan, wacht dan even en herlaad de lijst.",
    "removed_n_duplicates": "{0} dubbel ingevoerde domeinen zijn overgeslagen.",
    "ignored_n": "{0} domeinen zitten al in de lijst.",
    "add_domains_valid_urls_added": "Nieuwe domeinen zijn verwerkt, zie het statusoverzicht voor details.",
    "status_report": "Statusoverzicht",
    "domains_found": "{0} subdomeinen gevonden",
    "select_all": "Selecteer alles",
    "clear_selection": "Selectie Wissen",
    "dive_into_archive": "zoek naar oudere subdomeinen, tot {0} dagen terug.",
    "add_subdomains_button": "Voeg {0} geselecteerde subdomeinen toe",
    "search": "Zoek",
    "enter_domain_name": "Voor een domeinnaam in zoals internet.nl om subdomeinen te vinden..."
  }
}
</i18n>