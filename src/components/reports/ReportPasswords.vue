<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
  <content-block class="do-not-print" v-if="reports !== undefined">
    <h2>⚠️ {{ $t("report.password-protection.Authentication required") }}</h2>
    <p>{{ $t("report.password-protection.Some reports require authentication") }}</p>

      <b-row v-for="report in reports" :key="report.id" class="p-4 border-top border-secondary">
        <b-col>{{ $t("report.password-protection.code") }}: 📊 {{report.public_report_code}}<br>
          {{ $t("report.password-protection.name") }}: 📘 {{report.urllist_name}}<br>
          {{ $t("report.password-protection.created_on") }}: {{report.at_when.human_date()}}
        </b-col>
        <b-col>
        <template v-if="report.authentication_required">
          <b-form-group
              :label='`❌ ${$t("report.password-protection.supply_password")}`'
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
            ✅ <i>{{ $t("report.password-protection.Stored password is valid") }}</i>
          </template>
          <template v-else>
            ✅ <i>{{ $t("report.password-protection.No password needed") }}</i>
          </template>
        </template>
        </b-col>
      </b-row>

    <!-- onclick emit retry. -->
    <b-row class="pt-4 pl-3 pb-2 border-top border-secondary">
      <button type="submit" @click="$emit('retry')">{{ $t("report.password-protection.Retry with above settings") }}</button>
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
