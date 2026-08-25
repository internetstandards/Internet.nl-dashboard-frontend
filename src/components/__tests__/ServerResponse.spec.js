import {mount} from '@vue/test-utils'
import {createBootstrap} from 'bootstrap-vue-next'
import {describe, expect, it} from 'vitest'

import ServerResponse from '@/components/ServerResponse.vue'

describe('ServerResponse', () => {
  it('shows an initial response and updates its visibility when dismissed', async () => {
    const wrapper = mount(ServerResponse, {
      props: {response: {success: true, message: 'Saved'}},
      global: {
        plugins: [createBootstrap()],
        mocks: {
          $t: (key) => key,
          humanize_date: () => '',
          humanize_relative_date: () => '',
        },
      },
    })

    expect(wrapper.vm.show).toBe(true)
    expect(wrapper.findComponent({name: 'BAlert'}).props('modelValue')).toBe(true)

    wrapper.findComponent({name: 'BAlert'}).vm.$emit('update:modelValue', false)
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.show).toBe(false)

    await wrapper.setProps({response: {success: true, message: 'Saved again'}})

    expect(wrapper.vm.show).toBe(true)
  })
})
