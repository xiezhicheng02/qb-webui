import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import NotificationContainer from '../components/NotificationContainer.vue'

describe('NotificationContainer', () => {
  it('renders without crashing', () => {
    const wrapper = mount(NotificationContainer)
    expect(wrapper.exists()).toBe(true)
  })
})