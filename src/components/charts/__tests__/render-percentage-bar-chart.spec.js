import {describe, expect, it, vi} from "vitest";

import ChartMixin from "@/components/charts/chart_mixin.vue";
import PercentageBarChart from "@/components/charts/render-percentage-bar-chart.vue";

describe("render-percentage-bar-chart", () => {
  it("renders populated chart data without waiting for a resize", () => {
    const chart = {
      data: {},
      update: vi.fn(),
    };
    const context = {
      chart,
      chart_data: [{
        id: 1,
        calculation: {
          statistics_per_issue_type: {
            starttls: {pct_ok: 80},
            rpki: {pct_ok: 60},
          },
        },
      }],
      axis: ["starttls", "rpki"],
      shown_values: ["pct_ok"],
      show_average: true,
      only_show_dynamic_average: false,
      field_name_to_category_names: {},
      background_colors: {pct_ok: "green"},
      rendered_chart_to_table: {},
      chartName: "overall",
      configure_barchart: vi.fn(),
      sync_chart_data_table: ChartMixin.methods.sync_chart_data_table,
      $i18n: {t: (key) => key},
    };

    PercentageBarChart.methods.renderData.call(context);

    expect(chart.data.labels).toEqual([
      ["metric.starttls.title", ""],
      ["metric.rpki.title", ""],
      "chart.percentage-bar-chart.average",
    ]);
    expect(chart.data.datasets[0].data).toEqual([80, 60, 70]);
    expect(context.rendered_chart_to_table.overall.labels).toEqual(chart.data.labels);
    expect(context.rendered_chart_to_table.overall).not.toBe(chart.data);
    expect(chart.update).toHaveBeenCalledOnce();
    expect(chart.update).toHaveBeenCalledWith("none");
  });
});
