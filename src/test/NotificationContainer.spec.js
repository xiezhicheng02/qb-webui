import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import NotificationContainer from '../components/NotificationContainer.vue'

describe('NotificationContainer', () => {
  it('renders correctly', () => {
    const wrapper = mount(NotificationContainer)
    expect(wrapper.exists()).toBe(true)
  })

  it('has the correct class', () => {
    const wrapper = mount(NotificationContainer)
    expect(wrapper.classes()).toContain('notification-container')
  })
})