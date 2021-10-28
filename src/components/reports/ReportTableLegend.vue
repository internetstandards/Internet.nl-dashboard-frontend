<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
  <div><h3>{{ $t("test_title") }}</h3>
    <ul>
      <li><span class="faq-test category_passed"><span
          class="sr-only">{{ $t("results.passed") }}</span>{{ $t("test_good") }}</span></li>
      <li><span class="faq-test category_failed">
                        <span class="sr-only">{{ $t("results.failed") }}</span>{{ $t("test_bad") }}</span>
      </li>
      <li><span class="faq-test category_warning"><span class="sr-only">{{
          $t("results.warning")
        }}</span>{{ $t("test_warning") }}</span></li>
      <li><span class="faq-test category_error"><span class="sr-only">{{
          $t("results.category_error_in_test")
        }}</span>{{ $t("icon_legend.category_error_in_test") }}</span></li>
    </ul>
    <h3>{{ $t("subtest_title") }}</h3>
    <ul>
      <li>
        <span class="faq-subtest passed">
          <span class="sr-only">{{ $t("results.passed") }}</span>
          {{ $t("subtest_good") }}</span></li>
      <li><span class="faq-subtest failed"><span class="sr-only">{{ $t("results.failed") }}</span>{{
          $t("subtest_bad")
        }}</span></li>
      <li><span class="faq-subtest warning"><span class="sr-only">{{
          $t("results.warning")
        }}</span>{{ $t("subtest_warning") }}</span></li>
      <li><span class="faq-subtest info"><span class="sr-only">{{
          $t("results.info")
        }}</span>{{ $t("subtest_info") }}</span></li>
      <li><span class="faq-test not_tested"><span class="sr-only">{{
          $t("results.not_tested")
        }}</span>{{ $t("icon_legend.subtest_not_tested") }}</span></li>
      <li><span class="faq-test error_in_test"><span class="sr-only">{{
          $t("results.error_in_test")
        }}</span>{{ $t("icon_legend.subtest_error_in_test") }}</span></li>
    </ul>
  </div>
</template>

<script>

import field_translations from '../FieldTranslations'

export default {
  i18n: {
    sharedMessages: field_translations,
  },
  name: "report_table_legend.vue"
}
</script>

<style scoped>

</style>

<i18n>
{
  "en": {
    "results": {
      "not_applicable": "Not applicable",
      "not_testable": "Not testable",
      "error_in_test": "Test error",
      "category_error_in_test": "Test error",
      "not_tested": "Not tested",
      "failed": "Failed",
      "warning": "Warning",
      "info": "Info",
      "passed": "Passed",
      "unknown": "Unknown",
      "comparison": {
        "neutral": "-",
        "improved": "Improved compared to the second report selected.",
        "regressed": "Regressed compared to the second report selected."
      }
    },
    "icon_legend": {
      "title": "Legend of used icons",
      "category_error_in_test": "Error occurred while testing ⇒ null score",
      "subtest_not_applicable": "Not applicable ⇒ no score impact",
      "subtest_not_tested": "Not tested ⇒ no score impact",
      "subtest_error_in_test": "Error occurred while testing ⇒ null score"
    }
  },
  "nl": {
    "results": {
      "not_applicable": "Niet van toepassing",
      "not_testable": "Niet testbaar",
      "error_in_test": "Testfout",
      "category_error_in_test": "Testfout",
      "not_tested": "Niet getest",
      "failed": "Niet goed",
      "warning": "Waarschuwing",
      "info": "Info",
      "passed": "Goed",
      "unknown": "Onbekend",
      "comparison": {
        "neutral": "-",
        "improved": "Verbeterd vergeleken met het 2e geselecteerde rapport.",
        "regressed": "Verslechterd vergeleken met het 2e geselecteerde rapport."
      }
    }
  },
  "icon_legend": {
    "title": "Legenda van gebruikte pictogrammen",
    "category_error_in_test": "Fout in test ⇒ nulscore",
    "subtest_not_tested": "Niet getest ⇒ geen score impact",
    "subtest_error_in_test": "Fout in test ⇒ nulscore"
  }
}
</i18n>
