import {beforeEach, describe, expect, it, vi} from 'vitest'

import SwitchAccount from '@/components/admin/SwitchAccount.vue'
import http from '@/httpclient'

vi.mock('@/httpclient', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

describe('SwitchAccount', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows up to 50 accounts per page', () => {
    expect(SwitchAccount.data().perPage).toBe(50)
  })

  it('updates pagination after filtering', () => {
    const context = {totalRows: 100, currentPage: 2}

    SwitchAccount.methods.onFiltered.call(context, [{id: 10}, {id: 20}])

    expect(context.totalRows).toBe(2)
    expect(context.currentPage).toBe(1)
  })

  it('reacts when the table selected-items model changes', () => {
    const onSelectedItemsChanged = vi.fn()
    const selectedRows = [20]

    SwitchAccount.watch.selected_items.call({onSelectedItemsChanged}, selectedRows)

    expect(onSelectedItemsChanged).toHaveBeenCalledWith(selectedRows)
  })

  it('switches to the account supplied by the selected-items model', () => {
    const setAccount = vi.fn()
    const context = {
      current_account: {id: 10},
      switching: false,
      set_account: setAccount,
    }

    SwitchAccount.methods.onSelectedItemsChanged.call(context, [20])

    expect(setAccount).toHaveBeenCalledWith(20)
  })

  it('does not post when the current account is selected programmatically', () => {
    const setAccount = vi.fn()
    const context = {
      current_account: {id: 10},
      switching: false,
      set_account: setAccount,
    }

    SwitchAccount.methods.onSelectedItemsChanged.call(context, [10])

    expect(setAccount).not.toHaveBeenCalled()
  })

  it('stores the current account primary key in the table selection model', () => {
    const context = {
      current_account: {id: 10},
      selected_items: [],
    }

    SwitchAccount.methods.selectAccountRow.call(context)

    expect(context.selected_items).toEqual([10])
  })

  it('does not issue a request for an invalid account ID', async () => {
    const restoreCurrentAccountSelection = vi.fn()
    const context = {
      server_response: {},
      restoreCurrentAccountSelection,
    }

    await SwitchAccount.methods.set_account.call(context, undefined)

    expect(http.post).not.toHaveBeenCalled()
    expect(context.server_response.error).toBe(true)
    expect(restoreCurrentAccountSelection).toHaveBeenCalledOnce()
  })

  it('reloads the application after a successful account switch', async () => {
    http.post.mockResolvedValue({data: {success: true, error: false}})
    const reloadApplication = vi.fn()
    const context = {
      switching: false,
      server_response: {},
      reloadApplication,
      restoreCurrentAccountSelection: vi.fn(),
      errorResponse: vi.fn(),
    }

    await SwitchAccount.methods.set_account.call(context, 20)

    expect(http.post).toHaveBeenCalledWith('/api/v1/admin/accounts/20/impersonation')
    expect(reloadApplication).toHaveBeenCalledOnce()
    expect(context.switching).toBe(false)
  })

  it('keeps the page and restores the current row when switching fails', async () => {
    http.post.mockResolvedValue({data: {success: false, error: true, message: 'Denied'}})
    const reloadApplication = vi.fn()
    const restoreCurrentAccountSelection = vi.fn()
    const context = {
      switching: false,
      server_response: {},
      reloadApplication,
      restoreCurrentAccountSelection,
      errorResponse: vi.fn(),
    }

    await SwitchAccount.methods.set_account.call(context, 20)

    expect(reloadApplication).not.toHaveBeenCalled()
    expect(restoreCurrentAccountSelection).toHaveBeenCalledOnce()
    expect(context.server_response.error).toBe(true)
  })
})
