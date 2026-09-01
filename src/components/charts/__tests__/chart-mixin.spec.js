import {describe, expect, it} from "vitest";

import ChartMixin from "@/components/charts/chart_mixin.vue";

describe("chart_mixin legend", () => {
  it("only considers a result available when its dataset has a non-zero value", () => {
    const hasValues = ChartMixin.methods.legend_dataset_has_values;

    expect(hasValues({data: [0, 0, "0", null]})).toBe(false);
    expect(hasValues({data: [0, 2, 0]})).toBe(true);
    expect(hasValues(undefined)).toBe(false);
  });

  it("publishes a fresh table snapshot after every chart update", () => {
    const context = {
      chartName: "overall",
      chart: {
        data: {
          labels: ["First", "Average"],
          datasets: [{label: "Passed", data: [80, 80]}],
        },
      },
      rendered_chart_to_table: {},
    };

    ChartMixin.methods.sync_chart_data_table.call(context);
    const firstSnapshot = context.rendered_chart_to_table.overall;

    context.chart.data.labels = ["First"];
    context.chart.data.datasets[0].data = [80];
    ChartMixin.methods.sync_chart_data_table.call(context);

    expect(context.rendered_chart_to_table.overall).not.toBe(firstSnapshot);
    expect(context.rendered_chart_to_table.overall).toEqual({
      labels: ["First"],
      datasets: [{label: "Passed", data: [80]}],
    });
  });
});
