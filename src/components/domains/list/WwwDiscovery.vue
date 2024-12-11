<template>
  <span>
    <template
        v-if="['not_scanned_at_all'].includes(state_message) || ['finished', 'error', 'cancelled'].includes(state)">

      <b-button size="sm" v-if="success_while_visible" @click="reload_and_reset();" variant="success" :disabled="loading">
        🔎 {{ $t("domain.www-discovery.scanning-done-click-reload") }}
      </b-button>

      <b-button variant="success" size="sm" v-if="!success_while_visible" v-b-modal="`subdomain_discovery_modal_${list_id}`" :disabled="loading" @click="make_visible()">
        🔎 {{ $t("domain.www-discovery.find-www-subdomains") }}
        <span v-if="state_changed_on">{{ $t("domain.www-discovery.last-scan-finished") }}</span></b-button>
    </template>
    <template v-else>
      <b-button size="sm"  @click="status" :disabled="loading">
        <probe/>
        {{ $t("domain.www-discovery.finding-www-subdomains") }}
      </b-button>
    </template>

   <subdomain-discovery-modal :id="`subdomain_discovery_modal_${list_id}`" v-if="modal_visible" @close="modal_visible=false" @ok="request(); modal_visible=false"/>
  </span>
</template>

<script>
import http from "@/httpclient";
import SubdomainDiscoveryModal from "@/components/domains/list/WwwDiscoveryModal.vue";
import Probe from '@/components/probe.vue'

export default {
  name: "SubdomainDiscovery",
  components: {SubdomainDiscoveryModal, Probe},
  props: {
    list_id: {type: Number}
  },
  data() {
    return {
      // auto update timer...
      timer: null,

      loading: false,

      state: 'finished',
      state_message: '',
      state_changed_on: '',
      domains_discovered: {},
      success_while_visible: false,

      modal_visible: false,
    }
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  created: function () {
      this.timer = setInterval(this.status_while_scanning, 10000)
  },
  mounted() {
    // todo: recheck every minute or so until the state is finished|error|cancelled
    // note: do not automatically reload lists as a aside effect, might be annoying when someones edits just disappear.
    this.status()
  },
  computed: {
    is_scanning() {return ['requested', 'scanning'].includes(this.state)}
  },
  methods: {
    make_visible() {
      this.modal_visible = true;
      this.modal_visible = true;
      this.modal_visible = true;
      this.modal_visible_2 = "true";
      console.log('show modal');
    },
    reset() {
      this.state = 'finished';
      this.state_message = '';
      this.state_changed_on = '';
      this.domains_discovered = {};
      this.success_while_visible = false;
    },
    request() {
      this.loading = true;
      http.get(`/data/urllist/discover-subdomains/${this.list_id}/`).then(data => {
        this.handle_response(data)
      });
    },
    status_while_scanning() {
      if (this.is_scanning)
        this.status()
    },
    reload_and_reset() {
      this.$emit('finished')
      this.reset()
      this.status()
      this.visible = true;
      console.log('tada')
    },
    status() {
      this.loading = true;
      http.get(`/data/urllist/discover-subdomains-status/${this.list_id}/`).then(data => {
        this.handle_response(data)
      });
    },
    handle_response(data) {
      let response = data.data

      // Any operation response that is not happy
      if (response.error) {
        this.reset()
        this.state = 'error'
        this.state_message = data.data.message
        this.loading = false
        return
      }

      // if this component goes from from anything to 'finished' then:
      if (response.state === 'finished' && this.state !== 'finished')
        this.success_while_visible = true;

      // Any happy operation response
      this.state = response.state
      this.state_message = response.state_message
      this.state_changed_on = response.state_changed_on
      this.domains_discovered = response.domains_discovered
      this.loading = false

    }
  }
}
</script>
