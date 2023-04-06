import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, defineStore, setActivePinia } from '../src'

describe('getters', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  const useStore = defineStore('main', {
    state: () => ({
      name: 'young',
      age: 20,
    }),
    getters: {
      doubledAge(store: any) {
        return store.age * 2
      },
      getName(store: any) {
        return store.name
      },
    },
  })

  it('should add getters to store ', () => {
    const store = useStore()
    expect(store.getName).toBe('young')
    expect(store.doubledAge).toBe(40)
  })
})
