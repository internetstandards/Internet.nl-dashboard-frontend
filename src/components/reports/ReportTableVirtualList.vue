<!-- SPDX-License-Identifier: Apache-2.0 -->
<style>
#report-template {
  width: 100%;
  min-height: 500px;
}

/* Do print the whole table... */
@media print {
  #report-template {
    min-height: 100% !important;
  }

  /* When printing, the table should fill several pages */
  #report-template .sticky-table-container {
    max-height: none !important;
    overflow-x: inherit;
    overflow-y: inherit;
  }

  /* Allow printing of graphs, make sure they don't go wider than the page width... */
  /* https://stackoverflow.com/questions/41674976/resize-chart-js-canvas-for-printing */
  /* We'll resize the image to fit plain a4 paper, otherwise the aspect ratios are distorted.*/
  canvas.graph-image {
    height: 60% !important;
    width: 60% !important;
  }

  /* Also remove the superfluous container sizes during print, as the image is a bit smaller now: */
  .chart-container {
    height: 100% !important;
    min-height: 100% !important;
  }
}

/* Use fixed headers, and search. If you scroll down the headers stay visible. Looks good, even better than aggrid.
Note that chrome has issues making thead and tr sticky. Therefore it is applied to td and th (because...). */
#report-template .sticky-table-container {

}

/* Make the header stay up with a white background. */
#report-template thead {
  position: sticky;
  top: 0;
  background-color: white;
}

#horrible-chrome-td-sticky-white-background-fix {
  /* Chrome white sticky headers overlap, causing text to disappear, firefox does render it correctly.
  This fix creates a white background behind the text labels. */
  width: 100%;
  height: 210px;
  position: absolute;
  top: 0px;
  background: white;
}


#report-template th {
  /* Firefox does not need this set to white, chrome does, otherwise the background will bleed through... */
  /* background-color: white; */
}

#report-template th:after {
  /* Chrome uses translucent background, */
  background-color: white;
}

#report-template th.sticky-header {
  position: sticky;
}

/* only safari: https://solvit.io/bcf61b6, https://www.codegrepper.com/code-examples/css/Safari+only+CSS+hack */
@media not all and (min-resolution: .001dpcm) {
  @supports (-webkit-appearance:none) {
    /*
      In safari the search bar shows too low.
     */
    #report-template td.sticky_search {
      top: -1px !important;
    }

  }
}

/* Chrome 29+  https://stackoverflow.com/questions/9328832/how-to-apply-specific-css-rules-to-chrome-only */
@media screen and (-webkit-min-device-pixel-ratio: 0) and (min-resolution: .001dpcm) {
  #report-template th.sticky-header {
    /**
    * Using top attaches the header to the scrollbar in safari. So it moves with the scrollbar which is weird.
    * Removing the top declaration fixes it, but chrome needs it. Sticky headers are still very much IE6 development
    */
    /* top: -1px; */
    top: -1px !important;
  }
}

#report-template td.sticky_search {
  position: sticky;
  top: 206px;


  /* 100% background is needed to not mix content: this content is on top. */
  background-color: white;
}

#report-template tr.result_row {
  /* For testing purposes. */
  /* height: 200px; */
}


/* https://css-tricks.com/rotated-table-column-headers/*/
/* It's not possible to dynamically resize the height of the TH or th container :( */
div.rotate {
  white-space: nowrap;
  vertical-align: bottom;
  margin-top: 160px;
}

div.rotate {
  transform: rotate(315deg);
  width: 32px; /*Fits the 100% value too.*/
}

div.rotate > span {
  padding: 5px 3px;
  z-index: 1000;
}

/* Why emulate bootstrap? */
.table {
  width: 100%;
  max-width: 100%;
  margin-bottom: 1rem;
  background-color: white;
}

.table-striped tbody tr:nth-of-type(2n+1) {
  background-color: rgba(0, 0, 0, .05);
}

.table td, .table th {
  padding: .75rem;
  vertical-align: top;
  border-top: 1px solid #dee2e6;
}

.direct_link_to_report {
  font-size: 0.8em;
}

.table .summaryrow {
  font-size: 0.8em;
}


#report-template .testresultcell span {
  background-size: 1.125em 1.125em;
  background-repeat: no-repeat;
  /**
  The reason we're not using padding-left 1.5em is that we want the results to be copy-pasteable.
  So there is invisible text on the icon that can be copied.
  */
  width: 32px; /* Needs to be 32 px for comparison to be visible.*/
  height: 20px;
  display: block;
  color: transparent;

  /** While hidden, can a screen reader still find it? */
  overflow: hidden;
}

#report-template .testresultcell span span {
  font-size: 1px;
}

.testresultcell {
  border-left: 1px solid #dee2e6;
}

/**
 Sortable Tables
 https://vuejs.org/v2/examples/grid-component.html
*/

.arrow {
  transform: rotate(-315deg);
  display: inline-block;
  vertical-align: middle;
  width: 0;
  height: 0;
  margin-left: 5px;
  opacity: 0.66;
  padding: 0px 0px !important;
}

.arrow.asc {
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid #00a0c6;
}

.arrow.dsc {
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 10px solid #00a0c6;
}

.arrow.unknown {
  border-left: 10px solid #00a0c6;
  border-right: 10px solid #00a0c6;
  border-top: 4px solid #00a0c6;
}

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

.compared_with_next_report_neutral:before {
  content: '';
  /* No image is the cleanest background-image: url("/static/images/report_comparison_neutral.png"), none; */
  width: 32px;
  height: 100%;
  background-repeat: no-repeat;
  background-position: right top;
  display: block;
}

.compared_with_next_report_improved:before {
  content: '';
  background-image: url("/static_frontend/images/report_comparison_improved.png");
  width: 32px;
  height: 100%;
  background-repeat: no-repeat;
  background-position: right top;
  display: block;
}

.compared_with_next_report_regressed:before {
  content: '';
  background-image: url("/static_frontend/images/report_comparison_regressed.png");
  width: 32px;
  height: 100%;
  background-repeat: no-repeat;
  background-position: right top;
  display: block;
}

.header_top_category {
  border: 0; float: left; width: 100px; height: 180px;
}

.header_sub_category {
  border: 0; float: left; width: 56px; height: 180px;
}

.close_to_top {
  margin-top: -3px;
}

.px-100 {
  width: 100px; min-width: 100px;
}

.px-78 {
  width: 78px; min-width: 78px;
}

.px-225 {
  width: 225px; min-width: 225px;
}

.px-56 {
  width: 56px; min-width: 56px;
}

.vl-wrap {
  margin-top: 300px;
}

</style>

<template>
  <div>
    <h2>{{ $t("report.title") }}</h2>
    <a class="anchor" name="report"></a>

    <applied-tags/>
    <p v-if="load_comparison_with_current">{{ $t("report.intro") }}</p>

    <differences-to-current-list :report_id="reports[0].id" v-if="load_comparison_with_current" />

    <collapse-panel :title='$t("icon_legend.title")' class="do-not-print">
      <div slot="content">
        <report-table-legend />
      </div>
    </collapse-panel>

    <div class="start-on-new-page position-relative">
      <div id=""></div>


        <div v-if="filtered_urls.length > 0" class="virtualList">
          <virtual-list style="height: 70vh; overflow-y: auto; width: 100%"
            :data-key="'url'"
            :data-sources="filtered_urls"
            :data-component="itemComponent"
            :keeps="50"
            wrap-class="vl-wrap"
            header-class="vl-head"
            footer-class="vl-foot"
            item-class="vl-item"

            :extra-props="{
              reports: this.reports,
              selected_category: this.selected_category,
            }"
          >
            <div slot="header">


              <table class="table table-striped" style="position: absolute">
        <thead class="sticky_labels">

        <tr class="sticky_labels">
          <th class="sticky-header bg-white col-1" style="width: 100px; min-width: 100px;">
            <div class="rotate">
              <span @click="sortBy('score')" class="arrow"
                    :class="sortOrders['score'] === -1 ? 'dsc' : (sortOrders['score'] === 1 ? 'asc' : 'unknown')"></span>
              <span @click="sortBy('score')">{{ $t("score") }}</span>
            </div>
          </th>
          <th class="sticky-header bg-white" style="width: 200px; min-width: 200px;">
            <div class="rotate">
              <div @click="sortBy('url')" class="arrow"
                   :class="sortOrders['url'] === -1 ? 'dsc' : (sortOrders['url'] === 1 ? 'asc' : 'unknown')"></div>
              <div @click="sortBy('url')" class="d-inline-block">{{ $t("domain") }}</div>
            </div>
          </th>

          <th colspan="200" class="sticky-header bg-white" :style="`min-width: ${relevant_categories_based_on_settings.length *58}px`">
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
          <!-- Zoom buttons for accessibility -->
          <tr class="summaryrow">
            <td colspan="2" class="sticky_search">
              <label class="visuallyhidden" for="url_filter">{{ $t('report.url_filter') }}</label>
              <b-input debounce="200" type="text" v-model="url_filter" id="url_filter"
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
                <br>&nbsp;
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
        </tbody>
        </table>

            </div>
          </virtual-list>
        </div>

    </div>
  </div>
</template>

<script>

import field_translations from '../FieldTranslations'
import report_mixin from "@/components/reports/report_mixin";

import ReportTableLegend from "@/components/reports/ReportTableLegend";
import DifferencesToCurrentList from "@/components/reports/DifferencesToCurrentList";
import AppliedTags from "@/components/reports/AppliedTags";
import CollapsePanel from '@/components/CollapsePanel';
import VirtualList from 'vue-virtual-scroll-list';
import ReportTableVirtualListRecord from "@/components/reports/ReportTableVirtualListRecord";

export default {
  components: {AppliedTags, DifferencesToCurrentList, ReportTableLegend, CollapsePanel, VirtualList},
  mixins: [report_mixin],

  i18n: {
    sharedMessages: field_translations,
  },
  name: "ReportTableVirtualList",
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
      // todo: this could/should be computed.
      itemComponent: ReportTableVirtualListRecord,

      categories: {
        // fallback category
        '': [],
        'web': [],
        'internet_nl_web_ipv6': [],
        'internet_nl_web_dnssec': [],
        'internet_nl_web_tls': [],
        'internet_nl_web_appsecpriv': [],
        'internet_nl_web_rpki': [],
        'internet_nl_web_legacy_category': [],
        'mail': [],
        'internet_nl_mail_dashboard_ipv6': [],
        'internet_nl_mail_dashboard_dnssec': [],
        'internet_nl_mail_dashboard_auth': [],
        'internet_nl_mail_dashboard_tls': [],
        'internet_nl_mail_dashboard_rpki': [],
        'internet_nl_mail_legacy_category': [],
      },

      // simple sorting a la bootstrapvue.
      sortKey: 'url',
      sortOrders: {'url': 1},

      // url_filter allows the filtering of names in the list of urls.
      url_filter: '',

      // category selection with report category as fallback.
      selected_category: '',

      // Support searching / filtering
      original_urls: [],
      filtered_urls: [],
    }
  },
  watch: {
    reports: function () {
      if (this.reports[0] !== undefined) {
        this.original_urls = this.reports[0].calculation.urls.sort(this.alphabet_sorting);
      }
    },
    original_urls: function (new_value) {
      console.log('Setting original urls')
      this.filtered_urls = new_value;
      // Apply existing sorting
      this.filter_urls();
    },
    url_filter: function (newValue) {
      this.filter_urls(newValue);
    },
  },
  mounted: function () {
    // fall back to default category
    this.select_category();

    if (this.reports[0] !== undefined) {
      this.original_urls = this.reports[0].calculation.urls.sort(this.alphabet_sorting);
    }
    // this.test_explode_report_size()
  },
  methods: {
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
          return`${url.endpoints[0].ratings_by_type[category_name]['test_result']}, since: ${this.humanize_date_unix_timestamp(url.endpoints[0].ratings_by_type[category_name]['since'])}`
    },
    select_category: function (category_name) {
      if (Object.keys(this.categories).includes(category_name))
        this.selected_category = category_name;
      else
        this.selected_category = this.report_category;
    },
    filter_urls(keyword) {
      // in case of filter reset, or initializiation of this value.
      if (keyword === "" || keyword === undefined) {
        // console.log("Removing filter");
        this.filtered_urls = this.order_urls(this.original_urls)
        return
      }

      let urls = [];
      // keep the search order, use a correctly ordered set of original urls:
      let tmp_urls = this.order_urls(this.original_urls);
      tmp_urls.forEach(function (value) {
        if (value.url.includes(keyword))
          urls.push(value)
      });
      this.filtered_urls = this.order_urls(urls);
    },
    order_urls: function (data) {
      // todo: add sorting icons :)
      let sortKey = this.sortKey;
      if (!sortKey) {
        return data;
      }

      let order = this.sortOrders[sortKey] || 1;

      // The ordering keys are in different places in the data. See websecmap for the structure of the data.
      // So filter based on this structure.
      if (sortKey === "url") {
        data = data.slice().sort(function (a, b) {
          // for everything that is not the url name itself, is neatly tucked away.
          a = a[sortKey];
          b = b[sortKey];

          return (a === b ? 0 : a > b ? 1 : -1) * order
        });

        return data;
      }
      if (sortKey === "score") {
        data = data.slice().sort(function (a, b) {

          // deal with urls without endpoints:
          if (a.endpoints.length === 0) {
            return -1 * order;
          }

          if (b.endpoints.length === 0) {
            return 1 * order;
          }

          a = a.endpoints[0].ratings_by_type["internet_nl_score"].internet_nl_score;
          b = b.endpoints[0].ratings_by_type["internet_nl_score"].internet_nl_score;
          return (a === b ? 0 : a > b ? 1 : -1) * order;
        });

        return data;
      }
      data = data.slice().sort(function (a, b) {
        // for everything that is not the url name itself, is neatly tucked away. Only filter on high? Or on what kind of structure?

        // deal with urls without endpoints:
        if (a.endpoints.length === 0) {
          return -1 * order;
        }

        if (b.endpoints.length === 0) {
          return 1 * order;
        }

        let aref = a.endpoints[0].ratings_by_type[sortKey];
        let bref = b.endpoints[0].ratings_by_type[sortKey];

        // When switching reports (mail, web) some sort keys might not exist. In that case return 0 to not
        // influence sorting:
        if (aref === undefined)
          return 0;

        a = aref.simple_progression;
        b = bref.simple_progression;
        return (a === b ? 0 : a > b ? 1 : -1) * order
      });

      return data;
    },

    sortBy: function (key) {
      // console.log(`Sorting by ${key}.`);
      this.sortKey = key;

      // dynamically populate the orders
      if (!(key in this.sortOrders)) {
        // console.log('autopopulating sortOrder');
        this.sortOrders[key] = 1;
      }

      this.sortOrders[key] = this.sortOrders[key] * -1;
      this.filtered_urls = this.order_urls(this.filtered_urls);
    },

    category_from_field_name: function (field_name) {
      return this.field_name_to_category_names[field_name];
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
      let visible_preferred_fields = preferred_fields.filter(field => this.$store.state.visible_metrics[field].visible)
      // console.log("Visible preferred fields: " + visible_preferred_fields)
      return visible_preferred_fields
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

      "zoom": {
        "buttons": {
          "zoom": "details",
          "remove_zoom": "Back to the category view",
          "zoom_in_on": "View details of {0}"
        },
        "zoomed_in_on": "Details from",
        "explanation": "Using the details buttons, it is possible to see the individual metrics for each category."
      },

      "empty_report": "It looks like this report is empty... did you filter too much?"

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

      "url_filter": "Filter op domein...",
      "zoom": {
        "buttons": {
          "zoom": "details",
          "remove_zoom": "Terug naar hoofdniveau",
          "zoom_in_on": "Bekijk de details van {0}"
        },
        "zoomed_in_on": "Details van ",
        "explanation": "Met de detail buttons is het mogelijk om details van ieder categorie naar voren te halen."
      },

      "empty_report": "Geen meetgegevens gevonden, wordt er misschien teveel gefilterd?"


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