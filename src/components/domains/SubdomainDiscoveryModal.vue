<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
  <b-modal :id="id" @ok="$emit('ok')" header-bg-variant="info"
           header-text-variant="light" no-fade scrollable size="lg" :ok-title="$t('ok')" :cancel-title="$t('cancel')">
    <h3 slot="modal-title">{{ $t("title") }}</h3>
    <div slot="default">
      <p>{{ $t("message") }}</p>
    </div>
  </b-modal>
</template>
<script>

export default {
  name: "SubdomainDiscoveryModal",
  props: {
    id: {type: String}
  }
}
</script>

<i18n>
{
  "en": {
    "title": "Add 'www' subdomains",
    "message": "Find subdomains for all domains in the current list. The subdomains will be tested if they resolve for mail, web or both depending on the list setting. Every valid subdomain will be added to the list. For large lists this can take a while and have lost of results.",
    "ok": "Find subdomains",
    "cancel": "Back to the list"
  },
  "nl": {
    "title": "Zoek 'www' subdomeinen",
    "message": "Voeg automatisch subdomeinen toe voor alle hoofddomeinen in de huidige lijst. Ieder subdomein wordt getest voor mail, web of beide afhankelijk van de instellingen van de lijst. Wanneer een geldig en bereikbaar subdomein is gevonden wordt deze toegevoegd. Deze actie kan even duren voor grote lijsten en kan erg veel subdomeinen opleveren.",
    "ok": "Zoek subdomeinen",
    "cancel": "Back to the list"
  }
}
</i18n>