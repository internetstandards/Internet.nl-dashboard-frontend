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
  <b-modal @hidden="stop()" header-bg-variant="info" header-text-variant="light" no-fade scrollable size="lg">
    <template #header><h4>🌐 {{ $t("domain.list.add-domains.title") }}</h4></template>
    <template #default>
      <div style="min-height: 50vh;">

      <server-response :response="response" v-if="response" :message='$t("domain.list.add-domains." + response.message)'/>

      <ul v-if="response.success === true">
        <li v-if="response.data.duplicates_removed">
          {{ $t("domain.list.add-domains.removed_n_duplicates", [response.data.duplicates_removed]) }}
        </li>
        <li v-if="response.data.already_in_list">{{ $t("domain.list.add-domains.ignored_n", [response.data.already_in_list]) }}</li>
        <li>{{ $t("domain.list.add-domains.added_n_to_list", [response.data.added_to_list]) }}
        </li>
      </ul>

      <template v-if="response.data">
        <span v-if="response.data.incorrect_urls.length">
            ⚠️ <b>{{ $t("domain.list.add-domains.warning") }}</b><br>
            <span v-html='$t("domain.list.add-domains.warning_message")'></span>:
            <div class="incorrect_urls">{{ response.data.incorrect_urls.join(', ') }}</div>
        </span>
        <br>
      </template>

      <label>{{ $t("domain.list.add-domains.domains_label") }}:</label>
      <b-alert variant="warning" :model-value="a_lot_of_new_domains">
        ⚠️ {{$t("domain.list.add-domains.a_lot_of_new_domains_message")}} <a @click="nav_to_upload">{{$t("domain.list.add-domains.go_to_spreadsheet_upload")}}</a>
      </b-alert>
      <b-alert variant="danger" :model-value="too_many_new_domains">
        ⚠️ {{$t("domain.list.add-domains.too_many_new_domains_message")}} <a @click="nav_to_upload">{{$t("domain.list.add-domains.go_to_spreadsheet_upload")}}</a>
      </b-alert>
      <textarea id="dms" v-model="new_domains" class="url_textarea" :placeholder='$t("domain.list.add-domains.message")'></textarea>
      <br>
      <br>

      </div>
    </template>
    <template #footer>
      <b-button variant="secondary" @click="stop()">{{ $t("domain.list.add-domains.cancel") }}</b-button>
      &nbsp;
      <template v-if="!loading">
        <b-button variant="warning" @click="bulk_add_new()" :disabled="too_many_new_domains">
          {{ $t("domain.list.add-domains.ok") }}
        </b-button>
      </template>
      <template v-else>
        <b-button variant="warning" disabled="disabled">
          <probe/>
          {{ $t("domain.list.add-domains.loading") }}
        </b-button>
      </template>
    </template>
  </b-modal>
</template>

<script>
import http from "@/httpclient";
import Probe from '@/components/probe.vue'

export default {
  name: "AddDomains",
  components: {
    Probe
  },
  props: {
    list: {
      type: Object,
    },
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
