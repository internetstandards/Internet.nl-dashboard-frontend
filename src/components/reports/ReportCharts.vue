<style>
.testresult h3 {
  margin-top: 0;
}
</style>
<template>

  <div>
    <a class="anchor" name="charts"></a>
    <content-block>
      <timeline :urllist_ids="report_urllist_ids" :highlight_report_ids="$store.state.report_ids"></timeline>
    </content-block>

    <content-block v-if="!can_show_charts()">
      <h2>⚠️ {{ $t("selected_report_is_from_before_api_2.title") }}</h2>
      <p>{{ $t("selected_report_is_from_before_api_2.intro") }}</p>
    </content-block>

    <div v-else>
      <content-block style="page-break-before: always;" v-if='reports.length > 0'>
        <h2>
          {{ $t("chart_info.adoption_bar_chart.annotation.title") }}
        </h2>
        <p>{{ $t("chart_info.adoption_bar_chart.annotation.intro") }}</p>

        <!-- <b-alert show dismissible><b-icon icon="info-circle" /> {{ $t("how_charts_work") }}</b-alert> -->

        <!-- :key is used because that key changes when changing the language, causing the graph to rerender and thus translate.
        this cannot be done inside the graph, even with rerender title unfortunately. Perhaps it can, but cant figure it out. -->
        <div v-for="scan_form in scan_methods" :key="$i18n.t(scan_form.name)">
          <template v-if="scan_form.name === reports[0].report_type">

            <div style="overflow: auto; width: 100%"
                 v-if="visible_fields_from_scan_form(scan_form).length > 0">
              <div class="chart-container" style="position: relative; height:500px; width:100%; min-width: 950px;">
                <percentage-bar-chart
                    :title="graph_bar_chart_title"
                    :translation_key="'charts.adoption_bar_chart'"
                    :chart_data="reports"
                    :accessibility_text="$t('charts.adoption_bar_chart.accessibility_text')"
                    :show_dynamic_average="issue_filters[scan_form.name].show_dynamic_average"
                    :axis="visible_fields_from_scan_form(scan_form)">
                </percentage-bar-chart>
              </div>
            </div>

            <div v-for="category in scan_form.categories" :key="category.key">
              <template v-if="category_is_visible(category.key)">
                <div style="page-break-inside: avoid;"
                     v-if="visible_fields_from_categories(category).length > 0">

                  <chart-collapse-panel :title="category.label" :level="'level_two'">
                    <div slot="chart_content">
                      <div class="chart-container" style="height:500px;">
                      <percentage-bar-chart
                          :title="graph_bar_chart_title"
                          :translation_key="'charts.adoption_bar_chart'"
                          :chart_data="reports"
                          :accessibility_text="$t('charts.adoption_bar_chart.accessibility_text')"
                          :show_dynamic_average="issue_filters[category.key].show_dynamic_average"
                          :field_name_to_category_names="field_name_to_category_names"
                          :axis="visible_fields_from_categories(category)">
                      </percentage-bar-chart>
                      </div>
                    </div>
                  </chart-collapse-panel>
                </div>

                <div v-for="subcategory in category.categories" :key="subcategory.key">
                  <!-- Visibility depends on parent category, the labels themselves cannot yet be filtered for visibility. -->
                  <div style="page-break-inside: avoid;"
                       v-if="fields_from_self(subcategory).length > 0">

                    <chart-collapse-panel :title="subcategory.label" :level="'level_three'">
                      <div slot="chart_content">
                        <div class="chart-container" style="height:500px;">
                        <percentage-bar-chart
                            :title="graph_bar_chart_title"
                            :translation_key="'charts.adoption_bar_chart'"
                            :chart_data="reports"
                            :accessibility_text="$t('charts.adoption_bar_chart.accessibility_text')"
                            :show_dynamic_average="issue_filters[category.key].show_dynamic_average"
                            :field_name_to_category_names="field_name_to_category_names"
                            :axis="fields_from_self(subcategory)">
                        </percentage-bar-chart>
                        </div>
                      </div>
                    </chart-collapse-panel>

                    <!-- Special graph for Forum standardisation, that cannot have the items disabled -->
                    <template
                        v-if="['category_mail_forum_standardisation_magazine', 'category_web_forum_standardisation_magazine'].includes(subcategory.key)">
                      <chart-collapse-panel :title="subcategory.label" :level="'level_three'">
                        <div slot="chart_content">
                          <div class="chart-container" style="height:500px;">
                          <percentage-bar-chart
                              style="height: 500px;"
                              :title="graph_bar_chart_title"
                              :translation_key="'charts.adoption_bar_chart'"
                              :chart_data="reports"
                              :accessibility_text="$t('charts.adoption_bar_chart.accessibility_text')"
                              :show_dynamic_average="true"
                              :only_show_dynamic_average="true"
                              :field_name_to_category_names="field_name_to_category_names"
                              :axis="fields_from_self_and_do_not_filter(subcategory)">
                          </percentage-bar-chart>
                            </div>
                        </div>
                      </chart-collapse-panel>
                    </template>

                  </div>
                </div>
              </template>
            </div>
          </template>
        </div>
      </content-block>

      <content-block style="page-break-before: always;" aria-hidden="true"
                     v-if='reports.length > 1'>

        <h2>
          {{ $t("chart_info.cumulative_adoption_bar_chart.annotation.title") }}
        </h2>
        <p>{{ $t("chart_info.cumulative_adoption_bar_chart.annotation.intro") }}</p>

        <div v-for="scan_form in scan_methods" :key="scan_form.name">
          <template v-if="scan_form.name === reports[0].report_type">

            <div style="overflow: auto; width: 100%" v-if="visible_fields_from_scan_form(scan_form).length > 0">
              <div class="chart-container" style="height:500px;">
                <cumulative-percentage-bar-chart
                    style="height: 500px"
                    :title="graph_cumulative_bar_chart_title"
                    :translation_key="'charts.adoption_bar_chart'"
                    :chart_data="reports"
                    :accessibility_text="$t('charts.cumulative_adoption_bar_chart.accessibility_text')"
                    :show_dynamic_average="issue_filters[scan_form.name].show_dynamic_average"
                    :axis="visible_fields_from_scan_form(scan_form)">
                </cumulative-percentage-bar-chart>
              </div>
            </div>

            <div v-for="category in scan_form.categories" :key="category.key">
              <template v-if="category_is_visible(category.key)">
                <div style="page-break-inside: avoid;"
                     v-if="visible_fields_from_categories(category).length > 0">


                  <chart-collapse-panel :title="category.label" :level="'level_two'">
                    <div slot="chart_content">
                      <div class="chart-container" style="height:500px;">
                      <cumulative-percentage-bar-chart
                          :title="graph_cumulative_bar_chart_title"
                          :translation_key="'charts.adoption_bar_chart'"
                          :chart_data="reports"
                          :accessibility_text="$t('charts.cumulative_adoption_bar_chart.accessibility_text')"
                          :show_dynamic_average="issue_filters[category.key].show_dynamic_average"
                          :field_name_to_category_names="field_name_to_category_names"
                          :axis="visible_fields_from_categories(category)">
                      </cumulative-percentage-bar-chart>
                      </div>
                    </div>
                  </chart-collapse-panel>

                </div>

                <div v-for="subcategory in category.categories" :key="subcategory.label">
                  <!-- Visibility depends on parent category, the labels themselves cannot yet be filtered for visibility. -->
                  <div style="page-break-inside: avoid;"
                       v-if="fields_from_self(subcategory).length > 0">


                    <chart-collapse-panel :title="subcategory.label" :level="'level_three'">
                      <div slot="chart_content">
                        <div class="chart-container" style="height:500px;">
                        <cumulative-percentage-bar-chart
                            style="height: 500px"
                            :title="graph_cumulative_bar_chart_title"
                            :translation_key="'charts.adoption_bar_chart'"
                            :chart_data="reports"
                            :accessibility_text="$t('charts.adoption_bar_chart.accessibility_text')"
                            :show_dynamic_average="issue_filters[subcategory.key].show_dynamic_average"
                            :field_name_to_category_names="field_name_to_category_names"
                            :axis="fields_from_self(subcategory)">
                        </cumulative-percentage-bar-chart>
                        </div>
                      </div>
                    </chart-collapse-panel>


                    <!-- Special graph for Forum standardisation, that cannot have the items disabled -->
                    <template
                        v-if="['category_mail_forum_standardisation_magazine', 'category_web_forum_standardisation_magazine'].includes(subcategory.key)">
                      <chart-collapse-panel :title="'This shows the average for Forum Standardisation, it is not possible\n'+
'                                                to\n'+
'                                                show the average or to select what fields should be visible.'"
                                            :level="'level_three'">
                        <div slot="chart_content">
                          <div class="chart-container" style="height:500px;">
                          <cumulative-percentage-bar-chart
                              :title="graph_cumulative_bar_chart_title"
                              :translation_key="'charts.adoption_bar_chart'"
                              :chart_data="reports"
                              :accessibility_text="$t('charts.adoption_bar_chart.accessibility_text')"
                              :show_dynamic_average="true"
                              :only_show_dynamic_average="true"
                              :field_name_to_category_names="field_name_to_category_names"
                              :axis="fields_from_self_and_do_not_filter(subcategory)">
                          </cumulative-percentage-bar-chart>
                            </div>
                        </div>
                      </chart-collapse-panel>
                    </template>
                  </div>
                </div>
              </template>
            </div>
          </template>
        </div>
      </content-block>
    </div>
  </div>
</template>

<script>
import field_translations from './../field_translations'

import CumulativePercentageBarChart from './../charts/render-cumulative-percentage-bar-chart'
import PercentageBarChart from './../charts/render-percentage-bar-chart'
import ChartCollapsePanel from './../chart_collapse_panel'
import report_mixin from "@/components/reports/report_mixin";
import Timeline from "@/components/charts/timeline";

export default {
  mixins: [report_mixin],
  components: {
    Timeline,
    CumulativePercentageBarChart,
    PercentageBarChart,
    ChartCollapsePanel,
  },
  i18n: {
    sharedMessages: field_translations,
  },
  mounted: function () {

    this.issue_filters = this.$store.state.visible_metrics;

  },
  props: {
    reports: {type: Array, required: true},
  },
  data: function () {
    return {


      issue_filters: {},
    }
  },
  methods: {

    can_show_charts: function () {
      // At June 30 2020 api 2.0 reports where introduced. Before that, calculations where done differently,
      // where info and warning would be seen as passed. This has been changed, and since then there is more
      // granularity. Because of differences in data: fields, statistics and how the data is used, a decision
      // was made to delete all prior reports. Since that also affects scores over time, and since the data
      // per metric in the metric table is still useful, the graphs have been set to hide.
      // Of course it is still possible to download the graph data, or even show it in the interface if you
      // know your way around javascript. But the result will be off the charts, literally :) -> thus hiding
      // is the friendliest choice..

      const api_2_introduced = Date.parse("2020-06-30 00:00:00.000000+00:00")

      let showable = true;
      this.reports.forEach((item) => {
        // "2020-05-14 10:55:16.129108+00:00"
        if (Date.parse(item.at_when) < api_2_introduced)
          showable = false
      });

      return showable;
    },

    visible_fields_from_scan_form: function (scan_form) {
      // see if any of the underlaying categories is visible. If so, include the category.
      let fields = [];

      scan_form.categories.forEach((category) => {
        // console.log(category.key);
        if (this.category_is_visible(category.key)) {
          category.fields.forEach((field) => {
            fields.push(field.name);
          });
        }
      });
      return fields;
    },
    fields_from_self: function (category) {
      let fields = [];

      category.fields.forEach((field) => {
        fields.push(field.name);
      });

      let returned_fields = [];

      for (let i = 0; i < fields.length; i++) {
        if (this.issue_filters[fields[i]].visible)
          returned_fields.push(fields[i])
      }
      return returned_fields;
    },
    category_is_visible: function (category_key) {

      // See #6. If any of the subcategory fields
      return this.visible_fields_from_categories(this.get_category_by_name(category_key)).length > 0;
    },
    // should be named: visible fields from categories
    visible_fields_from_categories(categories) {
      let fields = [];

      categories.categories.forEach((category) => {

        category.fields.forEach((field) => {
          fields.push(field.name);
        });

      });

      let returned_fields = [];
      for (let i = 0; i < fields.length; i++) {
        if (this.issue_filters[fields[i]].visible)
          returned_fields.push(fields[i])
      }

      return returned_fields;
    },
    fields_from_self_and_do_not_filter(category) {
      let fields = [];

      category.fields.forEach((field) => {
        fields.push(field.name);
      });
      return fields;
    },
    get_category_by_name: function (category_key) {
      let found = null;
      this.scan_methods.forEach((scan_method) => {
        scan_method.categories.forEach((category) => {
          if (category.key === category_key) {
            found = category;
          }
        });

      });
      if (!found) {
        throw `Category ${category_key} does not exist.`;
      } else {
        return found;
      }
    },
  },
  computed: {
    report_urllist_ids(){
      let ids = [];
      this.reports.forEach((report) => {ids.push(report.urllist_id)})
      return ids;
    },

    report_titles() {
      let titles = [];
      this.reports.forEach((report) => {
        titles.push(`📊 #${report.id}: ${report.list_name} ${this.humanize_date_date_only(report.at_when)} n=${report.total_urls}`);
      });
      return titles;
    },

    graph_bar_chart_title: function () {
      if (this.reports.length === 1)
        return this.report_titles[0]

      return this.report_titles.join(" vs ");

    },

    graph_cumulative_bar_chart_title: function () {
      if (this.reports.length === 1)
        return this.report_titles[0]

      return `(${this.report_titles.join(" + ")}) / ${this.reports.length}`
    },
  }
}
</script>
<i18n>
{
  "en": {
    "how_charts_work": "By clicking on legend labels, it's possible to toggle certain categories. The 'failed' category is disabled by default and can be enabled by clicking on it.",
    "charts": {
      "adoption_bar_chart": {
        "title_single": "Average adoption of standards, %{list_information}, %{number_of_domains} domains.",
        "title_multiple": "Comparison of adoption of standards between %{number_of_reports} reports.",
        "yAxis_label": "Adoption",
        "average": "Average",
        "accessibility_text": "A table with the content of this graph is shown below."
      },
      "cumulative_adoption_bar_chart": {
        "title": "Average adoption of standards over %{number_of_reports} reports.",
        "yAxis_label": "Adoption",
        "average": "Average",
        "accessibility_text": "A table with the content of this graph is shown below."
      }
    },
    "selected_report_is_from_before_api_2": {
      "title": "Unable to show all statistics",
      "intro": "One of the selected reports are from before 30th of June 2020. Before that date, reports contained different calculations which are not consistent with the current version of the dashboard."
    },
    "chart_info": {
      "magazine": {
        "intro": "Below graph only shows the average of all magazine fields. Other fields cannot be enabled/disabled and changing their visibility does not influence this average."
      },
      "adoption_bar_chart": {
        "annotation": {
          "title": "Average adoption of standards ",
          "intro": "This graph shows the average adoption per standard per report."
        }
      },
      "cumulative_adoption_bar_chart": {
        "annotation": {
          "title": "Average adoption of standards over multiple reports",
          "intro": "This graph shows the average adoption per standard averaged over multiple reports."
        }
      }
    }
  },
  "nl": {
    "how_charts_work": "Door te klikken op de leganda in deze grafieken, kunnen beoordelingen worden getoond en verborgen. De 'gezakt' categorie wordt standaard altijd verborgen.",
    "charts": {
      "adoption_bar_chart": {
        "title_single": "Adoptie van standaarden, %{list_information}, %{number_of_domains} domeinen.",
        "title_multiple": "Vergelijking adoptie van standaarden tussen %{number_of_reports} rapporten.",
        "yAxis_label": "Adoptiegraad",
        "average": "Gemiddeld",
        "accessibility_text": "Een tabel met de inhoud van deze grafiek wordt hieronder getoond."
      },
      "cumulative_adoption_bar_chart": {
        "title": "Gemiddelde adoptie van standaarden van %{number_of_reports} rapporten.",
        "yAxis_label": "Adoptiegraad",
        "average": "Gemiddeld",
        "accessibility_text": "Een tabel met de inhoud van deze grafiek wordt hieronder getoond."
      }
    },
    "selected_report_is_from_before_api_2": {
      "title": "Niet mogelijk om alle statistieken te tonen",
      "intro": "Een van de geselecteerde rapporten is van voor 30 juni 2020. Rapporten van voor deze datum gebruiken een andere rekenmethode, waardoor ze niet consistent zijn met de huidige versie van het dashboard."
    },
    "chart_info": {
      "magazine": {
        "intro": "Onderstaande grafiek toont het gemiddelde van alle magazine velden. Deze grafiek kan niet worden aangepast, ook niet door de zichtbaarheid van velden aan te passen."
      },
      "adoption_bar_chart": {
        "annotation": {
          "title": "Adoptie van standaarden",
          "intro": "Deze grafiek toont het percentage adoptie per categorie en onderliggende metingen."
        }
      },
      "cumulative_adoption_bar_chart": {
        "annotation": {
          "title": "Gemiddelde adoptie, waarbij rapporten bij elkaar worden opgeteld",
          "intro": "In deze grafiek worden de geselecteerde rapporten bij elkaar opgeteld, en daar het gemiddelde van getoond."
        }
      }
    }
  }
}
</i18n>
