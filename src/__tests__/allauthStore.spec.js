import {createPinia, setActivePinia} from 'pinia'
import {flushPromises} from '@vue/test-utils'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import {allauthStore} from '@/allauthStore'
import {dashboardStore} from '@/dashboardStore'
import * as allauth from '@/allauth/lib/allauth'
import http from '@/httpclient'

vi.mock('@/allauth/lib/allauth', async importOriginal => ({
  ...await importOriginal(), getConfig: vi.fn(), getAuth: vi.fn(), logout: vi.fn(),
}))
vi.mock('@/httpclient', () => ({default: {get: vi.fn()}}))

const authenticated = {
  status: 200,
  data: {user: {id: 7, username: 'alice', display: 'Alice', account_id: 42, account_name: 'Shared account', is_superuser: true}},
  meta: {is_authenticated: true},
}
const anonymous = {status: 401, data: {flows: [{id: 'login'}]}, meta: {is_authenticated: false}}
const anonymousUser = {is_authenticated: false, is_superuser: false, account_name: '', account_id: null}
const pinia = createPinia()

describe('allauth dashboard session', () => {
  let auth
  let dashboard

  beforeEach(() => {
    vi.clearAllMocks()
    setActivePinia(pinia)
    auth = allauthStore()
    dashboard = dashboardStore()
    auth.$reset()
    dashboard.$reset()
    allauth.getConfig.mockResolvedValue({status: 200, data: {account: {}}})
    allauth.getAuth.mockResolvedValue(authenticated)
  })

  it('bootstraps dashboard account data from allauth without another session request', async () => {
    await auth.bootstrap()
    expect(dashboard.user).toEqual({is_authenticated: true, is_superuser: true, account_name: 'Shared account', account_id: 42})
    expect(allauth.getAuth).toHaveBeenCalledTimes(1)
    expect(http.get).not.toHaveBeenCalled()
  })

  it('keeps the dashboard account separate from the allauth user ID and display name', async () => {
    allauth.getAuth.mockResolvedValue({...authenticated, data: {user: {id: 7, username: 'alice', display: 'Alice'}}})
    await auth.refreshAuth()
    expect(dashboard.user).toEqual({...anonymousUser, is_authenticated: true})
  })

  it('handles an anonymous session as a normal allauth 401', async () => {
    allauth.getAuth.mockResolvedValue(anonymous)
    await auth.bootstrap()
    expect(auth.lastError).toBeNull()
    expect(dashboard.user).toEqual(anonymousUser)
  })

  it('finishes loading the session even when configuration fails', async () => {
    const error = new Error('Configuration unavailable')
    allauth.getConfig.mockRejectedValue(error)
    let finishAuth
    allauth.getAuth.mockReturnValue(new Promise(resolve => { finishAuth = resolve }))
    let settled = false
    const result = auth.bootstrap().catch(error => {
      settled = true
      return error
    })
    await flushPromises()
    expect(settled).toBe(false)
    finishAuth(authenticated)
    expect(await result).toBe(error)
    expect(dashboard.user.account_id).toBe(42)
    expect(dashboard.user.is_authenticated).toBe(true)
    expect(auth.lastError).toBe(error)
  })

  it('ignores user details while an MFA login is incomplete', async () => {
    allauth.getAuth.mockResolvedValue({...anonymous, data: {...authenticated.data, flows: [{id: 'mfa_authenticate', is_pending: true}]}})
    await auth.refreshAuth()
    expect(auth.pendingFlow.id).toBe('mfa_authenticate')
    expect(dashboard.user).toEqual(anonymousUser)
  })

  it('preserves an authenticated session when reauthentication is required', async () => {
    allauth.getAuth.mockResolvedValue({...authenticated, status: 401})
    await auth.refreshAuth()
    expect(auth.requiresReauthentication).toBe(true)
    expect(dashboard.user.account_id).toBe(42)
    expect(dashboard.user.is_superuser).toBe(true)
  })

  it('updates account data immediately after an auth change without fetching session status', async () => {
    await auth.bootstrap()
    document.dispatchEvent(new CustomEvent('allauth.auth.change', {
      detail: {...authenticated, data: {user: {...authenticated.data.user, account_id: 99, account_name: 'Switched account'}}},
    }))
    expect(dashboard.user.account_id).toBe(99)
    expect(dashboard.user.account_name).toBe('Switched account')
    expect(http.get).not.toHaveBeenCalled()
    expect(allauth.getAuth).toHaveBeenCalledTimes(1)
  })

  it('clears account and privilege data when the session expires', async () => {
    await auth.bootstrap()
    document.dispatchEvent(new CustomEvent('allauth.auth.change', {detail: {status: 410}}))
    expect(dashboard.user).toEqual(anonymousUser)
  })

  it('accepts allauth logout and clears dashboard state without a follow-up GET', async () => {
    await auth.bootstrap()
    allauth.logout.mockResolvedValue(anonymous)
    await auth.logout()
    expect(allauth.logout).toHaveBeenCalledTimes(1)
    expect(dashboard.user).toEqual(anonymousUser)
    expect(allauth.getAuth).toHaveBeenCalledTimes(1)
    expect(http.get).not.toHaveBeenCalled()
  })

  it('preserves the current session when logout is rejected', async () => {
    await auth.bootstrap()
    allauth.logout.mockResolvedValue({status: 403})
    await expect(auth.logout()).rejects.toThrow('Unable to log out.')
    expect(dashboard.user.is_authenticated).toBe(true)
    expect(dashboard.user.account_id).toBe(42)
  })
})
