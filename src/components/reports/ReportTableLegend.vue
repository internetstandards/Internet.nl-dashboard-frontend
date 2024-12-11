<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
  <div><h3>{{ $t("metric.legend.test_title") }}</h3>
    <ul>
      <li>
        <span class="faq-test category_passed">
          <span class="visually-hidden">{{ $t("report.legend.results.passed") }}</span>
        </span>
        {{ $t("metric.legend.test_good") }}
      </li>
      <li>
        <span class="faq-test category_failed">
          <span class="visually-hidden">{{ $t("report.legend.results.failed") }}</span>
        </span>
        {{ $t("metric.legend.test_bad") }}
      </li>
      <li>
        <span class="faq-test category_warning">
          <span class="visually-hidden">{{ $t("metric.legend.test_warning") }}</span>
        </span>
        {{ $t("report.legend.results.warning") }}
      </li>
      <li>
        <span class="faq-test category_error">
          <span class="visually-hidden">{{ $t("report.legend.results.category_error_in_test") }}</span>
        </span>
        {{ $t("report.legend.icon_legend.category_error_in_test") }}
      </li>
    </ul>
    <h3>{{ $t("metric.legend.subtest_title") }}</h3>
    <ul>
      <li>
        <span class="faq-subtest passed">
          <span class="visually-hidden">{{ $t("report.legend.results.passed") }}</span>
        </span>
        {{ $t("metric.legend.subtest_good") }}
      </li>
      <li>
        <span class="faq-subtest failed">
          <span class="visually-hidden">{{ $t("report.legend.results.failed") }}</span>
        </span>
        {{ $t("metric.legend.subtest_bad") }}
      </li>
      <li>
        <span class="faq-subtest warning">
          <span class="visually-hidden">{{ $t("report.legend.results.warning") }}</span>
        </span>
        {{ $t("metric.legend.subtest_warning") }}
      </li>
      <li>
        <span class="faq-subtest info">
          <span class="visually-hidden">{{ $t("report.legend.results.info") }}</span>
        </span>
        {{ $t("metric.legend.subtest_info") }}
      </li>
      <li>
        <span class="faq-test not_tested">
          <span class="visually-hidden">{{ $t("report.legend.results.not_tested") }}</span>
        </span>
        {{ $t("report.legend.icon_legend.subtest_not_tested") }}
      </li>
      <li>
        <span class="faq-test error_in_test">
          <span class="visually-hidden">{{ $t("report.legend.results.error_in_test") }}</span>
        </span>
        {{ $t("report.legend.icon_legend.subtest_error_in_test") }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "report_table_legend.vue"
}
</script>
<style scoped>
li {
  margin-bottom: 0.4em;
}
</style>
