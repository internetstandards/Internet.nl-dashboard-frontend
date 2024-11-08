<!-- SPDX-License-Identifier: Apache-2.0 -->
<style scoped>
.incorrect_urls {
  width: 100%;
  background-color: #ffd9d9;
  height: 60px;
  overflow: scroll;
}

.url_textarea {
  width: 100%;
  min-height: 180px;
  height: 40vh;
}
</style>

<template>
  <b-modal :visible="visible" @hidden="stop()" header-bg-variant="info"
           header-text-variant="light" no-fade scrollable size="lg">
    <h3 slot="modal-title">🌐 {{ $t("title") }}</h3>
    <div slot="default" style="min-height: 50vh;">

      <server-response :response="response" v-if="response" :message="$t('' + response.message)"/>

      <ul v-if="response.success === true">
        <li v-if="response.data.duplicates_removed">
          {{ $t("removed_n_duplicates", [response.data.duplicates_removed]) }}
        </li>
        <li v-if="response.data.already_in_list">{{ $t("ignored_n", [response.data.already_in_list]) }}</li>
        <li>{{ $t("added_n_to_list", [response.data.added_to_list]) }}
        </li>
      </ul>

      <template v-if="response.data">
        <span v-if="response.data.incorrect_urls.length">
            ⚠️ <b>{{ $t("warning") }}</b><br>
            <span v-html='$t("warning_message")'></span>:
            <div class="incorrect_urls">{{ response.data.incorrect_urls.join(', ') }}</div>
        </span>
        <br>
      </template>

      <label>{{ $t("domains_label") }}:</label>
      <b-alert variant="warning" :show="a_lot_of_new_domains">
        ⚠️ {{$t('a_lot_of_new_domains_message')}} <a @click="nav_to_upload">{{$t('go_to_spreadsheet_upload')}}</a>
      </b-alert>
      <b-alert variant="danger" :show="too_many_new_domains">
        ⚠️ {{$t('too_many_new_domains_message')}} <a @click="nav_to_upload">{{$t('go_to_spreadsheet_upload')}}</a>
      </b-alert>
      <textarea id="dms" v-model="new_domains" class="url_textarea" :placeholder="$t('message')"></textarea>
      <br>
      <br>

    </div>
    <div slot="modal-footer">
      <button class="altbutton" @click="stop()">{{ $t("cancel") }}</button>
      &nbsp;
      <template v-if="!loading">
        <button class="defaultbutton modal-default-button" @click="bulk_add_new()" :disabled="too_many_new_domains">
          {{ $t("ok") }}
        </button>
      </template>
      <template v-else>
        <button disabled="disabled" class="defaultbutton modal-default-button">
          <probe/>
          {{ $t("loading") }}
        </button>
      </template>
    </div>
  </b-modal>
</template>

<script>
import http from "@/httpclient";
import Probe from '@/components/probe'

export default {
  name: "AddDomains",
  components: {
    Probe
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
      new_domains: "",
      response: {},
      loading: false,

      // some UI guidance on adding domains depending on the number of domains.
      a_lot_of_new_domains: false,
      too_many_new_domains: false,
    }
  },
  methods: {
    stop: function () {
      this.reset();
      this.$emit('cancel')
    },
    reset: function () {
      this.new_domains = "";
      this.response = {};
    },
    nav_to_upload() {
      this.stop();
      this.$router.push({ name:'spreadsheet-upload' });
      window.scrollTo(0,0);
    },
    bulk_add_new: function () {
      this.loading = true;

      http.post('/data/urllist/url/add/', {'urls': this.new_domains, 'list_id': this.list.id}).then(data => {
        // {'incorrect_urls': [], 'added_to_list': int, 'already_in_list': int}
        this.response = data.data;
        this.loading = false;

        if (data.data.success) {
          this.$emit('added')
        }
      });
    },
  },

  watch: {
    new_domains(new_value) {
      // This works pretty fast even after adding 5 million characters

      // this guides the user to use the domain upload feature. A domain is roughly 20 characters.
      // so give a warning when you are 300*20 / 2 = 3000 characters in. So 2000 is fine.
      this.a_lot_of_new_domains = new_value.length > 2000;

      // do NOT parse the  list of domains as that is extremely error prone and slow, especially in cases that this
      // code is trying to protect against: too many domains. This would create a lot of lag and issues. So use
      // this simple heuristic to warn the user.
      // about 300 domains or 150 domains with subdomains are enough.
      let dotcounter = new_value.match(/\./g)
      this.too_many_new_domains = dotcounter && dotcounter.length > 300;

      // the user CAN ignore the message and still bypass the UI warning. This is not really an issue at all, but
      // in that case the feedback to the user will mis-align. That's a choice the user makes by changing the UI:
      // it will have unexpected consequences. (or in this case expected)
    }

  }
}
</script>

<i18n>
{
  "en": {
    "title": "Add domains",
    "domains_label": "Add domains in the text field below",
    "message": "Domains are separated by a comma, space or new line. These can be mixed. For example: \n\ninternet.nl, dashboard.internet.nl\nexample.com www.example.com, \nhttps://my.example.com:80/index.html",
    "ok": "Add the above domains to the list",
    "cancel": "Close",
    "status": "Status",
    "nothing_added": "nothing added yet.",
    "added_n_to_list": "{0} domains added to this list. Take care: if the new domains are not shown in the list right away, wait a short while and reload the list.",
    "removed_n_duplicates": "{0} duplicates removed from the input.",
    "ignored_n": "{0} domains are already in this list.",
    "warning": "Warning!",
    "warning_message": "Some domains where not added because they are in an incorrect format. The following domains where not added",
    "loading": "Domains are being processed",
    "add_domains_valid_urls_added": "New domains have processed, see the status report for details.",
    "add_domains_list_does_not_exist": "This list does not exist.",
    "undefined": "undefined",
    "too_many_domains": "The amount of domains in this list exceeds the total amount of domains allowed in a list.",
    "a_lot_of_new_domains_message": "Warning: we're recommending the spreadsheet upload for large amounts of domains. This shows the progress when adding domains and makes management of large amounts of domains easier.",
    "too_many_new_domains_message": "There are too many domains being added, please use a spreadsheet upload to continue.",
    "go_to_spreadsheet_upload": "Click here to go to the spreadsheet uploader and tutorial."
  },
  "nl": {
    "title": "Domeinen toevoegen",
    "domains_label": "Voer nieuwe domeinen in",
    "message": "Domeinen worden gescheiden door een komma, spatie, nieuwe regel. Deze mogen ook door elkaar worden gebruikt. Bijvoorbeeld: \n\ninternet.nl, dashboard.internet.nl\nexample.com www.example.com\nhttps://my.example.com:80/index.html",
    "ok": "Voeg bovenstaande domeinen toe aan de lijst",
    "status": "Status",
    "cancel": "Sluiten",
    "nothing_added": "nog niets toegevoegd.",
    "added_n_to_list": "{0} domeinen zijn aan de lijst toegevoegd. Let op: als de nieuwe domeinen niet direct in de lijst staan, wacht dan even en herlaad de lijst.",
    "removed_n_duplicates": "{0} dubbel ingevoerde domeinen zijn overgeslagen.",
    "ignored_n": "{0} domeinen zitten al in de lijst.",
    "warning": "Waarschuwing!",
    "warning_message": "Sommige domeinen zijn niet in een geldig formaat. Controleer de volgende domeinen en probeer het opnieuw:",
    "loading": "Domeinen worden verwerkt",
    "add_domains_valid_urls_added": "Nieuwe domeinen zijn verwerkt, zie het statusoverzicht voor details.",
    "add_domains_list_does_not_exist": "Deze lijst bestaat niet.",
    "undefined": "undefined",
    "too_many_domains": "Het aantal domeinen is deze lijst is groter dan is toegestaan.",
    "a_lot_of_new_domains_message": "Let op: voor het toevoegen van veel domeinen raden we de spreadsheet uploader aan. Deze toont o.a. voortgang van toevoegen en maakt het beheren van domeinen makkelijker.",
    "too_many_new_domains_message": "Dit zijn teveel domeinen voor deze manier van toevoegen, gebruik de spreadsheet uploader.",
    "go_to_spreadsheet_upload": "Klik hier om naar de spreadsheet uploader en upload handleiding te gaan."
  }
}
</i18n>