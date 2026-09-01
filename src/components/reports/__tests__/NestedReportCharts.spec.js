import {describe, expect, it, vi} from "vitest";

import NestedReportCharts from "@/components/reports/NestedReportCharts.vue";

describe("NestedReportCharts", () => {
  const scanForm = {
    name: "web",
    label: "Web",
    categories: [
      {
        key: "ipv6",
        label: "IPv6",
        categories: [
          {key: "name-servers", label: "Name servers"},
          {key: "web-server", label: "Web server"},
        ],
      },
    ],
  };

  it("builds selectable options in the scan, category, subcategory hierarchy", () => {
    const context = {
      scan_methods: [scanForm],
      reports: [{report_type: "web"}],
      visible_fields_from_scan_form: () => ["ipv6"],
      visible_fields_from_categories: () => ["name-servers", "web-server"],
      fields_from_self: (subcategory) => [subcategory.key],
    };

    const charts = NestedReportCharts.computed.charts_to_render.call(context);
    const options = NestedReportCharts.computed.chart_options.call({charts_to_render: charts});

    expect(charts.map((chart) => chart.key)).toEqual([
      "overall",
      "category:ipv6",
      "subcategory:name-servers",
      "subcategory:web-server",
    ]);
    expect(options.map((option) => option.text)).toEqual([
      "Web",
      "\u00a0\u00a0IPv6",
      "\u00a0\u00a0\u00a0\u00a0Name servers",
      "\u00a0\u00a0\u00a0\u00a0Web server",
    ]);
  });

  it("uses separate chart table keys for regular and cumulative graphs", () => {
    const selectedChart = {key: "category:ipv6"};

    expect(NestedReportCharts.computed.selected_chart_store_key.call({
      component: "percentage-bar-chart",
      selected_chart: selectedChart,
    })).toBe("percentage-bar-chart:category:ipv6");
    expect(NestedReportCharts.computed.selected_chart_store_key.call({
      component: "cumulative-percentage-bar-chart",
      selected_chart: selectedChart,
    })).toBe("cumulative-percentage-bar-chart:category:ipv6");
  });

  it("downloads a PNG named for the report, chart, category, and date", () => {
    const download = vi.fn();
    const context = {
      reports: [{id: 49, urllist_name: "Example organisation"}],
      component: "percentage-bar-chart",
      selected_chart: {label: "TLS / certificates"},
      download_date: () => "2026-09-01",
      filename_part: NestedReportCharts.methods.filename_part,
      $t: (key) => key === "report.report-charts.adoption_bar_chart.title"
        ? "Adoption of standards per category"
        : key,
      $refs: {selected_chart_component: {download}},
    };

    NestedReportCharts.methods.download_selected_chart.call(context);

    expect(download).toHaveBeenCalledWith(
      "png",
      "example-organisation-49_adoption-of-standards-per-category_tls-certificates_2026-09-01.png",
    );
  });

  it("only creates donuts for selected metrics available in a report", () => {
    const context = {
      selected_chart: {axis: ["starttls", "missing", "rpki"]},
    };
    const report = {
      calculation: {
        statistics_per_issue_type: {
          starttls: {pct_ok: 80},
          rpki: {pct_ok: 60},
        },
      },
    };

    expect(NestedReportCharts.methods.donut_metrics_for_report.call(context, report))
      .toEqual(["starttls", "rpki"]);
  });

  it("downloads an individual donut with its metric name", () => {
    const download = vi.fn();
    const report = {id: 49, urllist_name: "Example organisation"};
    const metric = "internet_nl_web_tls";
    const refName = `donut:${report.id}:${metric}`;
    const context = {
      download_date: () => "2026-09-01",
      donut_ref_name: () => refName,
      filename_part: NestedReportCharts.methods.filename_part,
      $t: () => "HTTPS",
      $refs: {[refName]: [{download}]},
    };

    NestedReportCharts.methods.download_donut.call(context, report, metric);

    expect(download).toHaveBeenCalledWith(
      "example-organisation-49_donut_https_2026-09-01.png",
    );
  });
});
