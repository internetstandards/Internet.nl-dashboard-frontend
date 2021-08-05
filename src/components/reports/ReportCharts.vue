<template>
  <div>
    <a class="anchor" name="charts"></a>
    <content-block>
      <timeline :urllist_ids="report_urllist_ids" :highlight_report_ids="$store.state.report_ids"></timeline>
    </content-block>

    <content-block style="page-break-before: always;" v-if='reports.length > 0'>
      <h2>{{ $t("adoption_bar_chart.title") }}</h2>
      <p>{{ $t("adoption_bar_chart.intro") }}</p>

      <template v-for="chart in charts_to_render">
        <div v-if="chart.level === 1" :key="chart.axis.join('.')">
          <div class="chart-container" style="position: relative; height:500px; width:100%; min-width: 950px;">
            <percentage-bar-chart :chart_data="reports" :show_average="chart.average" :axis="chart.axis"/>
          </div>
        </div>
        <div v-else style="page-break-inside: avoid;" :key="chart.axis.join('.')">
          <chart-collapse-panel :title="chart.label" :level="chart.level">
            <percentage-bar-chart slot="chart_content" :chart_data="reports" :show_average="chart.average"
                                  :only_show_dynamic_average="chart.only_average" :axis="chart.axis"/>
          </chart-collapse-panel>
        </div>
      </template>
    </content-block>

    <content-block style="page-break-before: always;" v-if='reports.length > 1'>
      <h2>{{ $t("cumulative_adoption_bar_chart.title") }}</h2>
      <p>{{ $t("cumulative_adoption_bar_chart.intro") }}</p>

      <template v-for="chart in charts_to_render">
        <div v-if="chart.level === 1" :key="chart.axis.join('-')">
          <div class="chart-container" style="position: relative; height:500px; width:100%; min-width: 950px;">
            <cumulative-percentage-bar-chart :chart_data="reports" :show_average="chart.average" :axis="chart.axis"/>
          </div>
        </div>
        <div v-else style="page-break-inside: avoid;" :key="chart.axis.join('.')">
          <chart-collapse-panel :title="chart.label" :level="chart.level">
            <cumulative-percentage-bar-chart slot="chart_content" :chart_data="reports" :show_average="chart.average"
                                             :only_show_dynamic_average="chart.only_average" :axis="chart.axis"/>
          </chart-collapse-panel>
        </div>
      </template>

    </content-block>
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
    show_average(key) {
      if (this.issue_filters[key] === undefined)
        return false

      return this.issue_filters[key].show_dynamic_average
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
      return this.visible_fields(this.fields_from_self_and_do_not_filter(category))
    },
    visible_fields(fields) {
      let returned_fields = [];
      for (let i = 0; i < fields.length; i++) {
          if (this.issue_filters[fields[i]] !== undefined && this.issue_filters[fields[i]].visible)
            returned_fields.push(fields[i])
      }
      return returned_fields;
    },
    category_is_visible: function (category_key) {
      // See #6. If any of the subcategory fields
      return this.visible_fields_from_categories(this.get_category_by_name(category_key)).length > 0;
    },

    visible_fields_from_categories(categories) {
      let fields = [];
      categories.categories.forEach((category) => {
        category.fields.forEach((field) => {
          fields.push(field.name);
        });
      });

      return this.visible_fields(fields)
    },
    fields_from_self_and_do_not_filter(category) {
      return category.fields.map(field => field.name);
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

      return found;
    },
  },
  computed: {
    report_urllist_ids() {
      return this.reports.map(report => report.urllist_id);
    },
    charts_to_render() {
      // Seperates nesting logic and other complexities from actual rending of the chart. Here it is specified what
      // charts need to be rendered, and the UI will just render all those charts according to specification in the
      // same order.
      let charts = [];

      this.scan_methods.forEach((scan_form) => {
        // make web axis-charts for web and mail axis charts for mail.
        if (scan_form.name !== this.reports[0].report_type)
          return
        charts.push({
          'average': this.show_average(scan_form.name),
          'only_average': false,
          'axis': this.visible_fields_from_scan_form(scan_form),
          'level': 1,
          'label': ''
        });
        // The first nesting deals with categories
        scan_form.categories.forEach((category) => {
          charts.push({
            'average': this.show_average(category.key),
            'only_average': false,
            'axis': this.visible_fields_from_categories(category),
            'level': 2,
            'label': category.label
          });
          category.categories.forEach((subcategory) => {

            // The DNSSEC subcategory has the same fields as the category, adding an additional chart is useless.
            // So if the fields from the parent match the child, don't add the graph for it.
            // Same goes for http security options. The category already shows all (albeit with a different label).
            if (this.visible_fields_from_categories(category).join("") !== this.fields_from_self(subcategory).join(""))
              charts.push({
                'average': this.show_average(subcategory.key),
                'only_average': false,
                'axis': this.fields_from_self(subcategory),
                'level': 3,
                'label': subcategory.label
              });

            // Special chart for forum standaardisatie that cannot have fields disabled:
            // if (['category_mail_forum_standardisation_magazine', 'category_web_forum_standardisation_magazine'].includes(subcategory.key))
            //   charts.push({
            //     'average': true,
            //     'only_average': true,
            //     'axis': this.fields_from_self_and_do_not_filter(subcategory),
            //     'level': 3,
            //     'label': 'This shows the average for Forum Standardisation, it is not possible to show the average or to select what fields should be visible.'
            //   });

          })
        })
      });

      console.log(charts);
      // remove all charts that do not have any axis, as that would result in an empty chart.
      return charts.filter(chart => chart.axis.length > 0);
    },
  }
}
</script>
<i18n>
{
  "en": {
    "how_charts_work": "By clicking on legend labels, it's possible to toggle certain categories. The 'failed' category is disabled by default and can be enabled by clicking on it.",
    "cumulative_adoption_bar_chart": {
      "title": "Adoption of standards over multiple reports",
      "intro": "This graph shows the average adoption per standard averaged over multiple reports."
    },
    "adoption_bar_chart": {
      "title": "Adoption of standards",
      "intro": "This graph shows the average adoption per standard per report."
    }
  },
  "nl": {
    "how_charts_work": "Door te klikken op de leganda in deze grafieken, kunnen beoordelingen worden getoond en verborgen. De 'gezakt' categorie wordt standaard altijd verborgen.",
    "cumulative_adoption_bar_chart": {
      "title": "Adoptie van standaarden, rapporten opgeteld",
      "intro": "In deze grafiek worden de geselecteerde rapporten bij elkaar opgeteld, en daar het gemiddelde van getoond."
    },
    "adoption_bar_chart": {
      "title": "Adoptie van standaarden",
      "intro": "Deze grafiek toont het percentage adoptie per categorie en onderliggende metingen."
    }
  }
}
</i18n>
