import {defineComponent} from 'vue'
import {shallowMount} from '@vue/test-utils'
import {describe, expect, it, vi} from 'vitest'

import Account from '@/components/account/Account.vue'

vi.mock('@/allauthStore', () => ({
  allauthStore: () => ({config: null, pendingFlow: null}),
}))

const TabsStub = defineComponent({
  name: 'TabsStub',
  props: {
    index: {
      type: Number,
      default: -1,
    },
  },
  template: '<div class="tabs-stub"><slot /></div>',
})

const TabStub = defineComponent({
  name: 'TabStub',
  template: '<div><slot /></div>',
})

describe('Account profile routing', () => {
  it('binds numeric tab indexes and preserves a nested MFA route', () => {
    const replace = vi.fn()
    const wrapper = shallowMount(Account, {
      global: {
        renderStubDefaultSlot: true,
        mocks: {
          $route: {
            params: {},
            path: '/profile/authentication/2fa/recovery-codes',
          },
          $router: {replace},
          $t: (key) => key,
        },
        stubs: {
          BTab: TabStub,
          BTabs: TabsStub,
          ContentBlock: {
            template: '<div><slot /></div>',
          },
        },
      },
    })

    const tabs = wrapper.findAllComponents(TabsStub)
    expect(tabs[0].props('index')).toBe(1)
    expect(tabs[1].props('index')).toBe(2)

    wrapper.vm.onProfileTabChange(1)
    wrapper.vm.onAuthTabChange(2)
    wrapper.vm.onProfileTabChange('tab-id')
    expect(replace).not.toHaveBeenCalled()

    wrapper.vm.onAuthTabChange(0)
    expect(replace).toHaveBeenCalledWith('/profile/authentication/email')
  })
})
