<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
  <b-modal :visible="visible" @hidden="cancel()" header-bg-variant="info" header-text-variant="light" no-fade
           scrollable size="xl">
    <h3 slot="modal-title">📝 {{ $t("title") }}</h3>
    <div slot="default">

      <server-response :response="response"></server-response>

      <label for="domain_name">{{ $t("find_subdomains_header", [list.name]) }}:</label><br>

      <b-input-group class="mb-2">


      <b-form-input id="domain_name" type="text" maxlength="120" v-model="input_domain" debounce="400"></b-form-input>

      <b-input-group-append>
        <b-button class="lastbutton" variant="info" role="link" @click="find_suggestions()">🔁 {{ $t("zoek") }}</b-button>
      </b-input-group-append>
    </b-input-group>

      <loading :loading="loading_suggestions" />

      <div v-if="suggestions.length > 0">
        <p>
          {{suggestions.length}} resultaten gevonden, <a @click="dive_into_archive">zoek naar oudere subdomeinen, tot {{period + 370}} dagen terug.</a>
        </p>

      <b-form-checkbox id="select_all" @change="toggle_all">Alles selecteren</b-form-checkbox>
      <p :style="suggestions.length > 10 ? 'columns: 2' : ''">

        <b-form-checkbox-group
        id="checkbox-group-2"
        v-model="selected_suggestions"
        name="flavour-2"
      >
          <b-form-checkbox :value="suggestion" style="width: 100%"
                           v-for="suggestion in suggestions" :key="`${suggestion}.${input_domain}`">
            {{ suggestion }}
          </b-form-checkbox>
        </b-form-checkbox-group>
      </p>

      <b-button>Voeg {{selected_suggestions.length}} geselecteerde subdomeinen toe</b-button>

      </div>


    </div>
    <div slot="modal-footer">
      <button class='altbutton' @click="cancel()">{{ $t("cancel") }}</button>
      &nbsp;
      <button class="modal-default-button defaultbutton" @click="update_list_settings()">
        {{ $t("ok") }}
      </button>
    </div>
  </b-modal>
</template>

<script>
// $store.state.config.app.subdomain_suggestion.enabled -> aantallen voor verlenging etc...
import sharedMessages from "@/components/translations/dashboard";
import http from "@/httpclient";

export default {
  name: "discover-subdomains",
  i18n: {
    sharedMessages: sharedMessages,
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
      response: {},
      suggestions: [],
      selected_suggestions: [],
      new_domains_to_add: [],
      input_domain: "",
      period: 370,
      loading_suggestions: false,
    }
  },
  methods: {
    cancel: function () {
      this.$emit('cancel')
    },
    dive_into_archive() {
      this.period += 370;
      this.find_suggestions();
    },
    toggle_all(checked) {
       this.selected_suggestions = checked ? this.suggestions.slice() : []
    },
    find_suggestions: function () {
      this.loading_suggestions = true;
      http.post('data/urllist/suggest-subdomains/', {domain: this.input_domain, period: this.period}).then(server_response => {
        if (server_response.data.length > 0) {
          this.suggestions = [this.input_domain];
          this.suggestions = this.suggestions.concat(server_response.data);
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
      this.period = 370;
    },

  },
  mounted: function () {
    this.response = {};
  }
}
</script>

<i18n>
{
  "en": {
    "title": "Discover Subdomains",
    "cancel": "Cancel",
    "ok": "Done",
    "find_subdomains_header": "Add subdomains to {0}"
  },
  "nl": {
    "title": "Subdomeinen Ontdekken",
    "cancel": "Annuleer",
    "ok": "Klaar",
    "find_subdomains_header": "Voeg subdomeinen toe aan {0}"
  }
}
</i18n>