import {shallowMount} from '@vue/test-utils'
import {beforeEach, describe, expect, it, vi} from 'vitest'

import DomainTable from '@/components/domains/DomainTable.vue'
import http from '@/httpclient'

vi.mock('@/httpclient', () => ({
  default: {
    delete: vi.fn(),
    post: vi.fn(),
  },
}))

describe('DomainTable', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
    vi.clearAllMocks()
  })

  it('adds a tag to each URL selected by its table primary key', () => {
    const urls = [
      {id: 1425, url: 'one.example', tags: []},
      {id: 4750, url: 'two.example', tags: []},
    ]
    const wrapper = shallowMount(DomainTable, {
      props: {
        urls,
        urllist: {id: 10},
      },
      global: {
        mocks: {
          $t: (key) => key,
        },
      },
    })

    wrapper.vm.selectedItems = urls.map((item) => item.url)
    wrapper.vm.selected_tag = 'example-tag'
    wrapper.vm.add_tags()

    expect(http.post).toHaveBeenCalledTimes(2)
    expect(http.post).toHaveBeenNthCalledWith(1, '/api/v1/urllists/10/urls/1425/tags', {
      tag: 'example-tag',
    })
    expect(http.post).toHaveBeenNthCalledWith(2, '/api/v1/urllists/10/urls/4750/tags', {
      tag: 'example-tag',
    })
    expect(urls.every((item) => item.tags.includes('example-tag'))).toBe(true)
  })

  it('removes a tag from each selected URL using the documented endpoint', () => {
    const urls = [
      {id: 1425, url: 'one.example', tags: ['example tag']},
      {id: 4750, url: 'two.example', tags: ['example tag']},
    ]
    const wrapper = shallowMount(DomainTable, {
      props: {
        urls,
        urllist: {id: 10},
      },
      global: {
        mocks: {
          $t: (key) => key,
        },
      },
    })

    wrapper.vm.selectedItems = urls.map((item) => item.url)
    wrapper.vm.selected_tag = 'example tag'
    wrapper.vm.remove_tags()

    expect(http.delete).toHaveBeenCalledTimes(2)
    expect(http.delete).toHaveBeenNthCalledWith(1, '/api/v1/urllists/10/urls/1425/tags/example%20tag')
    expect(http.delete).toHaveBeenNthCalledWith(2, '/api/v1/urllists/10/urls/4750/tags/example%20tag')
    expect(urls.every((item) => item.tags.length === 0)).toBe(true)
  })

  it('confirms bulk deletion and shares the one-hour setting for the list', () => {
    const now = 1_800_000_000_000
    vi.spyOn(Date, 'now').mockReturnValue(now)
    const urls = [
      {id: 1425, url: 'one.example', tags: []},
      {id: 4750, url: 'two.example', tags: []},
    ]
    const wrapper = shallowMount(DomainTable, {
      props: {
        urls,
        urllist: {id: 10, name: 'Example list'},
      },
      global: {
        mocks: {
          $t: (key) => key,
        },
      },
    })

    wrapper.vm.selectedItems = urls.map((item) => item.url)
    wrapper.vm.remove_urls()

    expect(wrapper.vm.deleteConfirmationVisible).toBe(true)
    expect(http.delete).not.toHaveBeenCalled()

    wrapper.vm.cancel_remove_urls()
    expect(wrapper.vm.deleteConfirmationVisible).toBe(false)
    expect(http.delete).not.toHaveBeenCalled()

    wrapper.vm.remove_urls()
    wrapper.vm.suppressDeleteConfirmation = true
    wrapper.vm.confirm_remove_urls()

    expect(http.delete).toHaveBeenCalledTimes(2)
    expect(http.delete).toHaveBeenNthCalledWith(1, '/api/v1/urllists/10/urls/1425')
    expect(http.delete).toHaveBeenNthCalledWith(2, '/api/v1/urllists/10/urls/4750')
    expect(localStorage.getItem(
      'internetnl:domain-delete-confirmation-suppressed-until:list:10',
    )).toBe(String(now + 60 * 60 * 1000))

    const nextUrls = [{id: 9000, url: 'three.example', tags: []}]
    const nextTable = shallowMount(DomainTable, {
      props: {
        urls: nextUrls,
        urllist: {id: 10, name: 'Example list'},
      },
      global: {
        mocks: {
          $t: (key) => key,
        },
      },
    })
    nextTable.vm.selectedItems = nextUrls.map((item) => item.url)
    nextTable.vm.remove_urls()

    expect(nextTable.vm.deleteConfirmationVisible).toBe(false)
    expect(http.delete).toHaveBeenLastCalledWith('/api/v1/urllists/10/urls/9000')
  })
})
