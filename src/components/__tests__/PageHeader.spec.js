import {mount} from '@vue/test-utils'
import {createBootstrap} from 'bootstrap-vue-next'
import {describe, expect, it} from 'vitest'

import PageHeader from '@/components/PageHeader.vue'

const mountHeader = (options = {}) => mount(PageHeader, {
  props: {
    title: 'Page title',
    subtitle: 'Page subtitle',
    ...options.props,
  },
  slots: options.slots,
  global: {
    plugins: [createBootstrap()],
  },
})

describe('PageHeader', () => {
  it('renders a semantic page heading and optional content areas', () => {
    const wrapper = mountHeader({
      slots: {
        icon: '<svg data-test="icon" />',
        actions: '<button type="button">Action</button>',
        default: '<p>Additional content</p>',
      },
    })

    expect(wrapper.get('h1').text()).toBe('Page title')
    expect(wrapper.text()).toContain('Page subtitle')
    expect(wrapper.get('.page-header-icon').attributes('aria-hidden')).toBe('true')
    expect(wrapper.get('.page-header-actions').text()).toBe('Action')
    expect(wrapper.get('.page-header-content').text()).toBe('Additional content')
  })

  it('supports subtitle content and alternate heading levels', () => {
    const wrapper = mountHeader({
      props: {titleTag: 'h2'},
      slots: {subtitle: '<strong>Rich subtitle</strong>'},
    })

    expect(wrapper.get('h2').text()).toBe('Page title')
    expect(wrapper.get('.page-header-copy p').text()).toBe('Rich subtitle')
    expect(wrapper.find('.page-header-content').exists()).toBe(false)
  })
})
