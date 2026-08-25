import {shallowMount} from '@vue/test-utils'
import {describe, expect, it} from 'vitest'

import ScanMonitorScan from '@/components/scans/ScanMonitorScan.vue'

const createScan = (overrides = {}) => ({
  id: 1,
  state: 'requested',
  type: 'web',
  last_check: '2026-08-25T10:00:00Z',
  started_on: '2026-08-25T10:00:00Z',
  finished: false,
  finished_on: null,
  status_url: '',
  list_name: 'Example list',
  list_id: 1,
  runtime: 0,
  last_report_id: null,
  log: [],
  ...overrides,
})

const mountScan = (scan) => shallowMount(ScanMonitorScan, {
  props: {scan},
  global: {
    stubs: {
      RouterLink: true,
    },
    mocks: {
      $t: (key) => key,
      humanize_date: (date) => date,
      humanize_relative_date: (date) => date,
      humanize_duration: (duration) => duration,
    },
  },
})

describe('ScanMonitorScan', () => {
  it('uses the scan state when the scan log is empty', () => {
    const wrapper = mountScan(createScan())

    expect(wrapper.vm.current_scan_state).toBe('requested')
    expect(wrapper.vm.progress_bar).toEqual({percentage: 5, state: 'good'})
  })

  it('uses the latest log state when one is available', () => {
    const wrapper = mountScan(createScan({
      log: [{state: 'running scan', at_when: '2026-08-25T10:01:00Z'}],
    }))

    expect(wrapper.vm.current_scan_state).toBe('running scan')
    expect(wrapper.vm.progress_bar).toEqual({percentage: 25, state: 'good'})
  })
})
