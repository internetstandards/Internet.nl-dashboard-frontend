<!-- SPDX-License-Identifier: Apache-2.0 -->
<style scoped>
ol {
    list-style: decimal;
}
h2 {
  font-size: 1.2em;
}
</style>
<template>
  <div>
    <content-block>
      <h1><b-icon icon="house" /> {{ $t("title") }}</h1>
      <p v-html="$t('introduction')" class="mb-2 mt-2"></p>
    </content-block>

    <content-block class="text-center">
      <short-feature-overview />

      <div class="mt-4">
        <b-button to="tour" variant="info"><b-icon icon="book"/> {{$t('learn')}}</b-button>
        <b-button to="login" variant="success" class="ml-2" v-if="!user.is_authenticated" ><b-icon icon="box-arrow-in-right" /> {{$t('log_in')}}</b-button>
        <p class="mb-2 mt-2">{{$t('request_access')}}<a href="mailto:vraag@internet.nl">vraag@internet.nl</a>.</p>
      </div>
    </content-block>

    <content-block>
      <public-reports></public-reports>
    </content-block>

  </div>
</template>

<script>
import PublicReports from "@/components/home/PublicReports";
import {mapState} from 'vuex'
import ShortFeatureOverview from "@/components/home/ShortFeatureOverview";

export default {
  components: {ShortFeatureOverview, PublicReports},
  computed: mapState(['user']),
}
</script>
<i18n>
{
  "en": {
    "title": "Welcome to the internet.nl Dashboard",
    "introduction": "Bulk scan modern internet standards on thousands of domains in one go, including reports.",
    "request_access": "Request access by sending an e-mail to: ",
    "learn": "Learn what the dashboard can do for you, here...",
    "log_in": "Log in"
  },
  "nl": {
    "title": "Welkom op het internet.nl Dashboard",
    "introduction": "Meet duizenden domeinen tegelijk op moderne internetstandaarden, inclusief rapportage.",
    "request_access": "Vraag toegang aan door een mail te sturen naar: ",
    "learn": "Bekijk hier wat het dashboard mogelijk maakt",
    "log_in": "Inloggen"
  }
}

</i18n>