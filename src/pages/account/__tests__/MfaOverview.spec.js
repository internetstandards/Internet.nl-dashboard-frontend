import {flushPromises, mount, shallowMount} from '@vue/test-utils'
import {beforeEach, describe, expect, it, vi} from 'vitest'

import MfaOverview from '@/pages/account/MfaOverview.vue'
import MfaRecoveryCodesGenerate from '@/pages/account/MfaRecoveryCodesGenerate.vue'

const mocks = vi.hoisted(() => ({
  generateRecoveryCodes: vi.fn(),
  getAuthenticators: vi.fn(),
  replace: vi.fn(),
}))

vi.mock('vue-router', () => ({
  useRoute: () => ({path: '/profile/authentication/2fa'}),
  useRouter: () => ({replace: mocks.replace}),
}))

vi.mock('@/allauth/lib/allauth', () => ({
  AuthenticatorType: {
    RECOVERY_CODES: 'recovery_codes',
    TOTP: 'totp',
    WEBAUTHN: 'webauthn',
  },
  generateRecoveryCodes: mocks.generateRecoveryCodes,
  getAuthenticators: mocks.getAuthenticators,
}))

const BButtonStub = {
  props: ['to'],
  template: '<a class="mfa-action" :data-to="to"><slot /></a>',
}

function mountOverview(authenticators) {
  mocks.getAuthenticators.mockResolvedValue({status: 200, data: authenticators})
  return mount(MfaOverview, {
    global: {
      mocks: {$t: (key) => key},
      stubs: {BButton: BButtonStub},
    },
  })
}

describe('MfaOverview recovery-code actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('hides recovery-code actions when no second factor is configured', async () => {
    const wrapper = mountOverview([])
    await flushPromises()

    expect(wrapper.findAll('[data-to*="recovery-codes"]')).toHaveLength(0)
  })

  it('offers generation, but not viewing, when MFA has no recovery codes', async () => {
    const wrapper = mountOverview([{type: 'totp'}])
    await flushPromises()

    const actions = wrapper.findAll('[data-to*="recovery-codes"]')
    expect(actions).toHaveLength(1)
    expect(actions[0].attributes('data-to')).toBe('/profile/authentication/2fa/recovery-codes/generate')
  })

  it('offers both recovery-code actions when codes exist', async () => {
    const wrapper = mountOverview([
      {type: 'totp'},
      {type: 'recovery_codes', unused_code_count: 5, total_code_count: 10},
    ])
    await flushPromises()

    expect(wrapper.findAll('[data-to*="recovery-codes"]')).toHaveLength(2)
  })

  it('uses the authenticator summary on the generate page instead of fetching absent codes', async () => {
    mocks.getAuthenticators.mockResolvedValue({status: 200, data: [{type: 'totp'}]})
    shallowMount(MfaRecoveryCodesGenerate, {
      global: {
        mocks: {$t: (key) => key},
      },
    })
    await flushPromises()

    expect(mocks.getAuthenticators).toHaveBeenCalledOnce()
  })
})
