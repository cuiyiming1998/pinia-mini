import { beforeEach, describe, expect, it } from 'vitest'
import { computed, ref } from 'vue-demi'
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

  it('should add getters to store', () => {
    const store = useStore()
    expect(store.getName).toBe('young')
    expect(store.doubledAge).toBe(40)
  })

  it('should updates the value ', () => {
    const store = useStore()
    store.age = 15
    expect(store.doubledAge).toBe(30)
  })
})

describe('getters with setup option', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  const useStore = defineStore('main', () => {
    const name = ref('young')
    const age = ref(20)

    const doubledAge = computed(() => age.value * 2)
    const getName = computed(() => name.value)

    return { name, age, getName, doubledAge }
  })

  it('should add getters to store', () => {
    const store = useStore()
    expect(store.getName).toBe('young')
    expect(store.doubledAge).toBe(40)
  })

  it('should updates the value', () => {
    const store = useStore()
    store.age = 15
    expect(store.doubledAge).toBe(30)
  })
})
