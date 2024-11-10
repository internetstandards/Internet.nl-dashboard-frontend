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
      <h1><b-icon icon="house" /> {{ $t("home.page.title") }}</h1>
      <p v-html='$t("home.page.introduction")' class="mb-2 mt-2"></p>
    </content-block>

    <content-block class="text-center">
      <short-feature-overview />

      <div class="mt-4">
        <button @click="$router.push({name: 'tour'})" variant="info"><b-icon icon="book"/> {{$t("home.page.learn")}}</button>
        <a :href="$baseUrl + '/account/login/'"><button variant="success" class="ml-2" v-if="!user.is_authenticated" ><b-icon icon="box-arrow-in-right" /> {{$t("home.page.log_in")}}</button></a><br>
        <br>
        <router-link to="signup" class="mb-2 mt-2">{{$t("home.page.request_access")}}</router-link>
      </div>
    </content-block>


    <public-reports></public-reports>

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
