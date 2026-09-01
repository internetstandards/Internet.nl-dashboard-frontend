import {describe, expect, it, vi} from 'vitest'

import Report from '@/components/reports/Report.vue'
import ReportSelection from '@/components/reports/ReportSelection.vue'

describe('report selection routing', () => {
  it('matches loaded dropdown options to the route in comparison order', () => {
    const reports = [
      {id: 50, type: 'web'},
      {id: 48, type: 'web'},
      {id: 49, type: 'web'},
    ]
    const context = {
      available_recent_reports: reports,
      filtered_recent_reports: [],
      selected_report_ids: [],
      selected_reports: [],
      syncing_from_route: false,
      $nextTick: callback => callback(),
    }

    ReportSelection.methods.match_with_environment.call(context, {
      params: {report: '48', compare_with: '49', compare_with_2: '50'},
    })

    expect(context.selected_report_ids).toEqual([48, 49, 50])
    expect(context.selected_reports.map(report => report.id)).toEqual([48, 49, 50])
  })

  it('navigates to the empty report route when the dropdown is cleared', () => {
    const navigateToReports = vi.fn()
    const context = {
      syncing_from_route: false,
      available_recent_reports: [{id: 48}],
      filtered_recent_reports: [],
      selected_report_ids: [48],
      navigate_to_reports: navigateToReports,
    }

    ReportSelection.watch.selected_reports.call(context, [], [{id: 48}])

    expect(context.selected_report_ids).toEqual([])
    expect(navigateToReports).toHaveBeenCalledWith([])
  })

  it('clears the report store and rendered report state on the empty route', () => {
    const setReportIds = vi.fn()
    const context = {
      report_ids: [48],
      requested_report_ids: [48],
      reports: [{id: 48}],
      shallow_reports: [{id: 48}],
      reports_to_load: 1,
      my_store: {set_report_ids: setReportIds},
    }

    Report.methods.sync_reports_with_route.call(context, {params: {}})

    expect(setReportIds).toHaveBeenCalledWith([])
    expect(context.requested_report_ids).toEqual([])
    expect(context.reports).toEqual([])
    expect(context.shallow_reports).toEqual([])
    expect(context.reports_to_load).toBe(0)
  })
})
