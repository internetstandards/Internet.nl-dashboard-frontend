import {flushPromises, shallowMount} from '@vue/test-utils'
import {beforeEach, describe, expect, it, vi} from 'vitest'

import NotificationSettings from '@/components/account/NotificationSettings.vue'
import http from '@/httpclient'

vi.mock('@/httpclient', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

const user = {
  first_name: 'Alice',
  last_name: 'Example',
  mail_preferred_language: null,
  mail_preferred_mail_address: 'alice@example.test',
  mail_send_mail_after_scan_finished: true,
}

function mountNotificationSettings() {
  return shallowMount(NotificationSettings, {
    global: {
      mocks: {
        $t: (key) => ({
          'account.notifications.mail_preferred_language_required': 'Select an e-mail language before saving.',
          'account.notifications.save_user_settings_error_form_unsupported_language': 'This language is not supported.',
        })[key] || key,
      },
    },
  })
}

describe('NotificationSettings', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    http.get.mockResolvedValue({data: {...user}})
    http.post.mockResolvedValue({
      data: {success: true, message: 'save_user_settings_success'},
    })
  })

  it('requires a supported language before sending the form', async () => {
    const wrapper = mountNotificationSettings()
    await flushPromises()

    await wrapper.get('form').trigger('submit')

    expect(http.post).not.toHaveBeenCalled()
    expect(wrapper.text()).toContain('Select an e-mail language before saving.')

    wrapper.vm.user.mail_preferred_language = 'en'
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(http.post).toHaveBeenCalledOnce()
    expect(http.post).toHaveBeenCalledWith('/api/v1/settings/user', expect.objectContaining({
      mail_preferred_language: 'en',
    }))
  })

  it('associates a backend 422 language error with the language field', async () => {
    http.get.mockResolvedValue({data: {...user, mail_preferred_language: 'en'}})
    http.post.mockRejectedValue({
      response: {
        status: 422,
        data: {
          detail: [{loc: ['body', 'mail_preferred_language']}],
        },
      },
    })
    const wrapper = mountNotificationSettings()
    await flushPromises()

    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(wrapper.text()).toContain('This language is not supported.')
  })
})
