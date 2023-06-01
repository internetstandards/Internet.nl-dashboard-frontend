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
.category_passed {
  background-image: url("/static_frontend/images/vendor/internet_nl/icon-circle-check.svg");
}

.passed {
  background-image: url("/static_frontend/images/vendor/internet_nl/li-shield-ok.svg");
}

.category_failed {
  background-image: url("/static_frontend/images/vendor/internet_nl/icon-circle-error.svg");
}

.failed {
  background-image: url("/static_frontend/images/vendor/internet_nl/icon-error.svg");
}

.warning {
  background-image: url("/static_frontend/images/vendor/internet_nl/icon-warning.svg");
}

.category_info {
  background-image: url("/static_frontend/images/vendor/internet_nl/icon-info.svg");
}

.category_unknown {
  background-image: url("/static_frontend/images/vendor/internet_nl/icon-circle-check.svg");
}


.category_warning {
  background-image: url("/static_frontend/images/vendor/internet_nl/icon-circle-warning.svg");
}

.category_error {
  background-image: url("/static_frontend/images/vendor/internet_nl/probe-error.svg");
}

.info {
  background-image: url("/static_frontend/images/vendor/internet_nl/icon-info.svg");
}

/* First name was old internet.nl v1 api, second is v2 api.*/
.good_not_tested {
  background-image: url("/static_frontend/images/vendor/internet_nl/icon-not-tested-question-mark.svg");
}

.error_in_test, .error, .not_testable, .unreachable, .untestable {
  background-image: url("/static_frontend/images/vendor/internet_nl/icon-not-tested-bolt.svg");
}

.not_applicable, .not_tested, .no_mx {
  background-image: url("/static_frontend/images/vendor/internet_nl/icon-not-tested.svg");
}

.faq-subtest {
  padding-left: 1.5em;
  background-image: url("/static_frontend/images/vendor/internet_nl/icon-testresult-default.svg");
  background-size: 1.125em 1.125em
}

.testresult.passed, .faq-subtest.passed {
  background-image: url("/static_frontend/images/vendor/internet_nl/icon-check.svg") !important
}

.testresult.failed, .faq-subtest.failed {
  background-image: url("/static_frontend/images/vendor/internet_nl/icon-error.svg") !important
}

.testresult.warning, .faq-subtest.warning {
  background-image: url("/static_frontend/images/vendor/internet_nl/icon-warning.svg") !important
}

.testresult.info, .faq-subtest.info {
  background-image: url("/static_frontend/images/vendor/internet_nl/icon-info.svg") !important
}

.testresult.good-not-tested, .faq-subtest.good-not-tested {
  background-image: url("/static_frontend/images/vendor/internet_nl/icon-not-tested-question-mark.svg") !important
}

.testresult.not-tested, .faq-subtest.not-tested {
  background-image: url("/static_frontend/images/vendor/internet_nl/icon-not-tested.svg") !important
}


.testresults h2.error, .faq-test.error, #testresults-overview ul li.error {
  background-image: url("/static_frontend/images/vendor/internet_nl/probe-error.svg") !important
}

.testresults h2.warning, .faq-test.warning, .test-header .test-title h2.warning, #testresults-overview ul li.warning {
  background-image: url("/static_frontend/images/vendor/internet_nl/icon-circle-warning.svg") !important
}

.testresults h2.failed, .faq-test.failed, .test-header .test-title h2.failed, #testresults-overview ul li.failed {
  background-image: url("/static_frontend/images/vendor/internet_nl/icon-circle-error.svg") !important
}

.testresults h2.info, .faq-test.info, .test-header .test-title h2.info, #testresults-overview ul li.info {
  background-image: url("/static_frontend/images/vendor/internet_nl/icon-info.svg") !important
}

.testresults h2.passed, .faq-test.passed, .test-header .test-title h2.passed, #testresults-overview ul li.passed {
  background-image: url("/static_frontend/images/vendor/internet_nl/icon-circle-check.svg") !important
}


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
