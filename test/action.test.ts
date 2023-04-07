import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, defineStore, setActivePinia } from '../src'
import { ref, unref } from 'vue-demi'

describe('actions', () => {
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

describe('actions with setup options', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  const useStore = defineStore('main', () => {
    const foo = ref(true)

    const toggle = () => {
      foo.value = !unref(foo)
    }

    return { foo, toggle }
  })

  it('should call actions', () => {
    const store = useStore()
    expect(store.foo).toBe(true)
    store.toggle()
    expect(store.foo).toBe(false)
  })
})

