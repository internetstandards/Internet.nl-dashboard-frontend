<!-- SPDX-License-Identifier: Apache-2.0 -->
<style>
figure img {
  border: thin silver solid;
}

figcaption {
  text-align: left !important;
  font-style: italic !important;
  font-size: smaller !important;
  color: dimgray;
}

figure {

  text-indent: 0;
  border: thin #05BFD6 solid;
  margin: 0.5em;
  padding: 0.5em;
}

img.scaled {
  width: 100%;
}
</style>

<template>
  <div id="demo-template">
    <content-block>
      <h1>
        <b-icon icon="info-circle"/>
        {{ $t("tour.title") }}
      </h1>
      <p v-html="$t('tour.introduction')"></p>
      <p v-html='$t("tour.contact_information")'></p>
    </content-block>


    <content-block>

      <feature-row :feature="feature" :key='feature' :translation="$i18n" v-for="feature in features"/>


    </content-block>

  </div>
</template>

<script>
import FeatureRow from "@/components/tour/FeatureRow";

export default {
  components: {FeatureRow},
  data() {
    return {
      features: ['manage_domains', 'import_domains', 'scan', 'focus_on_metrics', 'report_table', 'report_bar_chart',
      'report_timeline', 'export_spreadsheet', 'report_sharing', 'account_notifications']
      // account_two_fa
    }
  }
}
</script>
