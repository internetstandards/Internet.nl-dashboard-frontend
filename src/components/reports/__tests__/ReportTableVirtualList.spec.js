import {describe, expect, it, vi} from 'vitest'

import ReportTableVirtualList from '@/components/reports/ReportTableVirtualList.vue'

describe('ReportTableVirtualList URL filtering', () => {
  it('lowercases mixed-case search input before comparing backend URLs', () => {
    const matchingUrl = {url: 'www.mixedcase.example'}
    const context = {
      original_urls: [matchingUrl, {url: 'unrelated.example'}],
      filtered_urls: [],
      order_urls: vi.fn((urls) => urls)
    }

    ReportTableVirtualList.methods.filter_urls.call(context, 'mIxEdCaSe')

    expect(context.filtered_urls).toEqual([matchingUrl])
  })
})
