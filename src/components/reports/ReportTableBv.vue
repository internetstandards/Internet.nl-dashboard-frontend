<!-- SPDX-License-Identifier: Apache-2.0 -->
<template>
  <div>
    <h2>{{ $t("report.title") }}</h2>
    <a class="anchor" name="report"></a>

    <applied-tags/>
    <p v-if="load_comparison_with_current">{{ $t("report.intro") }}</p>

    <differences-to-current-list :report_id="reports[0].id" v-if="load_comparison_with_current"/>

    <collapse-panel :title='$t("icon_legend.title")' class="do-not-print">
      <div slot="content">
        <report-table-legend/>
      </div>
    </collapse-panel>
    <b-tabs>
      <b-tab :title="$t(this.report_category)">
        <b-row>
          <b-col>
            <b-input v-model="url_filter" :debounce="200" :placeholder="$t('report.url_filter')"></b-input>
          </b-col>
          <b-col>
            <b-pagination
                v-model="currentPage"
                :total-rows="original_urls.length"
                :per-page="perPage"
                pills
                limit="10"
                class="mb-2"
                :value="currentPage"
                :filter="url_filter"
                :filter-included-fields="['url']"
                v-if="original_urls.length > perPage"
            ></b-pagination>
          </b-col>
        </b-row>
        <ReportTableTable :reports="reports" :category="this.report_category"
                          :fields="createFields(this.report_category)" :items="original_urls" :url_filter="url_filter"
                          :per-page="perPage" :current-page="currentPage"/>
      </b-tab>
      <b-tab :title="$t(category)" v-for="category in relevant_categories_based_on_settings" :key="category" lazy>
        <b-row>
          <b-col>
            <b-input v-model="url_filter" :debounce="200" :placeholder="$t('report.url_filter')"></b-input>
          </b-col>
          <b-col>
            <b-pagination
                v-model="currentPage"
                :total-rows="original_urls.length"
                :per-page="perPage"
                pills
                limit="10"
                class="mb-2"
                :value="currentPage"
                :filter="url_filter"
                :filter-included-fields="['url']"
                v-if="original_urls.length > perPage"
            ></b-pagination>
          </b-col>
        </b-row>
        <ReportTableTable :reports="reports" :category="category" :fields="createFields(category)"
                          :items="original_urls" :url_filter="url_filter" :per-page="perPage"
                          :current-page="currentPage"/>
      </b-tab>
    </b-tabs>

    <!--
    <div class="sticky-table-container start-on-new-page position-relative">
      <div id="horrible-chrome-td-sticky-white-background-fix"></div>
      <table class="table table-striped">
        <thead class="sticky_labels">

        <tr class="sticky_labels">
          <th class="sticky-header bg-white col-1">
            <div class="rotate">
              <span @click="sortBy('score')" class="arrow"
                    :class="sortOrders['score'] === -1 ? 'dsc' : (sortOrders['score'] === 1 ? 'asc' : 'unknown')"></span>
              <span @click="sortBy('score')">{{ $t("score") }}</span>
            </div>
          </th>
          <th class="sticky-header bg-white">
            <div class="rotate">
              <div @click="sortBy('url')" class="arrow"
                   :class="sortOrders['url'] === -1 ? 'dsc' : (sortOrders['url'] === 1 ? 'asc' : 'unknown')"></div>
              <div @click="sortBy('url')" class="d-inline-block">{{ $t("domain") }}</div>
            </div>
          </th>

          <th colspan="200" class="sticky-header bg-white">
            <template v-if="['web', 'mail'].includes(selected_category)">

              <div class="header_top_category"
                   v-for="category in relevant_categories_based_on_settings" :key="category">
                <div class="rotate">
                  <span @click="sortBy(category)" class="arrow"
                        :class="sortOrders[category] === -1 ? 'dsc' : (sortOrders[category] === 1 ? 'asc' : 'unknown')"></span>
                  <span @click="sortBy(category)">{{ $t("" + category) }}</span>
                </div>
              </div>

            </template>
            <template v-else>

              <div class="header_sub_category"
                   v-for="category in relevant_categories_based_on_settings" :key="category">
                <div class="rotate nowrap">
                  <div @click="sortBy(category)" class="arrow"
                       :class="sortOrders[category] === -1 ? 'dsc' : (sortOrders[category] === 1 ? 'asc' : 'unknown')"></div>
                  <div @click="sortBy(category)" class="d-inline-block">
                    {{ $t("" + category) }}
                    <div class="small text-secondary pl-3 close_to_top"
                        v-html="category_from_field_name(category)"></div>
                  </div>
                </div>
              </div>

            </template>

          </th>

        </tr>

        </thead>

        <tbody class="gridtable">
        <template>
          !-- Zoom buttons for accessibility --
          <tr class="summaryrow">
            <td colspan="2" class="sticky_search">
              <label class="visuallyhidden" for="url_filter">{{ $t('report.url_filter') }}</label>
              <b-input type="text" v-model="url_filter" id="url_filter"
                       :placeholder="$t('report.url_filter')"></b-input>
              <p class="visuallyhidden">{{ $t('report.zoom.explanation') }}</p>
            </td>
            <template v-if="['web', 'mail'].includes(selected_category)">
              <td
                  v-for="category_name in relevant_categories_based_on_settings"
                  class="sticky_search px-100" :key="category_name">
                <button @click="select_category(category_name)">
                  {{ $t("report.zoom.buttons.zoom") }}
                  <span class="visuallyhidden">{{
                      $t("report.zoom.buttons.zoom_in_on", [$t("" + category_name)])
                    }}</span>
                </button>
              </td>
              <td class="sticky_search w-100"></td>
            </template>
            <template v-else>
              <td :colspan="relevant_categories_based_on_settings.length + 1"
                  class="sticky_search text-center">
                <button class="w-100"
                        @click="select_category(report_category)">
                  <span role="img" :aria-label="$t('icons.remove_filter')">❌</span>
                  {{ $t("report.zoom.buttons.remove_zoom") }}
                </button>
                <br>
                {{ $t("report.zoom.zoomed_in_on") }} {{ $t("" + selected_category) }}.
              </td>
            </template>

          </tr>
        </template>

        <tr v-if="filtered_urls.length < 1">
          <td :colspan="relevant_categories_based_on_settings.length + 2"
              class="text-center">😱 {{ $t("report.empty_report") }}
          </td>
        </tr>

        <template v-if="filtered_urls.length > 0">

          !-- <VirtualTableContent :items="filtered_urls" :reports="reports" :selected_category="selected_category" :scan_methods='scan_methods' />--

          <tr v-for="url in filtered_urls" class="result_row" :key="url.url">
            <template v-if="!url.endpoints.length">
              <td>
                -
              </td>
              <td>{{ url.url }}</td>
              <td colspan="200">
                <small>{{ $t('report.not_eligeble_for_scanning') }}</small>
              </td>
            </template>
            <template v-else>
              !-- v-b-tooltip.hover :title="url.endpoints[0].ratings_by_type.internet_nl_score.since ? `since ${humanize_date_unix_timestamp(url.endpoints[0].ratings_by_type.internet_nl_score.since)}` : ``" --
              <td class="px-78" style="white-space: nowrap">
                <a class='direct_link_to_report'
                   :href='url.endpoints[0].ratings_by_type.internet_nl_score.internet_nl_url'
                   target="_blank"
                >
                  <span>
                    <div class="logo_image"></div> {{score(url)}}%
                    <img :src='`/static_frontend/images/report_comparison_${score_comparison(url)}.png`'
                         v-if="score_comparison(url)" />
                  </span>
                  <span class="visuallyhidden"> {{ $t('report.link_to_report', {'url': url}) }}</span>
                </a>
              </td>
              <td class="px-225">{{ url.url }}</td>
              <template v-if="['web', 'mail'].includes(selected_category)">
                !-- do this only onhover, not prepared: v-b-tooltip.hover :title="make_tooltip(url, category_name)" --
                <td class="testresultcell px-100"
                    v-for="category_name in relevant_categories_based_on_settings"
                    :key="category_name"
                  >
                  <span :class="category_verdict_to_simple_value(category_name, url) + ' ' + (category_comparison(category_name, url) ? `compared_with_next_report_${category_comparison(category_name, url)}` : '')">
                    <template v-if="category_comparison(category_name, url)">
                      {{$t("report.results.comparison." + category_comparison(category_name, url))}}
                    </template>
                    {{category_verdict_to_simple_value(category_name, url)}}
                  </span>

                </td>
              </template>
              <template v-else>
                !-- v-b-tooltip.hover :title="make_tooltip(url, category_name)" --
                <td class="testresultcell px-56"
                    v-for="category_name in relevant_categories_based_on_settings"
                    :key="category_name">

                  <span :class="detail_value_simple_value(category_name, url) + ' ' + detail_comparison(category_name, url)">
                    {{detail_value_simple_value(category_name, url)}}
                    <template v-if="detail_comparison(category_name, url)">
                      {{$t("report.results.comparison." + detail_comparison(category_name, url))}}
                    </template>
                  </span>
                </td>
              </template>
              <td>

              </td>
            </template>
          </tr>

        </template>
        </tbody>
      </table>

    </div>
    -->
  </div>

</template>

<script>

import field_translations from '../FieldTranslations'
import report_mixin from "@/components/reports/report_mixin";

import ReportTableLegend from "@/components/reports/ReportTableLegend";
import DifferencesToCurrentList from "@/components/reports/DifferencesToCurrentList";
import AppliedTags from "@/components/reports/AppliedTags";
import CollapsePanel from '@/components/CollapsePanel'
import ReportTableTable from "@/components/reports/ReportTableTableBv";

export default {
  components: {ReportTableTable, AppliedTags, DifferencesToCurrentList, ReportTableLegend, CollapsePanel},
  mixins: [report_mixin],

  i18n: {
    sharedMessages: field_translations,
  },
  name: "ReportTableBv",
  props: {
    reports: {
      type: Array,
      required: true
    },
    load_comparison_with_current: {
      type: Boolean,
      default: true,
      required: false
    }
  },
  data: function () {
    return {
      // url_filter allows the filtering of names in the list of urls.
      url_filter: '',

      currentPage: 1,
      perPage: 100,


      // Support searching / filtering
      original_urls: [],
    }
  },
  watch: {
    reports: function () {
      if (this.reports[0] !== undefined) {
        this.original_urls = this.reports[0].calculation.urls;
      }
    },
  },
  mounted: function () {
    // fall back to default category

    if (this.reports[0] !== undefined) {
      this.original_urls = this.reports[0].calculation.urls;
    }
    this.test_explode_report_size()
  },
  methods: {
    createFields(category_name) {
      // to make a distinction in icons:
      let category_fields = this.categoryFields();

      let fields = this.relevant_fields(category_name)
      let field_spec = [
        {
          'key': 'endpoints[0].ratings_by_type.internet_nl_score',
          'sortable': true,
          'label': "score",
          'stickyColumn': true,
          'thStyle': 'width: 90px; min-width: 90px;',
          'field': 'score',
        },
        {
          'key': 'url',
          'sortable': true,
          'label': "url",
          'stickyColumn': true,
          'thStyle': 'width: 220px; min-width: 220px; z-index:2000',
          'field': 'url',
        },

      ]
      let self = this
      fields.forEach(field => {
        field_spec.push(
            {
              'key': `endpoints[0].ratings_by_type.${field}.test_result`,
              'sortable': true,
              label: self.$t(field),
              'thStyle': 'min-width: 130px;  background: white;',
              'field': field,
              'fieldType': category_fields.includes(field) ? 'category' : 'detail',
            }
        )
      })
      return field_spec
    },

    categoryFields() {
      let categoryFields = [];

      this.scan_methods[0].categories.forEach(scan_method => {
        categoryFields.push(scan_method.key)
      })
      this.scan_methods[1].categories.forEach(scan_method => {
        categoryFields.push(scan_method.key)
      })
      return categoryFields
    },

    test_explode_report_size() {
      let amount = 5000;
      // testing method that creates a very, very large report to see how this renders.
      // a report of 5000 urls should not be any issue at all...
      let backup = this.original_urls;

      // for testing purposes, increase the report to a 1000 records, to see
      // how it renders
      let verdicts = ['passed', 'failed', 'warning', 'info', 'not-testable', 'error']
      let stringed = JSON.stringify(backup[0]);

      let ridulously_large_report = [];
      for (let i = 0; i < amount; i++) {
        let record = JSON.parse(stringed)

        // randomize scores, and one category and one field so you can test comparisons
        record.endpoints[0].ratings_by_type.internet_nl_score.internet_nl_score = Math.floor(Math.random() * 100);
        record.endpoints[0].ratings_by_type.internet_nl_web_tls.test_result = verdicts[Math.floor(Math.random() * verdicts.length)];
        record.endpoints[0].ratings_by_type.internet_nl_web_dnssec_exist.test_result = verdicts[Math.floor(Math.random() * verdicts.length)];
        record.url = `${i}.nl`
        ridulously_large_report.push(record);
      }
      this.original_urls = ridulously_large_report;
    },

    make_tooltip(url, category_name) {
      if (!url.endpoints[0])
        return ''
      if (!url.endpoints[0].ratings_by_type[category_name])
        return ''
      if (!url.endpoints[0].ratings_by_type[category_name]['since'])
        return ''
      return `${url.endpoints[0].ratings_by_type[category_name]['test_result']}, since: ${this.humanize_date_unix_timestamp(url.endpoints[0].ratings_by_type[category_name]['since'])}`
    },


    relevant_fields: function (input_category) {
      let preferred_fields = [];  // this.categories[this.selected_category];
      this.scan_methods.forEach((scan_method) => {
        // todo: also get relevant column for scan_methods, just like with graphs. But given large refactor,
        // we'll do that later.
        if (['web', 'mail'].includes(scan_method.name) && scan_method.name === input_category) {
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
            if (category.key === input_category) {
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
      let visible_preferred_fields = preferred_fields.filter(field => this.$store.state.visible_metrics[field].visible)
      // console.log("Visible preferred fields: " + visible_preferred_fields)
      return visible_preferred_fields
    }


  },
  computed: {
    report_category() {
      if (this.reports[0] !== undefined)
        return this.reports[0].report_type;
      return ""
    },
    relevant_categories_based_on_settings: function () {
      return this.relevant_fields(this.report_category)
    },
  }
}
</script>


<i18n>
{
  "en": {
    "score": "Score",
    "domain": "Domain",
    "report": {
      "title": "Metrics table",
      "intro": "This table shows detailed results per category. It is possible to compare this report to a second report. In that case, progress indicators are added to the first report where applicable. The domains of the second report are only compared, not displayed.",
      "url_filter": "Filter on domain...",
      "not_eligeble_for_scanning": "Domain did not match scanning criteria at the time the scan was initiated. The scanning criteria are an SOA DNS record (not NXERROR) for mail and an A or AAAA DNS record for web. This domain is ignored in all statistics.",
      "link_to_report": "View score and report from %{url} on internet.nl.",
      "empty_report": "It looks like this report is empty... did you filter too much?",
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
      }
    },
    "icons": {
      "remove_filter": "Remove filter"
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
    "score": "Score",
    "domain": "Domein",
    "report": {
      "title": "Meetwaardentabel",
      "intro": "Deze tabel toont de details van het rapport. Het is mogelijk dit rapport te vergelijken met een vorig of ander rapport. Wanneer deze vergelijking wordt gemaakt, wordt bij de gegevens van het eerste rapport voortgangsindicatoren geplaats waar relevant. De domeinen van het tweede rapport worden alleen vergeleken, niet getoond.",
      "not_eligeble_for_scanning": "Dit domein voldeed niet aan de scan-criteria op het moment van scannen. Deze criteria zijn een SOA DNS record (geen NXERROR) voor mail en een A of AAAA DNS record voor web. Dit domein komt niet terug in de statistieken.",
      "url_filter": "Filter op domein...",
      "link_to_report": "Bekijk de score en rapportage van %{url} op internet.nl.",
      "empty_report": "Geen meetgegevens gevonden, wordt er misschien teveel gefilterd?",
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
    "icons": {
      "remove_filter": "Wis filter"
    },
    "icon_legend": {
      "title": "Legenda van gebruikte pictogrammen",
      "category_error_in_test": "Fout in test ⇒ nulscore",
      "subtest_not_tested": "Niet getest ⇒ geen score impact",
      "subtest_error_in_test": "Fout in test ⇒ nulscore"
    }
  }
}
</i18n>