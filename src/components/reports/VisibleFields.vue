<!-- SPDX-License-Identifier: Apache-2.0 -->
<script>
import report_mixin from "@/components/reports/report_mixin.vue";
import { dashboardStore } from '@/dashboardStore'

export default {
  mixins: [report_mixin],

  name: "NestedReportCharts.vue",

  mounted: function () {
    this.issue_filters = this.store.visible_metrics;
  },

  data: function () {
    return {
      store: dashboardStore(),
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
}
</script>
