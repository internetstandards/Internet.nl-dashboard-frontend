<!-- SPDX-License-Identifier: Apache-2.0 -->
<style scoped>
input {
  margin-bottom: 0 !important;
}

button {
  font-size: 0.7em !important;
  margin: 0 !important;
  height: 23px;
}
</style>

<template>
  <div>

    <button @click="start_url_editing()" aria-expanded="false"> 🖊 </button> &nbsp;

    <a v-if="!editing" @click="start_url_editing()">
      <template v-if="displayed_url.subdomain">
        {{ displayed_url.subdomain }}.</template><b>{{ displayed_url.domain }}.{{ displayed_url.suffix }}</b>
    </a>

    <span v-if="editing">
      <input autofocus :placeholder="edited_url_value" v-model="edited_url_value">&nbsp;
      <a @click="save()"><span class="sr-only">{{ $t("button_labels.save") }}</span>✅</a>&nbsp;
      <a @click="cancel()"><span class="sr-only">{{ $t("button_labels.cancel") }}</span>⏪</a>&nbsp;
      <a @click="delete_url(list.id, url.id)"><span class="sr-only">{{ $t("button_labels.remove") }}</span>🗑️</a>
    </span>

  </div>
</template>

<script>
import http from "@/httpclient";

export default {
  name: "editDomain",
  data: function () {
    return {
      editing: false,


      url_edit: '',
      original_url_value: '',

      edited_url_value: '',
      displayed_url: {
        subdomain: "",
        domain: "",
        suffix: "",
      }
    }
  },
  props: {
    list: {
      type: Object
    },
    url: {
      type: Object
    }
  },
  mounted: function () {
    this.edited_url_value = this.url.url;
    this.displayed_url.subdomain = this.url.subdomain;
    this.displayed_url.domain = this.url.domain;
    this.displayed_url.suffix = this.url.suffix;
    this.original_url_value = this.url.url;
  },
  methods: {
    start_url_editing: function () {
      this.editing = true;

    },
    cancel: function () {
      this.edited_url_value = this.original_url_value;
      this.editing = false;
    },
    delete_url: function () {
      this.$emit('domain_deleted');
    },
    save: function () {
      /*
      * This is not a real 'save' but an add to list and create if it doesn't exist operation.
      * The save does not 'alter' the existing URL in the database. It will do some list operations.
      * */
      let data = {'list_id': this.list.id, 'url_id': this.url.id, 'new_url_string': this.edited_url_value}
      http.post('/data/urllist/url/save/', data).then(server_response => {
        if (server_response.data.success === true) {
          // now that saving was succesful, undo=ing should be to the newely saved url.
          this.original_url_value = this.edited_url_value;

          // in case the url is the same as the original, do not update it.
          this.displayed_url.subdomain = server_response.data.data.created.subdomain;
          this.displayed_url.domain = server_response.data.data.created.domain;
          this.displayed_url.suffix = server_response.data.data.created.suffix;

          this.editing = false;
        } else {
          this.edited_url_value = this.original_url_value;
        }
      });
    },
  }
}
</script>

<i18n>
{
  "en": {
    "start_editing_url": "Edit {0}.",
    "cancel_editing_url": "Cancel editing and store the original value: {0}",
    "eligeble_mail": "{0} is eligible for e-mail scans",
    "unknown_eligeble_mail": "Not yet known if {0} can be mail scanned.",
    "not_eligeble_mail": "{0} is not eligible for e-mail scans. Will be checked again when starting a scan.",
    "eligeble_web": "{0} is eligible for web scans",
    "unknown_eligeble_web": "Not yet known if {0} can be web scanned.",
    "not_eligeble_web": "{0} is not eligible for web scans. Will be checked again when starting a scan.",
    "save_edited_url": "Save changes, the change will be applied to {0}.",
    "delete_edited_url": "Delete {0} from this list.",
    "button_labels": {
      "save": "Save",
      "cancel": "Cancel",
      "remove": "Remove"
    }
  },
  "nl": {
    "eligeble_mail": "E-mail scannen is mogelijk",
    "start_editing_url": "Bewerk {0}.",
    "unknown_eligeble_mail": "Onbekend of E-mail scannen mogelijk is",
    "not_eligeble_mail": "Kan geen E-mail scan uitvoeren (wordt opnieuw gecheckt bij het starten van de scan)",
    "eligeble_web": "Web scan is mogelijk",
    "unknown_eligeble_web": "Niet bekend of het mogelijk is een web scan uit te voeren",
    "not_eligeble_web": "Web scan kan niet worden uitgevoerd. Dit wordt opnieuw gecheckt bij het starten van de scan.",
    "button_labels": {
      "save": "Opslaan",
      "cancel": "Annuleren",
      "remove": "Verwijderen"
    }
  }
}
</i18n>