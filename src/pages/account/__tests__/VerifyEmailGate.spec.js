import {flushPromises, mount} from '@vue/test-utils'
import {createI18n} from 'vue-i18n'
import {beforeEach, describe, expect, it, vi} from 'vitest'

import VerifyEmailGate from '@/pages/account/VerifyEmailGate.vue'

const mocks = vi.hoisted(() => ({
  replace: vi.fn(),
  syncDashboardSession: vi.fn(),
  verifyEmail: vi.fn(),
}))

vi.mock('vue-router', () => ({
  useRoute: () => ({path: '/profile/authentication/verify-email'}),
  useRouter: () => ({replace: mocks.replace}),
}))

vi.mock('@/allauth/lib/allauth', () => ({
  verifyEmail: mocks.verifyEmail,
}))

vi.mock('@/allauthStore', () => ({
  allauthStore: () => ({
    config: {data: {account: {email_verification_by_code_enabled: true}}},
    syncDashboardSession: mocks.syncDashboardSession,
  }),
}))

describe('VerifyEmailGate', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows an incorrect-code error for a status-only 409 response', async () => {
    mocks.verifyEmail.mockResolvedValue({status: 409})
    const i18n = createI18n({
      legacy: false,
      locale: 'en',
      messages: {
        en: {
          authentication: {
            error: {incorrect_code: 'Incorrect code.'},
            verify_email_gate: {
              code: 'Code',
              intro: 'Enter the verification code sent to your email.',
              submit: 'Confirm',
              title: 'Confirm Email Address',
            },
          },
        },
      },
    })
    const wrapper = mount(VerifyEmailGate, {
      global: {
        plugins: [i18n],
        stubs: {
          BButton: {
            template: '<button><slot /></button>',
          },
        },
      },
    })

    await wrapper.get('#verify-email-code').setValue('wrong-code')
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(mocks.verifyEmail).toHaveBeenCalledWith('wrong-code')
    expect(wrapper.text()).toContain('Incorrect code.')
    expect(mocks.replace).not.toHaveBeenCalled()
  })
})
