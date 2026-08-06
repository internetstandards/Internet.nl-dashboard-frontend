import {shallowMount} from "@vue/test-utils";
import {afterEach, describe, expect, it, vi} from "vitest";

import PublicReportsByList from "@/components/home/PublicReportsByList.vue";

const report = (overrides) => ({
  urllist_id: 1,
  urllist_name: "Example list",
  report_type: "web",
  at_when: "2026-01-01T12:00:00Z",
  average_internet_nl_score: 80,
  total_urls: 10,
  public_report_code: "report-code",
  ...overrides,
});

const mountComponent = (reports) => shallowMount(PublicReportsByList, {
  props: {reports},
  global: {
    mocks: {
      $t: (key) => key,
    },
  },
});

describe("PublicReportsByList", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("groups reports by list id even when list names match", () => {
    const wrapper = mountComponent([
      report({urllist_id: 1, public_report_code: "list-1"}),
      report({urllist_id: 2, public_report_code: "list-2"}),
    ]);

    expect(wrapper.vm.report_groups).toHaveLength(2);
    expect(wrapper.vm.report_groups.map((group) => group.key)).toEqual(["id:1", "id:2"]);
  });

  it("creates independent ordered timelines and tables for web and mail", () => {
    const wrapper = mountComponent([
      report({at_when: "2026-03-01T12:00:00Z", public_report_code: "newest"}),
      report({at_when: "2026-01-01T12:00:00Z", public_report_code: "oldest"}),
      report({
        at_when: "2026-02-01T12:00:00Z",
        public_report_code: "middle",
        report_type: "mail",
      }),
    ]);

    const [group] = wrapper.vm.report_groups;
    const web = group.report_sets.find((reportSet) => reportSet.report_type === "web");
    const mail = group.report_sets.find((reportSet) => reportSet.report_type === "mail");

    expect(group.report_sets.map((reportSet) => reportSet.report_type)).toEqual(["web", "mail"]);
    expect(web.reports.map((item) => item.public_report_code)).toEqual(["newest", "oldest"]);
    expect(web.timeline_data[0].data.map((item) => item.date)).toEqual([
      "2026-01-01",
      "2026-03-01",
    ]);
    expect(mail.reports.map((item) => item.public_report_code)).toEqual(["middle"]);
    expect(mail.timeline_data[0].data.map((item) => item.date)).toEqual(["2026-02-01"]);
  });

  it("opens an emitted public report code in a new tab", () => {
    const open = vi.spyOn(window, "open").mockImplementation(() => null);
    const wrapper = mountComponent([report({public_report_code: "public report/code"})]);

    wrapper.vm.open_report("public report/code");

    expect(open).toHaveBeenCalledWith(
      "/shared/report/public%20report%2Fcode",
      "_blank",
      "noopener,noreferrer",
    );
  });
});
