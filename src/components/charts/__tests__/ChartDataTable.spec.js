import {mount} from '@vue/test-utils'
import {createBootstrap} from 'bootstrap-vue-next'
import {describe, expect, it} from 'vitest'

import ChartDataTable from '@/components/charts/ChartDataTable.vue'

const chartData = {
  labels: [['STARTTLS and DANE', 'Secure mail server connection'], 'RPKI', 'Average'],
  datasets: [
    {label: 'passed', data: [80, 60, 70]},
    {label: 'failed', data: [20, 40, 30]}
  ]
}

const mountTable = (data = chartData) => mount(ChartDataTable, {
  props: {chartData: data},
  global: {
    plugins: [createBootstrap()],
    mocks: {$t: (key) => key}
  }
})

describe('ChartDataTable', () => {
  it('provides stacked category cards for narrow displays', () => {
    const wrapper = mountTable()

    expect(wrapper.findAll('.chart-data-card')).toHaveLength(3)
    expect(wrapper.find('.chart-data-card').text()).toContain('STARTTLS and DANE')
    expect(wrapper.find('.chart-data-card').text()).toContain('passed')
    expect(wrapper.find('.chart-data-card').text()).toContain('80%')
  })

  it('uses cards at every width when a comparison has too many table columns', () => {
    const datasets = Array.from({length: 8}, (_, index) => ({
      label: `dataset-${index}`,
      data: [index]
    }))
    const wrapper = mountTable({labels: ['Category'], datasets})

    expect(wrapper.find('.chart-data-table').exists()).toBe(false)
    expect(wrapper.find('.chart-data-cards').classes()).not.toContain('d-lg-none')
  })
})
