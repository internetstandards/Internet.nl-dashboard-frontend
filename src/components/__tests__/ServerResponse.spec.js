import {mount} from '@vue/test-utils'
import {createBootstrap} from 'bootstrap-vue-next'
import {describe, expect, it} from 'vitest'

import ServerResponse from '@/components/ServerResponse.vue'

describe('ServerResponse', () => {
  it('updates its visibility when a dismissible alert is closed', async () => {
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

    wrapper.vm.show = true
    await wrapper.vm.$nextTick()
    wrapper.findComponent({name: 'BAlert'}).vm.$emit('update:modelValue', false)
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.show).toBe(false)
  })
})
