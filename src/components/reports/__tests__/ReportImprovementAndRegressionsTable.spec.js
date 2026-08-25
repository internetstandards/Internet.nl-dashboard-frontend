import {shallowMount} from '@vue/test-utils'
import {describe, expect, it} from 'vitest'

import ReportImprovementAndRegressionsTable from '@/components/reports/ReportImprovementAndRegressionsTable.vue'

describe('ReportImprovementAndRegressionsTable', () => {
  it('uses BootstrapVueNext accessors for nested sortable values', () => {
    const item = {
      url: 'example.nl',
      changes: {
        improvement: 3,
        regression: 1,
        neutral: 2,
        improved_metrics: [],
        regressed_metrics: [],
      },
      old: {report: '/old', score: 50},
      new: {report: '/new', score: 75},
    }
    const wrapper = shallowMount(ReportImprovementAndRegressionsTable, {
      props: {items: [item]},
      global: {
        mocks: {
          $i18n: {t: (key) => key},
          $t: (key) => key,
        },
      },
    })

    const improvement = wrapper.vm.fields.find((field) => field.key === 'improvement')
    const regression = wrapper.vm.fields.find((field) => field.key === 'regression')

    expect(improvement.accessor(item)).toBe(3)
    expect(regression.accessor(item)).toBe(1)
  })
})
