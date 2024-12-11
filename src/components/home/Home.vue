<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
  <div>
    <content-block>
      <h1><i-bi-house /> {{ $t("home.page.title") }}</h1>
      <p v-html='$t("home.page.introduction")'></p>
    </content-block>

    <content-block class="text-center">
      <short-feature-overview />

      <div class="mt-4">
        <b-button variant="warning" to="tour"><i-bi-book/> {{$t("home.page.learn")}}</b-button> &nbsp;
        <b-button variant="warning" class="ml-2" :href="$baseUrl + '/account/login/'" v-if="!user.is_authenticated" ><i-bi-box-arrow-in-right /> {{$t("home.page.log_in")}}</b-button><br>
        <br>
        <b-button v-if="config.show.signup_form" variant="warning" to="signup" class="mb-2 mt-2">{{$t("home.page.request_access")}}</b-button>
      </div>
    </content-block>

    <public-reports/>

  </div>
</template>

<script>
import { dashboardStore } from '@/dashboardStore'
import {mapState} from 'pinia'
import PublicReports from "@/components/home/PublicReports.vue";
import ShortFeatureOverview from "@/components/home/ShortFeatureOverview.vue";

export default {
  components: {ShortFeatureOverview, PublicReports},
  computed: mapState(dashboardStore, ['user', 'config']),
}
</script>
