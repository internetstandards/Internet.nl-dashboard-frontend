import {describe, expect, it, vi} from 'vitest'

import DomainTable from '@/components/domains/DomainTable.vue'
import UrlList from '@/components/domains/UrlList.vue'

vi.mock('@/httpclient', () => ({
  default: {
    delete: vi.fn(() => Promise.resolve()),
  },
}))

const maximumWarning = 'WARNING_DOMAINS_IN_LIST_EXCEED_MAXIMUM_ALLOWED'

describe('URL list warnings', () => {
  it('removes only the maximum-domain warning when the URL count is within the limit', () => {
    const context = {
      urls: [{}],
      maximum_domains: 1,
      list: {list_warnings: ['ANOTHER_WARNING', maximumWarning]},
    }

    UrlList.methods.update_list_warnings.call(context)

    expect(context.list.list_warnings).toEqual(['ANOTHER_WARNING'])
  })

  it('notifies the URL list after removing a domain locally', () => {
    const domain = {id: 42, url: 'example.nl'}
    const emit = vi.fn()
    const context = {
      urls: [domain],
      urllist: {id: 7},
      $emit: emit,
    }

    DomainTable.methods.remove_url.call(context, domain)

    expect(context.urls).toEqual([])
    expect(emit).toHaveBeenCalledWith('urls-changed')
  })
})
