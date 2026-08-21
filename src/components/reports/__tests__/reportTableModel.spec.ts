import {describe, expect, it} from 'vitest'
import {buildReportTableRows, verdictFor} from '@/components/reports/reportTableModel'

describe('reportTableModel', () => {
  it('normalizes current report data and comparisons into sortable rows', () => {
    const current = {
      url: 'example.nl',
      endpoints: [{
        ratings: {
          internet_nl_score: {
            internet_nl_score: 90,
            internet_nl_url: 'https://internet.nl/site/example.nl/1/',
          },
          internet_nl_web_dnssec: {
            evidence: '{"status":"secure"}',
            simple_progression: 4,
            test_result: 'passed',
          },
        },
      }],
    }
    const previous = {
      url: 'example.nl',
      endpoints: [{
        ratings: {
          internet_nl_score: {internet_nl_score: 70},
          internet_nl_web_dnssec: {simple_progression: 1, test_result: 'failed'},
        },
      }],
    }

    const [row] = buildReportTableRows(
      [current],
      {'example.nl': previous},
      [{key: 'internet_nl_web_dnssec', overview: true}],
    )

    expect(row.score).toBe(90)
    expect(row.scoreComparison).toBe('improved')
    expect(row.internet_nl_web_dnssec).toBe(4)
    expect(row.metrics.internet_nl_web_dnssec).toMatchObject({
      comparison: 'improved',
      evidence: '{\n  "status": "secure"\n}',
      overview: true,
      verdict: 'passed',
    })
  })

  it('supports legacy ratings and records without endpoints', () => {
    const legacy = {
      url: 'legacy.example',
      endpoints: [{
        ratings_by_type: {
          internet_nl_score: {internet_nl_score: 55},
          metric: {simple_progression: 2, simple_verdict: 'not-testable'},
        },
      }],
    }
    const missingEndpoint = {url: 'ignored.example', endpoints: []}

    const rows = buildReportTableRows(
      [legacy, missingEndpoint],
      {},
      [{key: 'metric'}],
    )

    expect(rows[0].metrics.metric.verdict).toBe('not_testable')
    expect(rows[1]).toMatchObject({eligible: false, score: null})
    expect(rows[1].metrics.metric.verdict).toBe('unknown')
  })

  it('keeps the legacy application-security warning behavior', () => {
    expect(verdictFor({ok: 0}, 'internet_nl_web_appsecpriv')).toBe('warning')
    expect(verdictFor({ok: 0}, 'internet_nl_web_dnssec')).toBe('failed')
  })
})
