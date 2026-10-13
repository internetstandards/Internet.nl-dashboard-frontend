import {unref} from 'vue'
import {createPinia, setActivePinia} from 'pinia'
import {flushPromises} from '@vue/test-utils'
import {beforeEach, describe, expect, it, vi} from 'vitest'

import UserStatistics from '@/components/admin/UserStatistics.vue'
import Unsubscribe from '@/components/mail/Unsubscribe.vue'
import ReportTagFilter from '@/components/reports/ReportTagFilter.vue'
import reportMixin from '@/components/reports/report_mixin_2.vue'
import {problemTypes} from '@/apiProblems'
import http from '@/httpclient'

vi.mock('@/httpclient', () => ({default: {get: vi.fn(), post: vi.fn()}}))

beforeEach(() => {
  vi.clearAllMocks()
  setActivePinia(createPinia())
})

function reportContext(codes = {}) {
  return {
    ...reportMixin.data(), ...reportMixin.methods,
    my_store: {public_share_codes: codes},
    add_comparison_urls_to_report: vi.fn(),
  }
}

const metadata = {id: 42, public_report_code: 'protected-report', urllist_name: 'Example', at_when: '2026-01-02T00:00:00Z'}
const denied = {status: 403, data: {type: problemTypes.REPORT_ACCESS_DENIED, detail: 'A valid share code is required.', report: metadata}}

describe('shared-report HTTP errors', () => {
  it('shows the password form using metadata from a 403 problem', async () => {
    http.get.mockRejectedValue({response: denied})
    const context = reportContext()
    await context.load_shared_reports_by_ids(['protected-report'])
    expect(context.shallow_reports, 'Access denial should retain the existing password-form metadata.').toEqual([
      {...metadata, authentication_required: true},
    ])
    expect(context.report_errors, 'A recognized access problem should show the password form.').toEqual([])
    expect(context.reports_to_load, 'A rejected HTTP request must finish loading.').toBe(0)
  })

  it('retains the password form when a stored password is incorrect', async () => {
    http.post.mockRejectedValue({response: denied})
    const context = reportContext({'protected-report': 'incorrect'})
    await context.load_shared_reports_by_ids(['protected-report'])
    expect(http.post, 'Share codes belong in the request body.').toHaveBeenCalledWith(
      '/api/v1/public-reports/protected-report', {share_code: 'incorrect'})
    expect(context.shallow_reports[0].authentication_required, 'Wrong credentials must allow another attempt.').toBe(true)
    expect(context.reports_to_load, 'Wrong credentials must not leave a loading spinner.').toBe(0)
  })

  it('replaces the password form with report data after a successful retry', async () => {
    const report = {...metadata, calculation: {urls: []}}
    http.post.mockResolvedValue({status: 200, data: report})
    const context = reportContext({'protected-report': 'correct'})
    context.shallow_reports = [{...metadata, authentication_required: true}]
    await context.load_shared_reports_by_ids(['protected-report'])
    expect(unref(context.reports), 'A successful HTTP response should supply the report directly.').toEqual([report])
    expect(context.shallow_reports[0].authentication_required, 'The password form should disappear after success.').toBeUndefined()
  })

  it('does not treat a protected comparison report as calculation data', async () => {
    http.get.mockResolvedValueOnce({status: 200, data: {id: 1, calculation: {urls: []}}})
      .mockRejectedValueOnce({response: denied})
    const context = reportContext()
    await context.load_shared_reports_by_ids(['public', 'protected-report'])
    expect(context.add_comparison_urls_to_report, 'Protected metadata has no calculation to transform.').not.toHaveBeenCalled()
    expect(context.shallow_reports[1].authentication_required, 'The comparison password should remain editable.').toBe(true)
  })

  it.each([
    {response: {status: 404, data: {type: 'about:blank', detail: 'Report not found.'}}},
    new Error('Network failure'),
  ])('finishes loading and preserves unexpected report failures: %j', async error => {
    http.get.mockRejectedValue(error)
    const context = reportContext()
    await context.load_shared_reports_by_ids(['missing'])
    expect(context.reports_to_load, 'Every failure must finish the request batch.').toBe(0)
    expect(unref(context.reports), 'Failed requests must not masquerade as reports.').toEqual([])
    expect(context.report_errors[0].status, 'The UI must retain the actual HTTP or network failure.').toBe(error.response?.status || 0)
  })

  it('ignores an older batch that finishes after a retry', async () => {
    let finishOldRequest
    http.get.mockReturnValueOnce(new Promise(resolve => { finishOldRequest = resolve }))
      .mockResolvedValueOnce({status: 200, data: {id: 2}})
    const context = reportContext()
    const older = context.load_shared_reports_by_ids(['older'])
    await context.load_shared_reports_by_ids(['newer'])
    finishOldRequest({status: 200, data: {id: 1}})
    await older
    expect(unref(context.reports), 'A late response must not replace the results of the current request.').toEqual([{id: 2}])
  })
})

describe('ADR request contracts', () => {
  it('sends camelCase user-statistics query parameters', async () => {
    http.get.mockResolvedValue({status: 200, data: {actors: []}})
    const context = {filters: {start_date: '2026-01-02', end_date: '2026-01-04', max_records: 3}, normalizeResponse: value => value}
    UserStatistics.methods.load.call(context)
    await flushPromises()
    expect(http.get, 'Query keys should follow the generated API specification.').toHaveBeenCalledWith(
      '/api/v1/admin/user-statistics', {params: {startDate: '2026-01-02', endDate: '2026-01-04', maxRecords: 3}})
  })

  it('prefills an unsubscribe link and waits for confirmation', () => {
    const context = {feed: '', unsubscribe_code: '', $route: {query: {feed: 'scan_finished', unsubscribe_code: 'x'.repeat(128)}}, unsubscribe: vi.fn()}
    Unsubscribe.mounted.call(context)
    expect(context.unsubscribe, 'Opening a link must not automatically perform a mutation.').not.toHaveBeenCalled()
    expect(context.show_unsubscribe_form, 'The user should be able to confirm the request.').toBe(true)
    expect(context.unsubscribe_code.length, 'Email links must retain the complete token.').toBe(128)
  })

  it('posts the unsubscribe token in the body and closes the confirmed form', async () => {
    http.post.mockResolvedValue({status: 204, data: ''})
    const context = {feed: 'scan_finished', unsubscribe_code: 'x'.repeat(128), show_unsubscribe_form: true}
    await Unsubscribe.methods.unsubscribe.call(context)
    expect(http.post, 'The mutation and its token belong in a POST body.').toHaveBeenCalledWith('/api/v1/mail/unsubscriptions', {
      feed: 'scan_finished', unsubscribe_code: 'x'.repeat(128),
    })
    expect(context.unsubscribed, 'A bodyless successful response should confirm unsubscription.').toBe(true)
    expect(context.show_unsubscribe_form, 'Completed confirmation should hide the form.').toBe(false)
  })

  it('sends absent ad-hoc date filters as null in a POST preview', async () => {
    http.post.mockResolvedValue({status: 200, data: {id: 1}})
    const context = reportContext()
    await context.load_reports_by_ids([1], {tags: [], custom_date: '', custom_time: ''})
    expect(http.post, 'An ad-hoc preview should have a typed request body.').toHaveBeenCalledWith(
      '/api/v1/reports/1/ad-hoc/preview', {tags: [], custom_date: null, custom_time: null})
  })

  it('sends absent dates as null when saving an ad-hoc report', async () => {
    http.post.mockResolvedValue({status: 204, data: ''})
    const context = {store: {report_ids: [1]}, selected_tags: [], custom_date: '', custom_time: '', $emit: vi.fn()}
    ReportTagFilter.methods.save_ad_hoc_report.call(context)
    await flushPromises()
    expect(http.post, 'The saved report should use the same nullable temporal contract as previews.').toHaveBeenCalledWith(
      '/api/v1/reports/1/ad-hoc', {tags: [], custom_date: null, custom_time: null})
  })
})
