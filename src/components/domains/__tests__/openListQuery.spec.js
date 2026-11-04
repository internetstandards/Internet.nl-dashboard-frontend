import {afterEach, describe, expect, it, vi} from 'vitest'
import {flushPromises, shallowMount} from '@vue/test-utils'
import {createPinia} from 'pinia'

import DomainListManager from '@/components/domains/DomainListManager.vue'
import UrlList from '@/components/domains/UrlList.vue'
import http from '@/httpclient'
import {hasOpenListQuery, parseOpenListIds} from '@/components/domains/openListQuery'

vi.mock('@/httpclient', () => ({
  default: {
    get: vi.fn(() => Promise.resolve({
      data: {lists: [], maximum_domains_per_list: 10000},
    })),
  },
}))

describe('domain list open command', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('treats an absent or empty open query as no command', () => {
    expect(hasOpenListQuery({})).toBe(false)
    expect(hasOpenListQuery({open: ''})).toBe(true)
    expect(parseOpenListIds({})).toEqual([])
    expect(parseOpenListIds({open: ''})).toEqual([])
  })

  it('accepts repeated and comma-separated list ids without duplicates', () => {
    expect(parseOpenListIds({open: ['123', '234,345', '123', 'invalid']})).toEqual([
      '123',
      '234',
      '345',
    ])
  })

  it('passes an open command only to matching lists', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => {})
    const wrapper = shallowMount(DomainListManager, {
      global: {
        plugins: [createPinia()],
        stubs: {RouterLink: true},
        mocks: {
          $route: {name: 'domains', query: {open: '123'}, hash: '#123'},
          $t: (key) => key,
        },
      },
    })
    await flushPromises()
    await wrapper.setData({
      lists: [
        {id: 123, list_warnings: []},
        {id: 234, list_warnings: []},
      ],
    })

    const urlLists = wrapper.findAllComponents(UrlList)
    expect(urlLists.map((urlList) => urlList.props('open_requested'))).toEqual([true, false])
  })

  it('ignores open commands belonging to another kept-alive route', () => {
    const context = {$route: {name: 'unrelated-route', query: {open: '123'}}}

    expect(DomainListManager.computed.requested_open_list_ids.call(context)).toEqual([])
  })

  it('acts only when a list receives a matching command', () => {
    const applyOpenRequest = vi.fn()
    const context = {apply_open_request: applyOpenRequest}

    UrlList.watch.open_requested.call(context, false)
    expect(applyOpenRequest).not.toHaveBeenCalled()

    UrlList.watch.open_requested.call(context, true)
    expect(applyOpenRequest).toHaveBeenCalledOnce()
  })

  it('opens a requested list without resetting existing open state', () => {
    const getUrls = vi.fn()
    const requestedList = {is_opened: false, get_urls: getUrls}
    const alreadyOpenList = {is_opened: true, get_urls: vi.fn()}

    UrlList.methods.open_list.call(requestedList)
    UrlList.methods.open_list.call(alreadyOpenList)

    expect(requestedList.is_opened).toBe(true)
    expect(getUrls).toHaveBeenCalledOnce()
    expect(alreadyOpenList.is_opened).toBe(true)
    expect(alreadyOpenList.get_urls).not.toHaveBeenCalled()
  })
})


describe('domain list refresh after imports', () => {
  it.each([true, false])('keeps existing domains until refresh finishes with background=%s', async background => {
    const original = [{id: 1, url: 'existing.nl'}]
    const context = {list: {id: 7}, urls: original, loading: false, update_list_warnings: vi.fn()}
    let finish
    http.get.mockImplementationOnce(() => new Promise(resolve => {finish = resolve}))
    const request = UrlList.methods.get_urls.call(context, background)
    expect(context.loading).toBe(!background)
    expect(context.urls).toBe(original)
    finish({data: {urls: [...original, {id: 2, url: 'added.nl'}]}})
    await request
    expect(context.loading).toBe(false)
    expect(context.urls.map(item => item.url)).toEqual(['existing.nl', 'added.nl'])
    expect(context.update_list_warnings).toHaveBeenCalledOnce()
  })

  it('clears the foreground loading state if fetching domains fails', async () => {
    const context = {list: {id: 7}, urls: [{url: 'existing.nl'}], loading: false}
    http.get.mockRejectedValueOnce(new Error('Network unavailable'))
    await expect(UrlList.methods.get_urls.call(context)).rejects.toThrow('Network unavailable')
    expect(context.loading).toBe(false)
    expect(context.urls).toEqual([{url: 'existing.nl'}])
  })
})
