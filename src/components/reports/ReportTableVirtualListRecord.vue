<template>
  <tr :class="index % 2 === 0 ? 'stripe' : 'plain'" style="display: inline-block; width: 100%;">
    <template v-if="!source.endpoints.length">
      <td class="px-78" style="white-space: nowrap">
        -
      </td>
      <td>
        <div style="width: 200px; overflow-x: auto; white-space: nowrap;">{{ source.url }}</div>
      </td>
      <td colspan="200">
        <small>{{ $t("report.virtual-list-record.not_eligeble_for_scanning") }}</small>
      </td>
    </template>
    <template v-else>
      <td class="px-78" style="white-space: nowrap">
        <a class='direct_link_to_report'
           :href='report_url(source.endpoints[0])'
           target="_blank"
           v-b-tooltip.hover :title="report_tooltip(source.endpoints[0])"
        >
          <span>
            <div class="logo_image"></div> {{ score(source) }}%
            <img :src='`/static_frontend/images/report_comparison_${score_comparison(source)}.png`'
                 v-if="score_comparison(source)"/>
          </span>
          <span class="visually-hidden"> {{
              $t("report.virtual-list-record.link_to_report", {'url': source.url})
            }}</span>
        </a>
      </td>
      <td class="px-225">
        <div style="width: 200px; overflow-x: auto; white-space: nowrap;">{{ source.url }}</div>
      </td>
      <template v-if="['web', 'mail'].includes(selected_category)">
        <!-- do this only onhover, not prepared: v-b-tooltip.hover :title="make_tooltip(source, category_name)" -->
        <td class="testresultcell px-100"
            v-for="category_name in relevant_categories_based_on_settings"
            :key="category_name"

        >
          <span v-b-tooltip :title="make_tooltip(source, category_name)"
                :class="category_verdict_to_simple_value(category_name, source) + ' ' + (category_comparison(category_name, source) ? `compared_with_next_report_${category_comparison(category_name, source)}` : '')">
            <template v-if="category_comparison(category_name, source)">
              {{ $t("report.virtual-list-record.results.comparison." + category_comparison(category_name, source)) }}
            </template>
            {{ category_verdict_to_simple_value(category_name, source) }}
          </span>

        </td>
      </template>
      <template v-else>
        <!-- v-b-tooltip.hover :title="make_tooltip(source, category_name)" -->
        <td class="testresultcell px-56"
            v-for="category_name in relevant_categories_based_on_settings"
            :key="category_name"
        >
          <span v-b-tooltip :title="make_tooltip(source, category_name)"
                :class="detail_value_simple_value(category_name, source) + ' ' + detail_comparison(category_name, source)">
            {{ detail_value_simple_value(category_name, source) }}
            <template v-if="detail_comparison(category_name, source)">
              {{ $t("report.virtual-list-record.results.comparison." + detail_comparison(category_name, source)) }}
            </template>
          </span>
        </td>
      </template>
      <td>

      </td>
    </template>
  </tr>
</template>

<script>

import report_mixin from "@/components/reports/report_mixin.vue";
import {dashboardStore} from '@/dashboardStore'
import {mapState} from 'pinia'


export default {
  name: "ReportTableVirtualListRecord",
  mixins: [report_mixin],
  props: {
    index: { // index of current item
      type: Number
    },
    source: { // here is: {uid: 'unique_1', text: 'abc'}
      type: Object,
      default() {
        return {}
      }
    },
    reports: {
      type: Array,
    },
    selected_category: {
      type: String,
      default: 'web'
    }
  },
  methods: {

    report_url(source_endpoints) {
      // source.endpoints[0].ratings_by_type.internet_nl_score.internet_nl_url
      if (source_endpoints.ratings)
        return source_endpoints.ratings.internet_nl_score.internet_nl_url
      return source_endpoints.ratings_by_type.internet_nl_score.internet_nl_url
    },
    report_tooltip(source_endpoints) {
      // source.endpoints[0].ratings_by_type.internet_nl_score.since ? `since ${humanize_date_unix_timestamp(source.endpoints[0].ratings_by_type.internet_nl_score.since)}` : ``
      if (source_endpoints.ratings)
        if (source_endpoints.ratings.internet_nl_score.since) {
          return `since ${this.humanize_date_unix_timestamp(source_endpoints.ratings.internet_nl_score.since)}`
        } else {
          return ""
        }

      if (source_endpoints.ratings_by_type.internet_nl_score.since)
        return `since ${this.humanize_date_unix_timestamp(source_endpoints.ratings_by_type.internet_nl_score.since)}`
      return ""
    },
    category_verdict_to_simple_value: function (category_name, url) {
      let verdict = ""
      if (url.endpoints[0].ratings) {
        verdict = url.endpoints[0].ratings[category_name];
      } else {
        verdict = url.endpoints[0].ratings_by_type[category_name];
      }
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

      let other_verdicts;
      if (this.reports[1].calculation.urls_by_url[url.url].endpoints[0].ratings) {
        other_verdicts = this.reports[1].calculation.urls_by_url[url.url].endpoints[0].ratings[category_name];
      } else {
        other_verdicts = this.reports[1].calculation.urls_by_url[url.url].endpoints[0].ratings_by_type[category_name];
      }

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

    score(url) {
      if (url.endpoints[0].ratings) {
        return url.endpoints[0].ratings.internet_nl_score.internet_nl_score;
      } else {
        return url.endpoints[0].ratings_by_type.internet_nl_score.internet_nl_score;
      }
    },

    score_comparison: function (url) {
      if (this.reports.length < 2) {
        return "";
      } else {
        let current_score = 0;
        let other_score = 0;

        // catch undefined:
        try {
          if (url.endpoints[0].ratings) {
            current_score = url.endpoints[0].ratings.internet_nl_score.internet_nl_score;
          } else {
            current_score = url.endpoints[0].ratings_by_type.internet_nl_score.internet_nl_score;
          }

          if (this.reports[1].calculation.urls_by_url[url.url].endpoints[0].ratings) {
            other_score = this.reports[1].calculation.urls_by_url[url.url].endpoints[0].ratings.internet_nl_score.internet_nl_score;
          } else {
            other_score = this.reports[1].calculation.urls_by_url[url.url].endpoints[0].ratings_by_type.internet_nl_score.internet_nl_score;
          }
        } catch (e) {
          // any of the dozens levels is undefined, guarding for this is extremely convoluted
          return ""
        }

        if (current_score === undefined || other_score === undefined)
          return "";

        if (current_score > other_score) {
          return "improved"
        }
        if (current_score < other_score) {
          return "regressed"
        }
        return ""
      }
    },

    detail_value_simple_value(category_name, url) {
      let verdicts = undefined;
      if (url.endpoints[0].ratings) {
        verdicts = url.endpoints[0].ratings[category_name];
      } else {
        verdicts = url.endpoints[0].ratings_by_type[category_name];
      }

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
      let verdicts = undefined;
      if (url.endpoints[0].ratings) {
        verdicts = url.endpoints[0].ratings[category_name];
      } else {
        verdicts = url.endpoints[0].ratings_by_type[category_name];
      }
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
      let other_verdicts = undefined
      if (this.reports[1].calculation.urls_by_url[url.url].endpoints[0].ratings) {
        other_verdicts = this.reports[1].calculation.urls_by_url[url.url].endpoints[0].ratings[category_name];
      } else {
        other_verdicts = this.reports[1].calculation.urls_by_url[url.url].endpoints[0].ratings_by_type[category_name];
      }
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

    make_tooltip(url, category_name) {
      if (!url.endpoints[0])
        return ''

      if (url.endpoints[0].ratings_by_type)
        return this.make_tooltip_ratings_by_type(url, category_name)

      if (!url.endpoints[0].ratings)
        return ""
      if (!url.endpoints[0].ratings[category_name])
        return ''
      if (!url.endpoints[0].ratings[category_name]['since'])
        return ''

      // evidence is in new reports since sept 2023.
      let evidence = ''
      if ('key' in url.endpoints[0].ratings[category_name]) {
        evidence = url.endpoints[0].ratings[category_name]['evidence']
      }

      let displayed_evidence = ''
      if (evidence.charAt(0) === '{' && evidence !== '{}') {
        displayed_evidence = JSON.stringify(JSON.parse(evidence), null, 2);
      }

      let data = `${url.url}<br>
        ${this.$t('metric.' + category_name + '.title')}:
        ${this.$t("report.virtual-list-record.results." + url.endpoints[0].ratings[category_name]['test_result'])}<br>
        ${this.$t("report.virtual-list-record.since")}: ${this.humanize_date_unix_timestamp(url.endpoints[0].ratings[category_name]['since'])}`

      if (displayed_evidence) {
        data += `<br>${this.$t("report.virtual-list-record.evidence")}:<br> <pre>${displayed_evidence}</pre>`
      }
      return data;
    },

    make_tooltip_ratings_by_type(url, category_name) {
      if (!url.endpoints[0].ratings_by_type[category_name])
        return ''
      if (!url.endpoints[0].ratings_by_type[category_name]['since'])
        return ''

      // evidence is in new reports since sept 2023.
      let evidence = ''
      if ('key' in url.endpoints[0].ratings_by_type[category_name]) {
        evidence = url.endpoints[0].ratings_by_type[category_name]['evidence']
      }

      let displayed_evidence = ''
      if (evidence.charAt(0) === '{' && evidence !== '{}') {
        displayed_evidence = JSON.stringify(JSON.parse(evidence), null, 2);
      }

      let data = `${url.url}<br>
        ${this.$t('metric.' + category_name + '.title')}:
        ${this.$t("report.virtual-list-record.results." + url.endpoints[0].ratings_by_type[category_name]['test_result'])}<br>
        ${this.$t("report.virtual-list-record.since")}: ${this.humanize_date_unix_timestamp(url.endpoints[0].ratings_by_type[category_name]['since'])}`

      if (displayed_evidence) {
        data += `<br>${this.$t("report.virtual-list-record.evidence")}:<br> <pre>${displayed_evidence}</pre>`
      }
      return data;
    },


  },

  computed: {
    report_category() {
      if (this.reports[0] !== undefined)
        return this.reports[0].report_type;
      return ""
    },
    relevant_categories_based_on_settings: function () {
      let preferred_fields = [];  // this.categories[this.selected_category];
      this.scan_methods.forEach((scan_method) => {
        // todo: also get relevant column for scan_methods, just like with graphs. But given large refactor,
        // we'll do that later.
        if (['web', 'mail'].includes(scan_method.name) && scan_method.name === this.selected_category) {
          scan_method.categories.forEach((category) => {
            category.fields.forEach((field) => {
              preferred_fields.push(field.name);
            });
          });
        } else {
          // subcategories, dirty fix using the 'key' field to save a lot of iteration.
          scan_method.categories.forEach((category) => {
            // console.log("category " + category.name);
            // Get the fields of the highest level
            if (category.key === this.selected_category) {
              category.categories.forEach((subcategory) => {
                subcategory.fields.forEach((field) => {
                  preferred_fields.push(field.name);
                });
              });
            }
          });
        }
      });
      // console.log("Preferred fields:         " + preferred_fields)
      let visible_preferred_fields = preferred_fields.filter(field => this.visible_metrics[field].visible)
      // console.log("Visible preferred fields: " + visible_preferred_fields)
      return visible_preferred_fields
    },
    ...mapState(dashboardStore, ['visible_metrics']),
  }
}
</script>

<style scoped>


#___BVN__ID__v-0__popover____placeholder {
  display: none;
}

.my-tooltip-class::v-deep .tooltip-inner {
  min-width: 400px !important;
  width: 400px !important;
  text-align: left;
}

.logo_image {
  height: 16px;
  width: 16px;
  background: url("/static_frontend/images/vendor/internet_nl/favicon.png");
  display: inline-block;
  background-size: cover;
}

.stripe {
  background-color: rgba(0, 0, 0, .05);
}

.plain {
  background-color: rgba(0, 0, 0, .00);
}

tr {
  min-width: 100%;

}

td, th {
  padding: .75rem;
  vertical-align: top;


}
</style>
