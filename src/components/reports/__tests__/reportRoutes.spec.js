import {describe, expect, it, vi} from 'vitest'

import {
  reportIdsFromRoute,
  routeForReportIds,
  sameReportIds,
} from '@/components/reports/reportRoutes'

describe('report routes', () => {
  it('reads up to three report IDs from route parameters in comparison order', () => {
    expect(reportIdsFromRoute({
      params: {report: '48', compare_with: '49', compare_with_2: '50'},
    })).toEqual([48, 49, 50])
  })

  it('builds a three-report Vue Router destination', async () => {
    const consoleWarning = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const {default: router} = await import('@/router/router')
    const destination = routeForReportIds([48, 49, 50])

    expect(destination).toEqual({
      name: 'three_numbered_reports',
      params: {report: 48, compare_with: 49, compare_with_2: 50},
    })
    expect(router.resolve(destination).fullPath).toBe('/report/48/49/50')
    consoleWarning.mockRestore()
  })

  it('builds the empty, single, and two-report destinations', () => {
    expect(routeForReportIds([])).toEqual({path: '/report'})
    expect(routeForReportIds([48])).toEqual({
      name: 'numbered_report',
      params: {report: 48},
    })
    expect(routeForReportIds([48, 49])).toEqual({
      name: 'compared_numbered_report',
      params: {report: 48, compare_with: 49},
    })
  })

  it('limits programmatic report selections to three IDs', () => {
    expect(routeForReportIds([48, 49, 50, 51])).toEqual({
      name: 'three_numbered_reports',
      params: {report: 48, compare_with: 49, compare_with_2: 50},
    })
  })

  it('compares ordered report selections', () => {
    expect(sameReportIds([48, 49], [48, 49])).toBe(true)
    expect(sameReportIds([48, 49], [49, 48])).toBe(false)
    expect(sameReportIds([48], [48, 49])).toBe(false)
  })
})
