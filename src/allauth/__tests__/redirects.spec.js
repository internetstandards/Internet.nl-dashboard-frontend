import { describe, expect, it, vi } from 'vitest'
import { installAuthChangeRedirector, reauthenticationRouteFor } from '@/allauth/redirects'

const passwordReauthentication = {
  status: 401,
  data: {
    flows: [{ id: 'reauthenticate' }, { id: 'mfa_reauthenticate', types: ['totp', 'webauthn'] }],
  },
  meta: { is_authenticated: true },
}

describe('reauthenticationRouteFor', () => {
  it('redirects an authenticated 401 and preserves the current location', () => {
    expect(
      reauthenticationRouteFor(passwordReauthentication, {
        path: '/profile/authentication/2fa/webauthn/add',
        fullPath: '/profile/authentication/2fa/webauthn/add?passwordless=true',
      }),
    ).toEqual({
      path: '/account/reauthenticate',
      query: { next: '/profile/authentication/2fa/webauthn/add?passwordless=true' },
    })
  })

  it('uses an offered MFA reauthentication method', () => {
    const auth = {
      status: 401,
      data: { flows: [{ id: 'mfa_reauthenticate', types: ['webauthn'] }] },
      meta: { is_authenticated: true },
    }

    expect(
      reauthenticationRouteFor(auth, {
        path: '/account/password/change',
        fullPath: '/account/password/change',
      }),
    ).toEqual({
      path: '/account/reauthenticate/webauthn',
      query: { next: '/account/password/change' },
    })
  })

  it('does not redirect an unauthenticated 401', () => {
    expect(
      reauthenticationRouteFor(
        {
          ...passwordReauthentication,
          meta: { is_authenticated: false },
        },
        {
          path: '/account/login',
          fullPath: '/account/login',
        },
      ),
    ).toBeNull()
  })

  it('does not redirect while already reauthenticating', () => {
    expect(
      reauthenticationRouteFor(passwordReauthentication, {
        path: '/account/reauthenticate',
        fullPath: '/account/reauthenticate?next=/profile',
      }),
    ).toBeNull()
  })
})

describe('installAuthChangeRedirector', () => {
  it('responds to authentication changes from the active allauth client', async () => {
    const router = {
      currentRoute: {
        value: {
          path: '/profile/authentication/2fa/webauthn/add',
          fullPath: '/profile/authentication/2fa/webauthn/add',
        },
      },
      replace: vi.fn().mockResolvedValue(undefined),
    }
    const uninstall = installAuthChangeRedirector(router)

    document.dispatchEvent(
      new CustomEvent('allauth.auth.change', {
        detail: passwordReauthentication,
      }),
    )
    await Promise.resolve()

    expect(router.replace).toHaveBeenCalledWith({
      path: '/account/reauthenticate',
      query: { next: '/profile/authentication/2fa/webauthn/add' },
    })
    uninstall()
  })
})
