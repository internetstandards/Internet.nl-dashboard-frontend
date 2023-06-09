<template>
  <div>
    <b-table :items="items" :fields="fields" sticky-header striped responsive small style="min-height: 70vh"
             :filter="url_filter"
             :filter-included-fields="['url']"
             :current-page="currentPage"
             :per-page="perPage"
             :sort-by.sync="sortBy"
             :sort-desc.sync="sortDesc"
             primary-key="url"
    >
      <template #thead-top="" v-if="!['web', 'mail'].includes(category)">
        <b-tr>
          <b-th></b-th>
          <b-th style="background-color: white;" class="b-table-sticky-column">&nbsp;</b-th>
          <template v-for="group_header in group_headers">
            <b-th :key="group_header.key" :colspan="group_header.colspan" :variant="group_header.color">
              {{ group_header.header }}
            </b-th>
          </template>
        </b-tr>
      </template>

      <template #cell(endpoints[0].ratings_by_type.internet_nl_score)="data">
        <template v-if=" data.item.endpoints[0]">
        <div class="logo" /> {{ data.item.endpoints[0].ratings_by_type.internet_nl_score.internet_nl_score }}%
          </template>
      </template>

      <template #cell(url)="data">
        {{ data.value }}
      </template>

      <template #cell()="data">
        <img :src="image_mapping[data.field.fieldType + '_' + data.value]" class="icon"/> {{ data.value }}
        <template v-if="data.field.fieldType === 'category'">
          {{ category_comparison(data.field.field, data.item) }}
        </template>
        <template v-else>
          {{ detail_comparison(data.field.field, data.item) }}
        </template>
      </template>

    </b-table>
  </div>
</template>

<script>

import report_mixin from "@/components/reports/report_mixin";

export default {
  mixins: [report_mixin],
  name: "ReportTableTable",
  props: {
    items: {
      type: Array,
      required: true
    },
    fields: {
      type: Array,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    reports: {
      type: Array,
      required: true
    },
    url_filter: {
      type: String,
      required: false
    },
    perPage: {
      type: Number,
      required: true
    },
    currentPage: {
      type: Number,
      required: true
    }
  },

  data() {
    return {

      image_mapping: {
        'category_passed': '/static_frontend/images/vendor/internet_nl/icon-circle-check.svg',
        'category_failed': '/static_frontend/images/vendor/internet_nl/icon-circle-error.svg',
        'category_warning': '/static_frontend/images/vendor/internet_nl/icon-circle-warning.svg',
        'category_info': '/static_frontend/images/vendor/internet_nl/icon-info.svg',
        'category_good-not-tested': '/static_frontend/images/vendor/internet_nl/icon-not-tested-question-mark.svg',
        'category_not-testable': '/static_frontend/images/vendor/internet_nl/icon-not-tested.svg',
        'category_not_tested': '/static_frontend/images/vendor/internet_nl/icon-not-tested.svg',
        'category_error': '/static_frontend/images/vendor/internet_nl/probe-error.svg',

        'detail_passed': '/static_frontend/images/vendor/internet_nl/icon-check.svg',
        'detail_failed': '/static_frontend/images/vendor/internet_nl/icon-error.svg',
        'detail_warning': '/static_frontend/images/vendor/internet_nl/icon-warning.svg',
        'detail_info': '/static_frontend/images/vendor/internet_nl/icon-info.svg',
        'detail_good-not-tested': '/static_frontend/images/vendor/internet_nl/icon-not-tested-question-mark.svg',
        'detail_not-testable': '/static_frontend/images/vendor/internet_nl/icon-not-tested.svg',
        'detail_not_tested': '/static_frontend/images/vendor/internet_nl/icon-not-tested.svg',
        'detail_error': '/static_frontend/images/vendor/internet_nl/probe-error.svg',
        '': '',
        'regressed': '/static_frontend/images/report_comparison_regressed.png',
        'improved': '/static_frontend/images/report_comparison_improved.png',
        'neutral': '',
      },

      sortBy: 'url',
      sortDesc: false,
    }
  },

  methods:{

    category_verdict_to_simple_value: function (category_name, url) {
      if (!url.endpoints[0]){
        return 'unknown';
      }
      let verdict = url.endpoints[0].ratings_by_type[category_name];
      return this._category_verdict_to_simple_value(verdict, category_name)
    },

    _category_verdict_to_simple_value: function (verdict, category_name) {
      if (verdict === undefined)
        return "unknown";

      // Internet.nl API V2.0:
      if (verdict.test_result !== undefined) {
        return verdict.test_result;
      }

      // backwards compatible with API v1.0 reports:
      if (verdict.ok > 0) {
        return 'passed'
      }
      if (verdict.ok < 1) {
        if (category_name === 'internet_nl_web_appsecpriv') {
          return "warning";
        }
        return "failed"
      }
    },

    category_comparison: function (category_name, url) {
      let simple_value = this.category_verdict_to_simple_value(category_name, url);

      if (this.reports.length < 2 || this.reports[1].calculation.urls_by_url[url.url] === undefined)
        return "";

      // in case there is no endpoint (exceptional case)
      if (this.reports[1].calculation.urls_by_url[url.url].endpoints[0] === undefined)
        return "";

      let other_verdicts = this.reports[1].calculation.urls_by_url[url.url].endpoints[0].ratings_by_type[category_name];
      let other_simple_value = this._category_verdict_to_simple_value(other_verdicts, category_name);

      let progression = {'passed': 4, 'warning': 3, 'info': 2, 'failed': 1};

      if (simple_value === other_simple_value || simple_value === "unknown" || other_simple_value === "unknown")
        return "neutral";

      if (progression[simple_value] > progression[other_simple_value])
        return "improved";

      if (progression[simple_value] < progression[other_simple_value])
        return "regressed";

      return "neutral";
    },

    detail_value_simple_value(category_name, url) {
      let verdicts = url.endpoints[0].ratings_by_type[category_name];

      if (verdicts === undefined) {
        return "unknown";
      }
      // API V2.0:
      if (verdicts.test_result !== undefined)
        return verdicts.test_result;  // error, not_testable, failed, warning, info, passed

      // API V1.0
      return verdicts.simple_verdict;
    },

    detail_value_simple_progression(category_name, url) {
      let verdicts = url.endpoints[0].ratings_by_type[category_name];
      return verdicts ? verdicts.simple_progression : "unknown";
    },

    detail_comparison: function (category_name, url) {
      /**
       * This function is called numerous times. It has been optimzed in the following ways:
       * - Translations have been removed, saving 1 second for (500 * 16) = 8000 metrics.
       * - values are precalculated: simple_value, simple_progression, score etc...
       * */
      /* disabling translations saves a second on 500 urls and the TLS page. Therefore no translations are applied */

      // If we're not in comparison mode, just return the value.
      // a template string litteral is slower than just an ordinary string that will be parsen by the browser...
      // https://jsperf.com/es6-string-literals-vs-string-concatenation
      if (this.reports.length < 2)
        return ""

      // if we _are_ comparing, but the comparison is empty because there is nothing to compare to:
      // This is done separately to prevent another call to something undefined
      if (this.reports[1].calculation.urls_by_url[url.url] === undefined)
        return ""

      // in case there is no endpoint (exceptional case)
      if (this.reports[1].calculation.urls_by_url[url.url].endpoints[0] === undefined)
        return ""

      let simple_value = this.detail_value_simple_value(category_name, url);
      let simple_progression = this.detail_value_simple_progression(category_name, url);
      /*
      * This compares if the new value is progressive, neutral or regressive.
      * All to/from not_testable and not_applicable is neutral.
      * From good to worst: passed, info, warning, failed.
      *
      * Possible values are: not_applicable, not_testable, failed, warning, info, passed
      * */

      // older, previous...
      let other_verdicts = this.reports[1].calculation.urls_by_url[url.url].endpoints[0].ratings_by_type[category_name];
      let other_simple_value = "";
      let other_simple_progression = "";

      if (other_verdicts === undefined) {
        other_simple_value = "unknown";
        other_simple_progression = "unknown";
      } else {
        if (other_verdicts.test_result !== undefined)
            // API V2.0:
          other_simple_value = other_verdicts.test_result;  // error_in_test, not_testable, failed, warning, info, passed
        else
            // API V1.0
          other_simple_value = other_verdicts.simple_verdict;
        other_simple_progression = other_verdicts.simple_progression;
      }


      // all to and from not_tested or not_applicable is neutral, also going to the same state is neutral
      if (simple_value === other_simple_value)
        return "neutral";

      const neutral_values = ["unknown", "not_applicable", "not_testable", 'no_mx', 'untestable', 'unreachable', 'error_in_test', 'error', 'not_tested'];

      if (neutral_values.includes(simple_value) || neutral_values.includes(other_simple_value))
        return "neutral";


      if (simple_progression > other_simple_progression)
        return "improved";
      else
        return "regressed";
    },

  },

  computed: {
    group_headers() {
      // Fields might be disabled, which calls for calculating this dynamically.
      // We could want a random mix of fields, so this must be done dynamically.
      let headers = [];

      let previous_category_name = '';
      let newset = {'header': '', 'colspan': 1, 'key': 0, 'color': 'primary'}
      let i = 0;

      this.fields.forEach((field) => {
        if (field.field === 'score' || field.field === 'url')
          return;

        let category_name = this.field_name_to_category_names[field.field];
        if (category_name !== previous_category_name) {
          previous_category_name = category_name;
          if (i !== 0)
            headers.push(newset);
          i++;
          newset = {'header': category_name, colspan: 1, key: i, color: i % 2 === 0 ? 'primary' : 'secondary'}
        } else {
          newset.colspan++;
        }
      });
      headers.push(newset);
      return headers;
    }
  }

}
</script>

<style scoped>
.icon {
  width: 16px;
  height: 16px;
}

.logo {
  height: 16px;
  width: 16px;
  background: url("/static_frontend/images/vendor/internet_nl/favicon.png");
  display: inline-block;
  background-size: cover;
}
</style>