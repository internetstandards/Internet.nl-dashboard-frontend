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

  it('sends selected URL ids in the bulk tag request body', () => {
    const urls = [
      {id: 1425, tags: []},
      {id: 4750, tags: []},
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

    wrapper.vm.selectedItems = urls
    wrapper.vm.selected_tag = 'example-tag'
    wrapper.vm.add_tags()

    expect(http.post).toHaveBeenCalledWith('/api/v1/urllists/10/urls/tags', {
      url_ids: [1425, 4750],
      tag: 'example-tag',
    })
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

    wrapper.vm.selectedItems = urls
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
    nextTable.vm.selectedItems = nextUrls
    nextTable.vm.remove_urls()

    expect(nextTable.vm.deleteConfirmationVisible).toBe(false)
    expect(http.delete).toHaveBeenLastCalledWith('/api/v1/urllists/10/urls/9000')
  })
})
