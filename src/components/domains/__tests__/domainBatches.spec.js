import {flushPromises, mount} from '@vue/test-utils'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import DomainBatchProgress from '../DomainBatchProgress.vue'
import DomainBatchForm from '../DomainBatchForm.vue'
import DomainBatchHistory from '../DomainBatchHistory.vue'
import http from '@/httpclient'

vi.mock('@/httpclient', () => ({default: {get: vi.fn(), post: vi.fn(), delete: vi.fn()}}))

const batch = (updates = {}) => ({id: 42, filename: 'domains.csv', stage: 'validation', status: 'queued',
  processed: 0, total: 3, counts: {}, limits: [], resumable: false, ...updates})
const global = {mocks: {$i18n: {locale: 'en'}, $t: (key, values = []) => `${key} ${values.join(' ')}`},
  stubs: {'server-response': {props: ['response'], template: '<p role="alert">{{ response.data.detail }}</p>'}}}

beforeEach(() => {vi.useFakeTimers(); vi.resetAllMocks()})
afterEach(() => {vi.useRealTimers()})

describe('domain batch progress', () => {
  it('polls actual work and waits for completed additions before announcing success', async () => {
    let current = batch()
    http.get.mockImplementation(url => Promise.resolve({data: url.endsWith('/rejections') ? [] : current}))
    const wrapper = mount(DomainBatchProgress, {props: {batch: current}, global})
    await flushPromises()
    expect(wrapper.get('[role=progressbar]').attributes('aria-valuenow')).toBeUndefined()
    expect(wrapper.find('.batch-counts').exists()).toBe(false)
    current = batch({status: 'review', processed: 3, counts: {valid: 2, invalid: 1}})
    await vi.advanceTimersByTimeAsync(1500)
    await flushPromises()
    expect(wrapper.find('[role=progressbar]').exists()).toBe(false)
    expect(wrapper.emitted('completed')).toBeUndefined()
    expect(wrapper.text()).toContain('domain.batch.confirm')
    current = batch({stage: 'addition', status: 'queued', processed: 0, total: 2, counts: {valid: 2}})
    http.post.mockResolvedValue({data: current})
    await wrapper.findAll('button').find(button => button.text().includes('domain.batch.confirm')).trigger('click')
    await flushPromises()
    expect(http.post).toHaveBeenCalledWith('/api/v1/urllists/domain-batches/42/confirm', {})
    expect(wrapper.get('[role=progressbar]').attributes('aria-valuenow')).toBeUndefined()
    expect(wrapper.emitted('completed')).toBeUndefined()
    current = batch({stage: 'addition', status: 'completed', processed: 2, total: 2, counts: {added: 1, unresolvable: 1}})
    await vi.advanceTimersByTimeAsync(1500)
    await flushPromises()
    expect(wrapper.emitted('completed')).toHaveLength(1)
    expect(wrapper.text()).toContain('domain.batch.finished 1')
    expect(wrapper.find('[role=progressbar]').exists()).toBe(false)
    const requests = http.get.mock.calls.length
    await vi.advanceTimersByTimeAsync(6000)
    expect(http.get.mock.calls).toHaveLength(requests)
    wrapper.unmount()
  })

  it('preserves editable rejection feedback and sends corrections using row identifiers', async () => {
    const current = batch({status: 'review', processed: 3, counts: {valid: 1, invalid: 2},
      limits: [{name: 'List', new: 1, available: 0, over_limit: 1}]})
    const items = [{id: 10, row: 2, list_name: 'List', raw_domain: 'broken', reason: 'Invalid domain'},
      {id: 11, row: 3, list_name: 'List', raw_domain: 'bad', reason: 'Invalid domain'}]
    http.get.mockImplementation(url => Promise.resolve({data: url.endsWith('/rejections') ? items : current}))
    const wrapper = mount(DomainBatchProgress, {props: {batch: current}, global})
    await flushPromises()
    expect(wrapper.text()).toContain('domain.batch.limit List 1 0 1')
    expect(wrapper.findAll('[data-domain]')).toHaveLength(2)
    await wrapper.findAll('[data-domain]')[0].setValue('corrected.nl')
    const clear = wrapper.get('button[aria-label="domain.batch.clearRow 3"]')
    await clear.trigger('click')
    expect(wrapper.findAll('[data-domain]')[1].element.value).toBe('')
    expect(clear.element.disabled).toBe(true)
    http.post.mockResolvedValue({data: batch()})
    http.get.mockResolvedValue({data: batch()})
    await wrapper.findAll('button').find(button => button.text().includes('domain.batch.checkCorrections')).trigger('click')
    await flushPromises()
    expect(http.post).toHaveBeenCalledWith('/api/v1/urllists/domain-batches/42/corrections',
      {corrections: [{id: 10, value: 'corrected.nl'}, {id: 11, value: ''}]})
    expect(wrapper.findAll('[data-domain]')).toHaveLength(0)
    wrapper.unmount()
  })

  it('retains progress on a network failure, retries polling and stops after unmounting', async () => {
    http.get.mockRejectedValueOnce(new Error('offline')).mockResolvedValue({data: batch()})
    const wrapper = mount(DomainBatchProgress, {props: {batch: batch()}, global})
    await flushPromises()
    expect(wrapper.get('[role="alert"]').text()).toContain('Unable to contact the server.')
    await vi.advanceTimersByTimeAsync(1500)
    expect(http.get).toHaveBeenCalledTimes(2)
    wrapper.unmount()
    await vi.advanceTimersByTimeAsync(3000)
    expect(http.get).toHaveBeenCalledTimes(2)
  })
})

describe('import detail loading', () => {
  it.each(['completed', 'cancelled'])('opening a previously %s import does not announce a new change', async status => {
    const current = batch({status, counts: {added: 2}, processed: 2})
    http.get.mockImplementation(url => Promise.resolve({data: url.endsWith('/rejections') ? [] : current}))
    const wrapper = mount(DomainBatchProgress, {props: {batch: current}, global})
    await flushPromises()
    expect(wrapper.emitted('completed')).toBeUndefined()
    expect(wrapper.emitted('cancelled')).toBeUndefined()
    expect(wrapper.find('.batch-loading').exists()).toBe(false)
    wrapper.unmount()
  })

  it('loads details and rejected rows inside one history entry without refreshing its surrounding list', async () => {
    const first = batch({status: 'completed', counts: {added: 2, invalid: 1}})
    const second = batch({id: 43, filename: 'other.csv', status: 'review', counts: {valid: 1}})
    let resolveDetail, resolveFeedback
    http.get.mockImplementation(url => {
      if (url === '/api/v1/urllists/domain-batches') return Promise.resolve({data: [first, second]})
      return new Promise(resolve => {
        if (url.endsWith('/rejections')) resolveFeedback = resolve
        else resolveDetail = resolve
      })
    })
    const wrapper = mount(DomainBatchHistory, {global})
    await flushPromises()
    const entries = wrapper.findAll('details')
    entries[0].element.open = true
    await entries[0].trigger('toggle')
    await flushPromises()
    expect(entries[0].find('.batch-loading').exists()).toBe(true)
    expect(entries[1].find('.batch-loading').exists()).toBe(false)
    expect(entries[1].text()).toContain('other.csv')
    resolveDetail({data: first})
    await flushPromises()
    expect(entries[0].find('.batch-loading').exists()).toBe(true)
    resolveFeedback({data: [{id: 10, row: 2, list_name: 'List', raw_domain: 'broken', reason: 'Invalid domain'}]})
    await flushPromises()
    expect(entries[0].find('.batch-loading').exists()).toBe(false)
    expect(entries[0].findAll('[data-domain]')).toHaveLength(1)
    expect(wrapper.emitted('added')).toBeUndefined()
    wrapper.unmount()
  })
})

describe('pending imports in a domain list', () => {
  it.each([null, 7])('filters finished imports only when a list context is supplied (%s)', async listId => {
    const statuses = ['queued', 'running', 'review', 'failed', 'completed', 'cancelled']
    const entries = statuses.map((status, index) => batch({id: index + 1, status, filename: `${status}.csv`}))
    http.get.mockResolvedValue({data: entries})
    const wrapper = mount(DomainBatchHistory, {props: {listId}, global})
    await flushPromises()
    expect(wrapper.get('h4').text()).toContain(listId ? 'domain.batch.pending' : 'domain.batch.recent')
    expect(wrapper.findAll('summary .batch-filename').map(item => item.text())).toEqual(
      (listId ? statuses.slice(0, 4) : statuses).map(status => `${status}.csv`))
    expect(http.get).toHaveBeenCalledWith('/api/v1/urllists/domain-batches', {
      params: {urllistId: listId || undefined, pendingOnly: listId ? true : undefined},
    })
    wrapper.unmount()
  })
})

describe('domain import feedback layout', () => {
  it('shows review results, rejected rows and final actions without an idle progress bar', async () => {
    const current = batch({status: 'review', processed: 3, counts: {valid: 2, invalid: 1}})
    const item = {id: 10, row: 2, list_name: 'List', raw_domain: 'broken', reason: 'Invalid domain'}
    http.get.mockImplementation(url => Promise.resolve({data: url.endsWith('/rejections') ? [item] : current}))
    const wrapper = mount(DomainBatchProgress, {props: {batch: current}, global})
    await flushPromises()
    expect(wrapper.find('[role=progressbar]').exists()).toBe(false)
    expect(wrapper.findAll('.batch-counts > li').map(item => item.text())).toEqual(['domain.batch.valid 2', 'domain.batch.rejected 1'])
    const order = ['.batch-counts', 'table', '.batch-actions']
      .map(selector => wrapper.get(selector).element)
    for (let index = 1; index < order.length; index++) {
      expect(order[index - 1].compareDocumentPosition(order[index]) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    }
    const actions = wrapper.get('.batch-actions')
    expect(actions.text()).toContain('domain.batch.cancel')
    expect(actions.text()).toContain('domain.batch.confirm')
    const cancel = actions.findAll('button').find(button => button.text().includes('domain.batch.cancel'))
    expect(cancel.classes()).toContain('btn-danger')
    expect(cancel.element.nextElementSibling.textContent).toContain('domain.batch.confirm')
    expect(wrapper.text()).not.toContain('domain.batch.review')
    expect(wrapper.text()).not.toContain('domain.batch.stage.validation')
    wrapper.unmount()
  })

  it.each([1, 50])('hides pagination when %i rejected domains fit on a single page', async count => {
    const current = batch({status: 'review', counts: {invalid: count}})
    const items = Array.from({length: count}, (_, index) => ({id: index + 1, row: index + 2,
      list_name: 'List', raw_domain: `broken${index}`, reason: 'Invalid domain'}))
    http.get.mockImplementation(url => Promise.resolve({data: url.endsWith('/rejections') ? items : current}))
    const wrapper = mount(DomainBatchProgress, {props: {batch: current}, global})
    await flushPromises()
    expect(wrapper.findAll('[data-domain]')).toHaveLength(count)
    expect(wrapper.find('.batch-pagination').exists()).toBe(false)
    wrapper.unmount()
  })

  it('pages and filters more than ten thousand rejected domains without additional API requests', async () => {
    const current = batch({status: 'review', counts: {invalid: 10001}})
    const items = Array.from({length: 10001}, (_, index) => ({id: index + 1, row: index + 2,
      list_name: 'List', raw_domain: `broken${index}`, reason: 'Invalid domain'}))
    http.get.mockImplementation(url => Promise.resolve({data: url.endsWith('/rejections') ? items : current}))
    const wrapper = mount(DomainBatchProgress, {props: {batch: current}, global})
    await flushPromises()
    expect(http.get).toHaveBeenCalledWith('/api/v1/urllists/domain-batches/42/rejections')
    const requests = http.get.mock.calls.length
    expect(wrapper.findAll('[data-domain]')).toHaveLength(50)
    expect(wrapper.get('.batch-pagination').text()).toContain('1–50 / 10001')
    await wrapper.get('.batch-pagination').findAll('button')[1].trigger('click')
    expect(wrapper.get('.batch-pagination').text()).toContain('51–100 / 10001')
    const search = wrapper.get('input[type=search]')
    await search.setValue(' BROKEN10000 ')
    expect(wrapper.findAll('[data-domain]').map(input => input.element.value)).toEqual(['broken10000'])
    expect(wrapper.text()).toContain('domain.batch.filterMatches 1 10001')
    expect(wrapper.find('.batch-pagination').exists()).toBe(false)
    await search.setValue('missing')
    expect(wrapper.find('table').exists()).toBe(false)
    expect(wrapper.text()).toContain('domain.batch.filterMatches 0 10001')
    expect(search.exists()).toBe(true)
    await wrapper.findAll('button').find(button => button.text().includes('domain.batch.clearFilter')).trigger('click')
    expect(search.element.value).toBe('')
    expect(wrapper.get('.batch-pagination').text()).toContain('1–50 / 10001')
    expect(http.get).toHaveBeenCalledTimes(requests)
    wrapper.unmount()
  })

  it.each(['normalized.nl', 'Feedback list', '72', 'No DNS records'])(
    'filters the local feedback columns using %s', async query => {
      const current = batch({status: 'review', counts: {invalid: 2}})
      const items = [{id: 10, row: 2, list_name: 'Other', raw_domain: 'bad', domain: '', reason: 'Invalid'},
        {id: 11, row: 72, list_name: 'Feedback list', raw_domain: 'broken', domain: 'normalized.nl', reason: 'No DNS records'}]
      http.get.mockImplementation(url => Promise.resolve({data: url.endsWith('/rejections') ? items : current}))
      const wrapper = mount(DomainBatchProgress, {props: {batch: current}, global})
      await flushPromises()
      const requests = http.get.mock.calls.length
      await wrapper.get('input[type=search]').setValue(query)
      expect(wrapper.findAll('[data-domain]').map(input => input.element.value)).toEqual(['broken'])
      expect(http.get).toHaveBeenCalledTimes(requests)
      wrapper.unmount()
    })

  it('retains corrections across local pages and filters and submits hidden edits together', async () => {
    const current = batch({status: 'review', counts: {invalid: 101}})
    const items = Array.from({length: 101}, (_, index) => ({id: index + 1, row: index + 2,
      list_name: 'List', raw_domain: `broken${index}`, reason: 'Invalid domain'}))
    http.get.mockImplementation(url => Promise.resolve({data: url.endsWith('/rejections') ? items : current}))
    const wrapper = mount(DomainBatchProgress, {props: {batch: current}, global})
    await flushPromises()
    const requests = http.get.mock.calls.length
    await wrapper.get('[data-domain]').setValue('first.nl')
    await wrapper.get('.batch-pagination').findAll('button')[1].trigger('click')
    expect(wrapper.get('.batch-pagination').text()).toContain('51–100 / 101')
    await wrapper.get('[data-domain]').setValue('second.nl')
    const search = wrapper.get('input[type=search]')
    expect(search.element.disabled).toBe(false)
    await search.setValue('broken100')
    await wrapper.get('[data-domain]').setValue('last.nl')
    await wrapper.findAll('button').find(button => button.text().includes('domain.batch.clearFilter')).trigger('click')
    expect(wrapper.get('[data-domain]').element.value).toBe('first.nl')
    expect(http.get).toHaveBeenCalledTimes(requests)
    http.post.mockResolvedValue({data: batch()})
    http.get.mockResolvedValue({data: batch()})
    await wrapper.findAll('button').find(button => button.text().includes('domain.batch.checkCorrections')).trigger('click')
    await flushPromises()
    expect(http.post).toHaveBeenCalledWith('/api/v1/urllists/domain-batches/42/corrections', {
      corrections: [{id: 1, value: 'first.nl'}, {id: 51, value: 'second.nl'}, {id: 101, value: 'last.nl'}],
    })
    wrapper.unmount()
  })

  it('keeps the counter inside the progress track at one percent', async () => {
    const current = batch({status: 'running', total: 100, processed: 1})
    http.get.mockResolvedValue({data: current})
    const wrapper = mount(DomainBatchProgress, {props: {batch: current}, global})
    await flushPromises()
    expect(wrapper.get('[role=progressbar]').text()).toBe('1 / 100')
    expect(wrapper.get('.progress-bar').attributes('style')).toContain('width: 1%')
    expect(wrapper.get('[role=progressbar]').attributes('aria-valuenow')).toBe('1')
    wrapper.unmount()
  })
})

describe('domain batch form', () => {
  it('submits more than ten thousand text domains and preserves input after a queue failure', async () => {
    const wrapper = mount(DomainBatchForm, {props: {list: {id: 7}}, global})
    const input = Array.from({length: 10001}, (_, index) => `d${index}.example.nl`).join('\n')
    await wrapper.get('textarea').setValue(input)
    expect(wrapper.get('button').attributes('disabled')).toBeUndefined()
    http.post.mockRejectedValue({response: {status: 503, data: {detail: 'Queue unavailable'}}})
    await wrapper.get('form').trigger('submit')
    await flushPromises()
    expect(http.post.mock.calls[0][1].raw_urls).toBe(input)
    expect(wrapper.get('textarea').element.value).toBe(input)
    expect(wrapper.get('[role="alert"]').text()).toContain('Queue unavailable')
    expect(wrapper.emitted('added')).toBeUndefined()
    wrapper.unmount()
  })
})

describe('spreadsheet input interactions', () => {
  it.each(['picker', 'drop'])('submits the actual File selected through %s as the file form field', async method => {
    const wrapper = mount(DomainBatchForm, {props: {mode: 'spreadsheet'}, global})
    const file = new File([new Uint8Array([80, 75, 3, 4])], 'example.xlsx',
      {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
    expect(wrapper.get('button[type="submit"]').attributes('disabled')).toBeDefined()
    if (method === 'picker') {
      const input = wrapper.get('input[type="file"]')
      Object.defineProperty(input.element, 'files', {value: [file]})
      await input.trigger('change')
    } else {
      await wrapper.get('form').trigger('drop', {dataTransfer: {files: [file]}})
    }
    expect(wrapper.get('button[type="submit"]').attributes('disabled')).toBeUndefined()
    http.post.mockRejectedValue({response: {status: 503, data: {detail: 'Queue unavailable'}}})
    await wrapper.get('form').trigger('submit')
    await flushPromises()
    const [url, payload] = http.post.mock.calls[0]
    expect(url).toBe('/api/v1/urllists/import-spreadsheets')
    expect(payload).toBeInstanceOf(FormData)
    expect(payload.get('file')).toBe(file)
    expect(wrapper.vm.file).toBe(file)
    expect(wrapper.text()).toContain('example.xlsx')
    expect(wrapper.get('[role="alert"]').text()).toContain('Queue unavailable')
    wrapper.unmount()
  })

  it('does not send a missing file when a form submit occurs without a selection', async () => {
    const wrapper = mount(DomainBatchForm, {props: {mode: 'spreadsheet'}, global})
    await wrapper.get('form').trigger('submit')
    expect(http.post).not.toHaveBeenCalled()
    wrapper.unmount()
  })
})

describe('instant spreadsheet uploads', () => {
  it.each(['picker', 'drop'])('starts the multipart request immediately on %s without submitting the form', async method => {
    const wrapper = mount(DomainBatchForm, {attachTo: document.body, props: {mode: 'spreadsheet', autoUpload: true}, global})
    const file = new File(['spreadsheet'], 'example.xlsx')
    http.post.mockRejectedValue({response: {status: 503, data: {detail: 'Queue unavailable'}}})
    expect(wrapper.find('.spreadsheet-drop-zone').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').exists()).toBe(false)
    expect(wrapper.get('input[type="file"]').attributes('hidden')).toBeDefined()
    if (method === 'picker') {
      const input = wrapper.get('input[type="file"]')
      Object.defineProperty(input.element, 'files', {value: [file]})
      await input.trigger('change')
    } else {
      await wrapper.get('.spreadsheet-drop-zone').trigger('dragenter')
      expect(wrapper.get('.spreadsheet-drop-zone').classes()).toContain('is-dragging')
      await wrapper.get('.spreadsheet-drop-zone').trigger('drop', {dataTransfer: {files: [file]}})
      expect(wrapper.get('.spreadsheet-drop-zone').classes()).not.toContain('is-dragging')
    }
    await flushPromises()
    expect(http.post).toHaveBeenCalledTimes(1)
    expect(http.post.mock.calls[0][1].get('file')).toBe(file)
    expect(wrapper.vm.file).toBe(file)
    expect(wrapper.get('[role="alert"]').text()).toContain('Queue unavailable')
    await wrapper.get('button[type="submit"]').trigger('click')
    await flushPromises()
    expect(http.post).toHaveBeenCalledTimes(2)
    expect(http.post.mock.calls[1][1].get('file')).toBe(file)
    wrapper.unmount()
  })

  it('keeps the active upload intact when another file is dropped', async () => {
    const wrapper = mount(DomainBatchForm, {attachTo: document.body, props: {mode: 'spreadsheet', autoUpload: true}, global})
    let rejectUpload
    http.post.mockReturnValue(new Promise((resolve, reject) => {rejectUpload = reject}))
    const file = new File(['first'], 'first.xlsx')
    await wrapper.get('.spreadsheet-drop-zone').trigger('drop', {dataTransfer: {files: [file]}})
    expect(wrapper.get('.spreadsheet-drop-zone').attributes('disabled')).toBeDefined()
    await wrapper.get('.spreadsheet-drop-zone').trigger('drop', {dataTransfer: {files: [new File(['next'], 'next.xlsx')]}})
    expect(http.post).toHaveBeenCalledTimes(1)
    expect(wrapper.vm.file).toBe(file)
    rejectUpload(new Error('offline'))
    await flushPromises()
    expect(wrapper.get('.spreadsheet-drop-zone').attributes('disabled')).toBeUndefined()
    wrapper.unmount()
  })

  it('ignores an empty file selection or a drop containing no files', async () => {
    const wrapper = mount(DomainBatchForm, {attachTo: document.body, props: {mode: 'spreadsheet', autoUpload: true}, global})
    await wrapper.get('input[type="file"]').trigger('change')
    await wrapper.get('.spreadsheet-drop-zone').trigger('drop', {dataTransfer: {files: []}})
    expect(http.post).not.toHaveBeenCalled()
    wrapper.unmount()
  })
})

describe('cancelling domain imports', () => {
  it.each(['queued', 'running', 'review', 'failed'])('cancels %s work, reports partial additions and stops polling', async status => {
    let current = batch({status, stage: 'addition', processed: 1, counts: {added: 1, valid: 2}, resumable: status === 'failed'})
    http.get.mockImplementation(url => Promise.resolve({data: url.endsWith('/rejections') ? [] : current}))
    http.delete.mockImplementation(async () => {
      current = {...current, status: 'cancelled', resumable: false}
      return {status: 204, data: ''}
    })
    const wrapper = mount(DomainBatchProgress, {props: {batch: current}, global})
    await flushPromises()
    await wrapper.findAll('button').find(button => button.text().includes('domain.batch.cancel')).trigger('click')
    await flushPromises()
    expect(http.delete).toHaveBeenCalledWith('/api/v1/urllists/domain-batches/42')
    expect(wrapper.text()).toContain('domain.batch.cancelled 1')
    expect(wrapper.emitted('cancelled')).toHaveLength(1)
    expect(wrapper.emitted('completed')).toBeUndefined()
    expect(wrapper.findAll('button').some(button => button.text().includes('domain.batch.cancel'))).toBe(false)
    const calls = http.get.mock.calls.length
    await vi.advanceTimersByTimeAsync(6000)
    expect(http.get).toHaveBeenCalledTimes(calls)
    wrapper.unmount()
  })

  it('ignores a progress response started before cancellation', async () => {
    const running = batch({status: 'running'})
    let resolveOld
    http.get.mockResolvedValueOnce({data: running})
      .mockImplementationOnce(() => new Promise(resolve => {resolveOld = resolve}))
      .mockResolvedValue({data: batch({status: 'cancelled'})})
    http.delete.mockResolvedValue({status: 204, data: ''})
    const wrapper = mount(DomainBatchProgress, {props: {batch: running}, global})
    await flushPromises()
    const outdated = wrapper.vm.refresh()
    await wrapper.vm.action('cancel')
    resolveOld({data: running})
    await outdated
    expect(wrapper.vm.current.status).toBe('cancelled')
    expect(wrapper.emitted('cancelled')).toHaveLength(1)
    const calls = http.get.mock.calls.length
    await vi.advanceTimersByTimeAsync(3000)
    expect(http.get).toHaveBeenCalledTimes(calls)
    wrapper.unmount()
  })

  it('keeps polling after a failed cancellation instead of pretending the import stopped', async () => {
    let current = batch({status: 'running'})
    http.get.mockImplementation(url => Promise.resolve({data: url.endsWith('/rejections') ? [] : current}))
    http.delete.mockRejectedValue({response: {status: 503, data: {detail: 'Unavailable'}}})
    const wrapper = mount(DomainBatchProgress, {props: {batch: current}, global})
    await flushPromises()
    await wrapper.vm.action('cancel')
    expect(wrapper.vm.current.status).toBe('running')
    expect(wrapper.emitted('cancelled')).toBeUndefined()
    current = batch({status: 'completed', counts: {added: 3}, processed: 3})
    await vi.advanceTimersByTimeAsync(1500)
    await flushPromises()
    expect(wrapper.emitted('completed')).toHaveLength(1)
    wrapper.unmount()
  })
})

describe('explicit list overwrite', () => {
  it.each([['en', 'overwrite'], ['nl', 'overschrijven']])('requires the switch and the typed %s word, and deactivates with one click', async (locale, word) => {
    let current = batch({status: 'review', source: 'spreadsheet', target_list: true,
      counts: {valid: 2, existing: 1}, processed: 3})
    http.get.mockImplementation(url => Promise.resolve({data: url.endsWith('/rejections') ? [] : current}))
    http.post.mockImplementation(async () => {
      current = batch({stage: 'addition', status: 'queued'})
      return {data: current}
    })
    const wrapper = mount(DomainBatchProgress, {props: {batch: current},
      global: {...global, mocks: {...global.mocks, $i18n: {locale}}}})
    await flushPromises()
    const toggle = wrapper.get('[role=switch]')
    await toggle.setValue(true)
    await wrapper.vm.action('confirm')
    expect(http.post).not.toHaveBeenCalled()
    await wrapper.get('input[type=text]').setValue('wrong')
    expect(wrapper.vm.overwriteEnabled).toBe(false)
    await wrapper.get('input[type=text]').setValue(word)
    expect(wrapper.vm.overwriteEnabled).toBe(true)
    await toggle.setValue(false)
    expect(wrapper.vm.overwriteConfirmation).toBe('')
    expect(wrapper.find('input[type=text]').exists()).toBe(false)
    await toggle.setValue(true)
    expect(wrapper.vm.overwriteEnabled).toBe(false)
    await wrapper.get('input[type=text]').setValue(word)
    await wrapper.vm.action('confirm')
    expect(http.post).toHaveBeenCalledWith('/api/v1/urllists/domain-batches/42/confirm', {overwrite: true, confirmation: word})
    expect(wrapper.vm.overwriteRequested).toBe(false)
    expect(wrapper.vm.overwriteConfirmation).toBe('')
    wrapper.unmount()
  })

  it('adds corrections to a processed spreadsheet without offering a partial replacement', async () => {
    const current = batch({status: 'review', source: 'spreadsheet', target_list: true,
      counts: {added: 1, valid: 1}})
    http.get.mockImplementation(url => Promise.resolve({data: url.endsWith('/rejections') ? [] : current}))
    http.post.mockResolvedValue({data: batch({status: 'queued', stage: 'addition'})})
    const wrapper = mount(DomainBatchProgress, {props: {batch: current}, global})
    await flushPromises()
    expect(wrapper.find('[role=switch]').exists()).toBe(false)
    await wrapper.vm.action('confirm')
    expect(http.post).toHaveBeenCalledWith('/api/v1/urllists/domain-batches/42/confirm', {})
    wrapper.unmount()
  })

  it('keeps overwrite imports active with a waiting bar until prepared domains are saved', async () => {
    let current = batch({stage: 'addition', status: 'running', overwrite: true,
      total: 3, processed: 2, counts: {prepared: 2, valid: 1}})
    http.get.mockImplementation(url => Promise.resolve({data: url.endsWith('/rejections') ? [] : current}))
    const wrapper = mount(DomainBatchProgress, {props: {batch: current}, global})
    await flushPromises()
    expect(Number(wrapper.get('[role=progressbar]').attributes('aria-valuenow'))).toBeCloseTo(66.67, 1)
    current = batch({...current, processed: 3, counts: {prepared: 3}})
    await vi.advanceTimersByTimeAsync(1500)
    await flushPromises()
    expect(wrapper.vm.current.status).toBe('running')
    expect(wrapper.get('[role=progressbar]').attributes('aria-valuenow')).toBeUndefined()
    expect(wrapper.get('[role=progressbar]').text()).toContain('domain.batch.savingReplacement')
    expect(wrapper.get('[role=progressbar]').classes()).toContain('is-waiting')
    expect(wrapper.emitted('completed')).toBeUndefined()
    current = batch({...current, status: 'completed', counts: {added: 3}})
    await vi.advanceTimersByTimeAsync(1500)
    await flushPromises()
    expect(wrapper.find('[role=progressbar]').exists()).toBe(false)
    expect(wrapper.emitted('completed')).toHaveLength(1)
    wrapper.unmount()
  })

  it('uses a stationary full-width diagonal stripe for indeterminate progress and a percentage for real progress', async () => {
    let current = batch({status: 'queued', total: 0})
    http.get.mockImplementation(() => Promise.resolve({data: current}))
    const wrapper = mount(DomainBatchProgress, {props: {batch: current}, global})
    await flushPromises()
    expect(wrapper.get('[role=progressbar]').classes()).toContain('is-waiting')
    expect(wrapper.get('[role=progressbar]').attributes('aria-valuenow')).toBeUndefined()
    expect(wrapper.get('.batch-progress-fill').attributes('style')).toContain('width: 100%')
    current = batch({status: 'running', total: 4, processed: 1})
    await vi.advanceTimersByTimeAsync(1500)
    expect(wrapper.get('[role=progressbar]').classes()).not.toContain('is-waiting')
    expect(wrapper.get('[role=progressbar]').attributes('aria-valuenow')).toBe('25')
    wrapper.unmount()
  })
})
