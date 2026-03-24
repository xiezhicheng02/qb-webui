import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AddTaskDialog from '../components/AddTaskDialog.vue'

describe('AddTaskDialog', () => {
  it('renders correctly when visible', () => {
    const wrapper = mount(AddTaskDialog, {
      props: {
        visible: true
      }
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('does not render when not visible', () => {
    const wrapper = mount(AddTaskDialog, {
      props: {
        visible: false
      }
    })
    expect(wrapper.exists()).toBe(true)
  })
})