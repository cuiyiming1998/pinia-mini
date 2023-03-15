import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, defineStore, setActivePinia } from '../src'

describe('state', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  const useStore = defineStore('main', {
    state: () => ({
      name: 'young',
      age: 0,
    }),
  })

  it('can directly access state at the store level', () => {
    const store = useStore()
    console.log(store)
    expect(store.name).toBe('young')
    store.name = 'abc'
    expect(store.name).toBe('abc')
  })
})
