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
})
