<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
    <div>
        <p>
          <i-bi-hourglass-split class="mr-1"/>

            <span v-if="list.last_scan">
                {{ $t("domain.list.status.last_scan_started") }}: {{ humanize_date(list.last_scan) }}, {{ list.last_scan_state }}
            </span>
            <span v-if="!list.last_scan">
                {{ $t("domain.list.status.last_scan_started") }}: {{ $t("domain.list.status.not_scanned_before") }}
            </span>

            <br>
            <template class="scan-configuration">
                <span v-if="list.enable_scans">

                  <i-bi-link />

                    {{ $t("domain.list.status.type_of_scan_performed") }}:
                    <span v-if="list.enable_scans">
                      <scan-type-icon :type="list.scan_type" /> {{ list.scan_type }}
                    </span>
                    <span title="No scans will be performed" v-if="!list.enable_scans">
                        🚫 {{ list.scan_type }}
                    </span><br>

                  <i-bi-arrow-repeat />


                    {{ $t("domain.list.status.scan_frequency") }}: {{ $t("app.frequency." + list.automated_scan_frequency) }} <br>
                    <span v-if="list.automated_scan_frequency !== 'disabled'">
                        {{ $t("domain.list.status.next_scheduled_scan") }}: {{ humanize_date(list.scheduled_next_scan) }} <br>
                    </span>
                </span>
                <span v-if="!list.enable_scans"> {{ $t("domain.list.status.scanning_disabled") }} </span>
            </template>

            <i-bi-share class="mr-1"/>{{$t("domain.list.status.sharing")}}:
            <span v-if="!list.automatically_share_new_reports">{{$t("domain.list.status.Not automatically shared")}}</span>
            <span v-if="list.automatically_share_new_reports">{{$t("domain.list.status.Automatically shared")}}

              <template v-if="list.scan_type === 'all'">
                  <router-link :to="`/latest/${list.id}/mail/`">({{ $t("domain.list.status.mail") }})</router-link>
                  <router-link :to="`/latest/${list.id}/web/`">({{ $t("domain.list.status.web") }})</router-link>
              </template>
              <span class="mb-2 darklink" v-if="list.scan_type === 'web' || list.scan_type === 'mail'">
                <router-link :to="`/latest/${list.id}/`">{{ $t("domain.list.status.on this page") }}</router-link>
              </span>

              <span v-if="list.default_public_share_code_for_new_reports"> - {{$t("domain.list.status.with share code")}}</span>
            </span>
            <span v-if="list.enable_report_sharing_page && list.automatically_share_new_reports">
               - <a :href="`/published/${user.account_id}/`" target="_blank">{{$t("domain.list.status.Listed on sharing page")}}</a>
            </span>
          <br>

            <span v-if="list.last_report_id">
                <router-link :to="{ name: 'numbered_report', params: { report: list.last_report_id }}">
                    <span role="img" :aria-label='$t("domain.list.status.report")'>📊</span>
                    {{ $t("domain.list.status.latest_report") }}: {{ humanize_date(list.last_report_date) }}
                </router-link>
                <br>
            </span>
        </p>
    </div>
</template>

<script>
import ScanTypeIcon from "@/components/ScanTypeIcon.vue";
import { dashboardStore } from '@/dashboardStore'
import {mapState} from 'pinia'

export default {
    name: "about-this-list",
  components: {ScanTypeIcon},
  props: {
        list: {
            type: Object
        },
        urls: {
            type: Array
        }
    },
    computed: mapState(dashboardStore, ['user']),
}
</script>
