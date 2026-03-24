import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../App.vue'

describe('App', () => {
  it('renders correctly', () => {
    const wrapper = mount(App)
    expect(wrapper.exists()).toBe(true)
  })

  it('contains the main div with id app', () => {
    const wrapper = mount(App)
    expect(wrapper.find('#app').exists()).toBe(true)
  })
})