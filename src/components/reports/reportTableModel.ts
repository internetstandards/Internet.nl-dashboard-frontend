// SPDX-License-Identifier: Apache-2.0

export type MetricColumn = {
  key: string
  overview?: boolean
}

export type Rating = {
  evidence?: unknown
  internet_nl_score?: unknown
  internet_nl_url?: string
  ok?: number
  simple_progression?: unknown
  simple_verdict?: unknown
  since?: number
  test_result?: unknown
}

export type ReportUrlRecord = {
  endpoints?: Array<{
    ratings?: Record<string, Rating>
    ratings_by_type?: Record<string, Rating>
  }>
  url: string
}

export type ReportPayload = {
  calculation?: {
    urls?: ReportUrlRecord[]
    urls_by_url?: Record<string, ReportUrlRecord>
  }
  id?: number
  report_type?: string
}

export type ReportMetric = {
  comparison: '' | 'improved' | 'neutral' | 'regressed'
  evidence: string
  overview: boolean
  since?: number
  sortValue: number
  verdict: string
}

export type ReportTableRow = Record<string, unknown> & {
  eligible: boolean
  metrics: Record<string, ReportMetric>
  reportUrl: string
  score: number | null
  scoreComparison: '' | 'improved' | 'regressed'
  scoreSince?: number
  url: string
}

const neutralVerdicts = new Set([
  'unknown',
  'not_applicable',
  'not_testable',
  'not_tested',
  'no_mx',
  'untestable',
  'unreachable',
  'error',
  'error_in_test',
])

const verdictRank: Record<string, number> = {
  passed: 6,
  info: 5,
  warning: 4,
  failed: 3,
  error: 2,
  error_in_test: 2,
  unknown: 1,
  not_applicable: 1,
  not_testable: 1,
  not_tested: 1,
  no_mx: 1,
  untestable: 1,
  unreachable: 1,
}

function normalizeVerdictName(value: unknown): string {
  return String(value || 'unknown').replaceAll('-', '_')
}

export function ratingsFor(record?: ReportUrlRecord): Record<string, Rating> {
  const endpoint = record?.endpoints?.[0]
  return endpoint?.ratings || endpoint?.ratings_by_type || {}
}

export function verdictFor(rating: Rating | undefined, metricKey: string): string {
  if (!rating) return 'unknown'

  if (rating.test_result !== undefined) return normalizeVerdictName(rating.test_result)
  if (rating.simple_verdict !== undefined) return normalizeVerdictName(rating.simple_verdict)

  if (typeof rating.ok === 'number' && rating.ok > 0) return 'passed'
  if (typeof rating.ok === 'number' && rating.ok < 1) {
    return metricKey === 'internet_nl_web_appsecpriv' ? 'warning' : 'failed'
  }

  return 'unknown'
}

function progressionFor(rating: Rating | undefined, verdict: string): number {
  const progression = Number(rating?.simple_progression)
  return Number.isFinite(progression) ? progression : (verdictRank[verdict] ?? 1)
}

function comparisonFor(current: ReportMetric, previous?: ReportMetric): ReportMetric['comparison'] {
  if (!previous || current.verdict === previous.verdict) return previous ? 'neutral' : ''
  if (neutralVerdicts.has(current.verdict) || neutralVerdicts.has(previous.verdict)) return 'neutral'
  return current.sortValue > previous.sortValue ? 'improved' : 'regressed'
}

function formatEvidence(value: unknown): string {
  if (!value) return ''
  if (typeof value === 'object') return JSON.stringify(value, null, 2)

  const text = String(value)
  if (!text.startsWith('{') && !text.startsWith('[')) return text

  try {
    return JSON.stringify(JSON.parse(text), null, 2)
  } catch {
    return text
  }
}

function metricFor(record: ReportUrlRecord, metricKey: string, overview = false): ReportMetric {
  const rating = ratingsFor(record)[metricKey]
  const verdict = verdictFor(rating, metricKey)
  return {
    comparison: '',
    evidence: formatEvidence(rating?.evidence),
    overview,
    since: typeof rating?.since === 'number' ? rating.since : undefined,
    sortValue: progressionFor(rating, verdict),
    verdict,
  }
}

function scoreFor(record?: ReportUrlRecord): number | null {
  const score = Number(ratingsFor(record).internet_nl_score?.internet_nl_score)
  return Number.isFinite(score) ? score : null
}

export function buildReportTableRows(
  records: ReportUrlRecord[],
  previousByUrl: Record<string, ReportUrlRecord>,
  metricColumns: MetricColumn[],
): ReportTableRow[] {
  return records.map((record) => {
    const ratings = ratingsFor(record)
    const previous = previousByUrl?.[record.url]
    const currentScore = scoreFor(record)
    const previousScore = scoreFor(previous)
    const row: ReportTableRow = {
      eligible: Boolean(record?.endpoints?.[0]),
      metrics: {},
      reportUrl: ratings.internet_nl_score?.internet_nl_url || '',
      score: currentScore,
      scoreComparison: previousScore === null || currentScore === null || previousScore === currentScore
        ? ''
        : currentScore > previousScore ? 'improved' : 'regressed',
      scoreSince: ratings.internet_nl_score?.since,
      url: record.url,
    }

    metricColumns.forEach(({key, overview}) => {
      const metric = metricFor(record, key, overview)
      metric.comparison = comparisonFor(metric, previous ? metricFor(previous, key, overview) : undefined)
      row.metrics[key] = metric
      row[key] = metric.sortValue
    })

    return row
  })
}
