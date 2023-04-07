import { beforeEach, describe, expect, it } from 'vitest'
import { computed, ref } from 'vue-demi'
import { createPinia, defineStore, setActivePinia } from '../src'

describe('options store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  const useStore = defineStore('main', {
    state: () => ({
      name: 'young',
      age: 20,
    }),
  })

  it('can directly access state at the store level', () => {
    const store = useStore()
    expect(store.name).toBe('young')
    store.name = 'abc'
    expect(store.name).toBe('abc')
  })

  it('state is reactive', () => {
    const store = useStore()
    const upperCased = computed(() => store.name.toUpperCase())
    expect(upperCased.value).toBe('YOUNG')
    store.name = 'y'
    expect(upperCased.value).toBe('Y')
  })
})

describe('setup store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  const useStore = defineStore('main', () => {
    const name = 'young'
    const age = 20

    return { name, age }
  })

  it('can also access state', () => {
    const store = useStore()
    expect(store.name).toBe('young')
    store.name = 'abc'
    expect(store.name).toBe('abc')
  })

  it('state is reactive', () => {
    const store = useStore()
    const upperCased = computed(() => store.name.toUpperCase())
    expect(upperCased.value).toBe('YOUNG')
    store.name = 'y'
    expect(upperCased.value).toBe('Y')
  })
})

// TODO: 对composition api的支持
describe('setup store with composition api', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  const useStore = defineStore('main', () => {
    const name = ref('young')
    return { name }
  })

  it('can also access state', () => {
    const store = useStore()
    expect(store.name).toBe('young')
    store.name = 'abc'
    expect(store.name).toBe('abc')
  })

  it('state is reactive', () => {
    const store = useStore()
    const upperCased = computed(() => store.name.toUpperCase())
    expect(upperCased.value).toBe('YOUNG')
    store.name = 'y'
    expect(upperCased.value).toBe('Y')
  })
})
