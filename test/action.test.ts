import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, defineStore, setActivePinia } from '../src'

describe('getters', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  const useStore = defineStore('main', {
    state: () => ({
      foo: true,
    }),
    actions: {
      toggle() {
        // @ts-expect-error
        this.foo = !this.foo
      },
    },
  })

  it('should call actions', () => {
    const store = useStore()
    expect(store.foo).toBe(true)
    store.toggle()
    expect(store.foo).toBe(false)
  })
})
