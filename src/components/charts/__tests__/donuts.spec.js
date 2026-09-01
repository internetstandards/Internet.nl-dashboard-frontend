import {describe, expect, it} from "vitest";

import Donut from "@/components/charts/donut.vue";
import Donuts from "@/components/charts/donuts.vue";

describe("donuts", () => {
  it("only creates layout items for charts present in the report", () => {
    const context = {
      scan_methods: [{name: "web"}, {name: "mail"}],
      visible_fields_from_scan_form: () => ["first", "missing", "second"],
    };
    const report = {
      report_type: "mail",
      calculation: {
        statistics_per_issue_type: {
          first: {pct_ok: 50},
          second: {pct_ok: 75},
        },
      },
    };

    expect(Donuts.methods.donut_items.call(context, report)).toEqual(["first", "second"]);
  });

  it("includes non-testable result states in each donut", () => {
    expect(Donut.props.axis.default()).toEqual([
      "pct_ok",
      "pct_low",
      "pct_medium",
      "pct_high",
      "pct_not_testable",
      "pct_not_applicable",
      "pct_error_in_test",
    ]);
  });
});
