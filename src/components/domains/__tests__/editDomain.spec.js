import {mount} from '@vue/test-utils'
import {afterEach, describe, expect, it, vi} from 'vitest'
import {createBootstrap} from 'bootstrap-vue-next'

import EditDomain from '@/components/domains/domain/editDomain.vue'

vi.mock('@/httpclient', () => ({
  default: {
    put: vi.fn(),
  },
}))

const translations = {
  'domain.edit-domain.cancel': 'Cancel',
  'domain.edit-domain.delete': 'Delete',
  'domain.edit-domain.delete-confirmation-message': 'Delete this domain?',
  'domain.edit-domain.delete-confirmation-title': 'Delete domain?',
  'domain.edit-domain.domain': 'Domain',
  'domain.edit-domain.edit': 'Edit',
  'domain.edit-domain.save': 'Save',
  'domain.edit-domain.skip-delete-confirmation': 'Do not ask again for one hour.',
  'domain.edit-domain.undo': 'Undo',
}

const mountEditor = () => mount(EditDomain, {
  attachTo: document.body,
  props: {
    list: {id: 10},
    url: {
      id: 1425,
      url: 'www.example.com',
      subdomain: 'www',
      domain: 'example',
      suffix: 'com',
    },
  },
  global: {
    plugins: [createBootstrap()],
    mocks: {
      $t: (key) => translations[key] ?? key,
    },
  },
})

describe('editDomain', () => {
  afterEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
    document.body.innerHTML = ''
  })

  it('uses accessible icon-and-text buttons for every edit action', async () => {
    const wrapper = mountEditor()

    expect(wrapper.find('a').exists()).toBe(false)
    expect(wrapper.get('button').text()).toContain('Edit')
    expect(wrapper.get('button svg').attributes('aria-hidden')).toBe('true')

    await wrapper.get('button').trigger('click')

    const input = wrapper.get('input')
    expect(input.attributes('id')).toBe('domain-url-10-1425')
    expect(wrapper.get('label').attributes('for')).toBe(input.attributes('id'))
    expect(document.activeElement).toBe(input.element)

    const buttons = wrapper.findAll('button')
    expect(buttons.map((button) => button.text().trim())).toEqual(['Save', 'Undo', 'Delete'])
    expect(buttons.every((button) => button.find('svg').exists())).toBe(true)

    await input.setValue('changed.example.com')
    await input.trigger('keydown', {key: 'Escape'})

    expect(wrapper.find('input').exists()).toBe(false)
    expect(wrapper.text()).toContain('www.example.com')
  })

  it('confirms deletion and can suppress confirmations for the list for one hour', async () => {
    const now = 1_800_000_000_000
    const dateNow = vi.spyOn(Date, 'now').mockReturnValue(now)
    const wrapper = mountEditor()

    wrapper.vm.request_delete()
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.deleteConfirmationVisible).toBe(true)
    expect(wrapper.emitted('domain_deleted')).toBeUndefined()
    expect(wrapper.findComponent({name: 'BModal'}).exists()).toBe(true)
    expect(document.querySelector('.modal-header .btn-close')).not.toBeNull()

    const modalButtons = [...document.querySelectorAll('.modal-footer button')]
    expect(modalButtons.map((button) => button.textContent.trim())).toEqual(['Cancel', 'Delete'])
    expect(modalButtons[1].querySelector('svg')).not.toBeNull()

    wrapper.vm.cancel_delete()
    expect(wrapper.vm.deleteConfirmationVisible).toBe(false)
    expect(wrapper.emitted('domain_deleted')).toBeUndefined()

    wrapper.vm.request_delete()
    wrapper.vm.suppressDeleteConfirmation = true
    wrapper.vm.confirm_delete()

    const storageKey = 'internetnl:domain-delete-confirmation-suppressed-until:list:10'
    expect(localStorage.getItem(storageKey)).toBe(String(now + 60 * 60 * 1000))
    expect(wrapper.emitted('domain_deleted')).toHaveLength(1)

    const nextDomain = mountEditor()
    nextDomain.vm.request_delete()

    expect(nextDomain.vm.deleteConfirmationVisible).toBe(false)
    expect(nextDomain.emitted('domain_deleted')).toHaveLength(1)

    dateNow.mockReturnValue(now + 60 * 60 * 1000 + 1)
    const afterOneHour = mountEditor()
    afterOneHour.vm.request_delete()

    expect(afterOneHour.vm.deleteConfirmationVisible).toBe(true)
    expect(afterOneHour.emitted('domain_deleted')).toBeUndefined()
    expect(localStorage.getItem(storageKey)).toBeNull()
  })
})
