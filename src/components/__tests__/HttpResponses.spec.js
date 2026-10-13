import {flushPromises, shallowMount} from '@vue/test-utils'
import {beforeEach, describe, expect, it, vi} from 'vitest'

import ServerResponse from '@/components/ServerResponse.vue'
import EditDomain from '@/components/domains/domain/editDomain.vue'
import StopScanModal from '@/components/scans/stopScanModal.vue'
import ScanModal from '@/components/domains/list/ScanModal.vue'
import AddDomainsModal from '@/components/domains/list/AddDomainsModal.vue'
import DiscoverSubdomainsModal from '@/components/domains/list/DiscoverSubdomainsModal.vue'
import WwwDiscovery from '@/components/domains/list/WwwDiscovery.vue'
import SignupForm from '@/components/signup/SignupForm.vue'
import SharingConfiguration from '@/components/reports/SharingConfiguration.vue'
import http from '@/httpclient'
import {requestError} from '@/requestError'
import {problemTypes} from '@/apiProblems'

vi.mock('@/httpclient', () => ({default: {get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn()}}))

beforeEach(() => vi.clearAllMocks())

function renderResponse(response, props = {}, translations = {}) {
  return shallowMount(ServerResponse, {
    props: {response, ...props},
    global: {renderStubDefaultSlot: true, mocks: {
      $t: key => translations[key] || key,
      $te: key => key in translations,
    }},
  })
}

describe('HTTP response messages', () => {
  it('renders a local success message for an empty 204 response', () => {
    const wrapper = renderResponse({status: 204, data: ''}, {message: 'Settings saved.'})
    expect(wrapper.text(), 'The caller supplies success text without a JSON envelope.').toContain('Settings saved.')
    expect(wrapper.vm.failed, 'An empty successful response must not be treated as failure.').toBe(false)
  })

  it('prefers problem detail over the caller success message', () => {
    const wrapper = renderResponse({status: 409, data: {detail: 'Scan already finished.'}}, {message: 'Scan cancelled.'})
    expect(wrapper.text(), 'A failure must describe the problem.').toContain('Scan already finished.')
    expect(wrapper.text(), 'A failure must never show a success message.').not.toContain('Scan cancelled.')
  })

  it('translates a known problem type without caller-specific configuration', () => {
    const wrapper = renderResponse({status: 400, data: {
      type: problemTypes.DOMAIN_LIMIT_EXCEEDED, detail: 'Too many domains.',
    }}, {}, {'domain.list.add-domains.too_many_domains': 'Domain limit exceeded.'})
    expect(wrapper.text(), 'The standard type identifies the translated domain error.').toContain('Domain limit exceeded.')
  })

  it.each(['about:blank', 'tag:other.example,2026:dashboard:domain-limit-exceeded', '__proto__'])(
    'shows readable fallback text for an unrecognized type: %s', type => {
      const wrapper = renderResponse({status: 400, data: {type, detail: 'The input is invalid.'}})
      expect(wrapper.text(), 'Only recognized complete type URIs should select a translation.').toContain('The input is invalid.')
    })

  it('distinguishes two conflicts with the same HTTP status', () => {
    const translations = {
      'admin.instant_add_account.error_username_already_exists': 'Username taken.',
      'admin.instant_add_account.error_account_name_already_exists': 'Account name taken.',
    }
    const username = renderResponse({status: 409, data: {type: problemTypes.USERNAME_ALREADY_EXISTS}}, {}, translations)
    const account = renderResponse({status: 409, data: {type: problemTypes.ACCOUNT_NAME_ALREADY_EXISTS}}, {}, translations)
    expect(username.text(), 'HTTP 409 alone cannot identify the conflicting field.').toContain('Username taken.')
    expect(account.text(), 'The problem type selects the appropriate conflict translation.').toContain('Account name taken.')
  })

  it('displays a network failure without requiring error.response', () => {
    const wrapper = renderResponse(requestError(new Error('Network Error')))
    expect(wrapper.vm.failed, 'Network failures should render as errors.').toBe(true)
    expect(wrapper.text(), 'Network failures need a useful message.').toContain('Unable to contact the server.')
  })

  it('keeps the original HTTP error response intact', () => {
    const response = {status: 403, data: {status: 403, detail: 'Access denied.'}}
    expect(requestError({response}), 'No alternate response envelope should be constructed.').toBe(response)
  })
})

describe('mutation flows', () => {
  it.each([
    [problemTypes.DISCOVERY_NOT_STARTED, true],
    [problemTypes.LIST_NOT_FOUND, false],
  ])('handles discovery 404 according to its problem type: %s', async (type, initialState) => {
    const response = {status: 404, data: {type, detail: 'Unavailable.'}}
    http.get.mockRejectedValue({response})
    const context = {list_id: 8, reset: vi.fn(), response: {}, loading: false, state_message: ''}
    WwwDiscovery.methods.status.call(context)
    await flushPromises()
    expect(context.reset.mock.calls.length, 'Only an unstarted scan should show the initial discovery state.').toBe(initialState ? 1 : 0)
    expect(context.response, 'A missing list must remain visible as an error.').toEqual(initialState ? {} : response)
    expect(context.loading, 'Both 404 cases must finish loading.').toBe(false)
  })

  it('closes cancellation on 204 without reading a response body', async () => {
    http.delete.mockResolvedValue({status: 204, data: ''})
    const context = {scan: {id: 12}, response: {}, $emit: vi.fn()}
    StopScanModal.methods.confirm_stop_scan.call(context)
    await flushPromises()
    expect(context.$emit, 'A successful HTTP response should notify the monitor.').toHaveBeenCalledWith('scan-stopped', 12)
  })

  it('keeps cancellation open and displays a 409 problem', async () => {
    const response = {status: 409, data: {detail: 'A finished scan cannot be cancelled.'}}
    http.delete.mockRejectedValue({response})
    const context = {scan: {id: 12}, response: {}, $emit: vi.fn()}
    StopScanModal.methods.confirm_stop_scan.call(context)
    await flushPromises()
    expect(context.$emit, 'Failed cancellation must not emit success.').not.toHaveBeenCalled()
    expect(context.response, 'The modal should display the original error response.').toBe(response)
  })

  it('enables the start button again after a rejected request', async () => {
    const response = {status: 409, data: {detail: 'Scan unavailable.'}}
    http.post.mockRejectedValue({response})
    const context = {list: {id: 8, scan_now_available: true}, scan_now_confirmed: false,
      response: {}, $emit: vi.fn(), schedule_scan_monitor_refresh: vi.fn()}
    ScanModal.methods.confirm_scan_now.call(context)
    await flushPromises()
    expect(context.scan_now_confirmed, 'An error should allow retrying the form.').toBe(false)
    expect(context.response, 'The scan modal should retain the Problem Details.').toBe(response)
    expect(context.schedule_scan_monitor_refresh, 'Failed work must not schedule a refresh as if it started.').not.toHaveBeenCalled()
    expect(context.list.scan_now_available, 'Failure must not alter the local list state.').toBe(true)
  })

  it('stores domain counters directly from a 201 response', async () => {
    const response = {status: 201, data: {incorrect_urls: [], added_to_list: 2, already_in_list: 1, duplicates_removed: 1}}
    http.post.mockResolvedValue(response)
    const context = {list: {id: 8}, new_domains: 'example.com', response: {}, loading: false, $emit: vi.fn()}
    AddDomainsModal.methods.bulk_add_new.call(context)
    await flushPromises()
    expect(context.response.data.added_to_list, 'Useful import counters should remain available.').toBe(2)
    expect(context.$emit, 'A successful import should refresh the list.').toHaveBeenCalledWith('added')
  })

  it('retains the edited domain and displays a rejected update', async () => {
    const response = {status: 400, data: {detail: 'The domain format is invalid.'}}
    http.put.mockRejectedValue({response})
    const context = {list: {id: 8}, url: {id: 12}, edited_url_value: 'invalid', editing: true, response: {}}
    EditDomain.methods.save.call(context)
    await flushPromises()
    expect(context.response, 'Domain editing must preserve an HTTP error for display.').toBe(response)
    expect(context.editing, 'Rejected changes must keep the editor open.').toBe(true)
  })

  it('accepts the empty 202 response from signup', async () => {
    http.post.mockResolvedValue({status: 202, data: ''})
    const context = {form: {terms_of_use: ['accepted']}, server_response: {}, loading: false, submitted_succesfully: false}
    SignupForm.methods.onSubmit.call(context, {preventDefault: vi.fn()})
    await flushPromises()
    expect(context.submitted_succesfully, 'Accepted signup must not depend on a success payload.').toBe(true)
    expect(context.loading, 'Accepted signup should clear the pending state.').toBe(false)
  })

  it('reads report sharing fields from the resource representation', async () => {
    http.post.mockResolvedValue({status: 200, data: {is_publicly_shared: true, public_report_code: 'public-code'}})
    const context = {report: {id: 8, public_share_code: ''}, response: {}, loading: false, $t: key => key}
    SharingConfiguration.methods.share.call(context)
    await flushPromises()
    expect(context.report.public_report_code, 'Sharing data should be read without a nested envelope.').toBe('public-code')
    expect(context.report.is_publicly_shared, 'The report should reflect the persisted sharing state.').toBe(true)
  })
})


describe('subdomain suggestion errors', () => {
  it.each([400, 502, 503, 504])('displays HTTP %i and clears the loading state', async status => {
    const response = {status, data: {status, detail: 'Suggestions are unavailable.'}}
    http.get.mockRejectedValue({response})
    const context = {list: {id: 8}, input_domain: 'example.com', period: 370,
      loading_suggestions: false, response: {}, suggestions: [{domain: 'old.example.com'}]}
    await DiscoverSubdomainsModal.methods.find_suggestions.call(context)
    expect(context.response, 'Expected API errors should remain available for display.').toBe(response)
    expect(context.loading_suggestions, 'A failed suggestion request must allow retrying.').toBe(false)
    expect(context.suggestions, 'Failed queries must not leave results for a previous domain.').toEqual([])
  })
})
