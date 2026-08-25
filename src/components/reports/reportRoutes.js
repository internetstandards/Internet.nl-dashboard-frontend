// SPDX-License-Identifier: Apache-2.0

const reportParamNames = ['report', 'compare_with', 'compare_with_2']

export function reportIdsFromRoute(route) {
  return reportParamNames
    .map(param => Number.parseInt(route.params?.[param], 10))
    .filter(Number.isInteger)
}

export function routeForReportIds(reportIds) {
  const ids = reportIds.slice(0, 3)

  if (ids.length === 0) {
    return {path: '/report'}
  }

  if (ids.length === 1) {
    return {
      name: 'numbered_report',
      params: {report: ids[0]},
    }
  }

  if (ids.length === 2) {
    return {
      name: 'compared_numbered_report',
      params: {report: ids[0], compare_with: ids[1]},
    }
  }

  return {
    name: 'three_numbered_reports',
    params: {
      report: ids[0],
      compare_with: ids[1],
      compare_with_2: ids[2],
    },
  }
}

export function sameReportIds(first, second) {
  return first.length === second.length && first.every((id, index) => id === second[index])
}
