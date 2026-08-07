import {mount} from '@vue/test-utils'
import {afterEach, describe, expect, it, vi} from 'vitest'

import EditDomain from '@/components/domains/domain/editDomain.vue'

vi.mock('@/httpclient', () => ({
  default: {
    put: vi.fn(),
  },
}))

const translations = {
  'domain.edit-domain.domain': 'Domain',
  'domain.edit-domain.edit': 'Edit',
  'domain.edit-domain.remove': 'Remove',
  'domain.edit-domain.save': 'Save',
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
    mocks: {
      $t: (key) => translations[key] ?? key,
    },
  },
})

describe('editDomain', () => {
  afterEach(() => {
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
    expect(buttons.map((button) => button.text().trim())).toEqual(['Save', 'Undo', 'Remove'])
    expect(buttons.every((button) => button.find('svg').exists())).toBe(true)

    await input.setValue('changed.example.com')
    await input.trigger('keydown', {key: 'Escape'})

    expect(wrapper.find('input').exists()).toBe(false)
    expect(wrapper.text()).toContain('www.example.com')
  })
})
