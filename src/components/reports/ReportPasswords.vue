<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
  <content-block class="do-not-print" v-if="reports !== undefined" style="background-color: #fff7f7 !important;">
    <h2>⚠️ {{ $t('Authentication required') }}</h2>
    <p>{{ $t('Some reports require authentication') }}</p>

      <b-row v-for="report in reports" :key="report.id" class="p-4" style="border-top: 1px solid silver;">
        <b-col>{{ $t('code') }}: 📊 {{report.public_report_code}}<br>
          {{ $t('name') }}: 📘 {{report.urllist_name}}<br>
          {{ $t('created_on') }}: {{report.at_when.human_date()}}
        </b-col>
        <b-col>
        <template v-if="report.authentication_required">
          <b-form-group
              :label="`❌ ${$t('supply_password')}`"
              label-for="share-code"
              class="mb-0"
          >
            <b-form-input
                type="password"
                id="share-code"
                v-model="$store.state.public_share_codes[report.public_report_code]"
                maxlength="64"
            ></b-form-input>
          </b-form-group>
        </template><template v-else>
          <template v-if="$store.state.public_share_codes[report.public_report_code]">
            ✅ <i>{{ $t('Stored password is valid') }}</i>
          </template>
          <template v-else>
            ✅ <i>{{ $t('No password needed') }}</i>
          </template>
        </template>
        </b-col>
      </b-row>

    <!-- onclick emit retry. -->
    <b-row class="pt-4 pl-3 pb-2" style="border-top: 1px solid silver;">
      <button type="submit" @click="$emit('retry')">{{ $t('Retry with above settings') }}</button>
    </b-row>

  </content-block>
</template>
<script>
export default {
  props: {
    reports: {type: Array, required: true}
  },
  emits: ['retry']
}
</script>
<i18n>
{
  "en": {
    "supply_password": "Please enter the password for this report:",
    "Stored password is valid": "Stored password is valid",
    "No password needed": "No password needed",
    "Retry with above settings": "Open with this password",
    "Authentication required": "Authentication required",
    "Some reports require authentication": "Some reports require authentication, please fill in the password / 'share code' for each report:",
    "code": "Report",
    "name": "Name",
    "created_on": "Created on"
  },
  "nl": {
    "Authentication required": "Wachtwoord vereist",
    "Some reports require authentication": "Voor sommige rapporten is een wachtwoord vereist, vul het wachtwoord of 'deelcode' in voor die rapporten:",
    "supply_password": "Voer een wachtwoord in voor dit rapport:",
    "Stored password is valid": "Het opgeslagen wachtwoord is geldig",
    "No password needed": "Geen wachtwoord vereist",
    "Retry with above settings": "Probeer met dit wachtwoord",
    "code": "Rapport",
    "name": "Naam",
    "created_on": "Gemaakt op"
  }
}
</i18n>