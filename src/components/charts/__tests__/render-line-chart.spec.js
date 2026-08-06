import {shallowMount} from "@vue/test-utils";
import {describe, expect, it, vi} from "vitest";

import RenderLineChart from "@/components/charts/render-line-chart.vue";

const timelineData = [{
  id: "mail",
  name: "Mail",
  data: [{
    date: "2026-01-01",
    urls: 10,
    average_internet_nl_score: 80,
    report: "public-report-code",
  }],
}];

const mountChart = (clickableReports) => shallowMount(RenderLineChart, {
  props: {
    timeline_data: timelineData,
    clickable_reports: clickableReports,
  },
});

const activeElement = {datasetIndex: 0, index: 0};

const chartContext = ({points = [], tooltip} = {}) => ({
  canvas: {style: {cursor: "default"}},
  data: {datasets: [{data: [{report: "public-report-code"}]}]},
  getElementsAtEventForMode: vi.fn(() => points),
  tooltip: tooltip ?? {opacity: 0},
});

const chartEvent = {native: {}, x: 50, y: 50};

describe("render-line-chart report interaction", () => {
  it("emits a report code when a plotted point is clicked", () => {
    const wrapper = mountChart(true);
    const chart = chartContext({points: [activeElement]});

    wrapper.vm.options.onHover(chartEvent, [], chart);
    expect(chart.canvas.style.cursor).toBe("pointer");

    wrapper.vm.options.onClick(chartEvent, [], chart);
    expect(wrapper.emitted("report-clicked")).toEqual([["public-report-code"]]);
  });

  it("emits a report code when the visible tooltip is clicked", () => {
    const wrapper = mountChart(true);
    const chart = chartContext({
      tooltip: {
        opacity: 1,
        x: 25,
        y: 25,
        width: 50,
        height: 50,
        getActiveElements: () => [activeElement],
      },
    });

    wrapper.vm.options.onHover(chartEvent, [], chart);
    expect(chart.canvas.style.cursor).toBe("pointer");

    wrapper.vm.options.onClick(chartEvent, [], chart);
    expect(wrapper.emitted("report-clicked")).toEqual([["public-report-code"]]);
  });

  it("does not emit when clickable reports are disabled", () => {
    const wrapper = mountChart(false);
    const chart = chartContext({points: [activeElement]});

    wrapper.vm.options.onHover(chartEvent, [], chart);
    wrapper.vm.options.onClick(chartEvent, [], chart);

    expect(chart.canvas.style.cursor).toBe("default");
    expect(wrapper.emitted("report-clicked")).toBeUndefined();
  });
});
