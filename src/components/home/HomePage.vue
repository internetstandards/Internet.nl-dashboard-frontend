<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
  <div>
    <content-block>
      <h1><i-bi-house /> {{ $t("home.page.title") }}</h1>
      <p v-html='$t("home.page.introduction")'></p>
    </content-block>

    <content-block class="text-center">
      <short-feature-overview />

      <div class="home-actions d-grid d-lg-flex flex-wrap justify-content-center gap-3 mt-2 pt-4 pb-2">
        <b-button
          variant="warning"
          to="tour"
          class="home-action d-inline-flex align-items-center justify-content-center gap-2 px-4 shadow-sm"
        >
          <i-bi-info-circle aria-hidden="true" />
          {{ $t("home.page.learn") }}
        </b-button>
        <b-button
          v-if="config.show.signup_form && !user.is_authenticated"
          variant="warning"
          to="signup"
          class="home-action d-inline-flex align-items-center justify-content-center gap-2 px-4 shadow-sm"
        >
          <i-bi-person-check aria-hidden="true" />
          {{ $t("home.page.request_access") }}
        </b-button>
        <b-button
          v-if="!user.is_authenticated"
          variant="warning"
          to="/account/login"
          class="home-action d-inline-flex align-items-center justify-content-center gap-2 px-4 shadow-sm"
        >
          <i-bi-box-arrow-in-right aria-hidden="true" />
          {{ $t("home.page.log_in") }}
        </b-button>
      </div>
    </content-block>

    <public-reports/>

  </div>
</template>

<script lang="ts">
import { dashboardStore } from '@/dashboardStore'
import {mapState} from 'pinia'
import PublicReports from "@/components/home/PublicReports.vue";
import ShortFeatureOverview from "@/components/home/ShortFeatureOverview.vue";

export default {
  components: {ShortFeatureOverview, PublicReports},
  computed: mapState(dashboardStore, ['user', 'config']),
}
</script>

<style scoped>
.home-action {
  min-height: 3.25rem;
  white-space: normal;
}

.home-action svg {
  flex-shrink: 0;
  font-size: 1.2em;
}
</style>
