<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
  <div><h3>{{ $t("metric.legend.test_title") }}</h3>
    <ul>
      <li><span class="faq-test category_passed"><span
          class="sr-only">{{ $t("report.legend.results.passed") }}</span>{{ $t("metric.legend.test_good") }}</span></li>
      <li><span class="faq-test category_failed">
                        <span class="sr-only">{{ $t("report.legend.results.failed") }}</span>{{ $t("metric.legend.test_bad") }}</span>
      </li>
      <li><span class="faq-test category_warning"><span class="sr-only">{{
          $t("report.legend.results.warning")
        }}</span>{{ $t("metric.legend.test_warning") }}</span></li>
      <li><span class="faq-test category_error"><span class="sr-only">{{
          $t("report.legend.results.category_error_in_test")
        }}</span>{{ $t("report.legend.icon_legend.category_error_in_test") }}</span></li>
    </ul>
    <h3>{{ $t("metric.legend.subtest_title") }}</h3>
    <ul>
      <li>
        <span class="faq-subtest passed">
          <span class="sr-only">{{ $t("report.legend.results.passed") }}</span>
          {{ $t("metric.legend.subtest_good") }}</span></li>
      <li><span class="faq-subtest failed"><span class="sr-only">{{ $t("report.legend.results.failed") }}</span>{{
          $t("metric.legend.subtest_bad")
        }}</span></li>
      <li><span class="faq-subtest warning"><span class="sr-only">{{
          $t("report.legend.results.warning")
        }}</span>{{ $t("metric.legend.subtest_warning") }}</span></li>
      <li><span class="faq-subtest info"><span class="sr-only">{{
          $t("report.legend.results.info")
        }}</span>{{ $t("metric.legend.subtest_info") }}</span></li>
      <li><span class="faq-test not_tested"><span class="sr-only">{{
          $t("report.legend.results.not_tested")
        }}</span>{{ $t("report.legend.icon_legend.subtest_not_tested") }}</span></li>
      <li><span class="faq-test error_in_test"><span class="sr-only">{{
          $t("report.legend.results.error_in_test")
        }}</span>{{ $t("report.legend.icon_legend.subtest_error_in_test") }}</span></li>
    </ul>
  </div>
</template>

<script>
export default {
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
