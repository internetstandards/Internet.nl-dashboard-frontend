import {describe, expect, it} from "vitest";

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
});
