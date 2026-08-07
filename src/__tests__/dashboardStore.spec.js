import {createPinia, setActivePinia} from 'pinia'
import {beforeEach, describe, expect, it} from 'vitest'

import {dashboardStore} from '@/dashboardStore'

describe('dashboardStore scan monitor', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('counts only scans that are still active', () => {
    const store = dashboardStore()

    store.update_scan_monitor_data([
      {state: 'requested', finished: false},
      {state: 'running scan', finished: false},
      {state: 'timeout', finished: false},
      {state: 'finished', finished: true},
      {state: 'cancelled', finished: false},
      {state: 'error_contacting_api', finished: false},
      {state: 'network_error', finished: false},
      {state: 'running scan', finished: true},
    ])

    expect(store.active_scan_count).toBe(3)
  })
})
