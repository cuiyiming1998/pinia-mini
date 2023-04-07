import { beforeEach, describe, expect, it } from 'vitest'
import { computed, ref } from 'vue-demi'
import { createPinia, defineStore, setActivePinia, storeToRefs } from '../src'

describe('actions', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  const useStore = defineStore('main', {
    state: () => ({
      foo: true,
      a: 1,
      b: '1',
    }),
  })

  it('empty state', () => {
    expect(storeToRefs(defineStore('a', () => {}))).toEqual({})
  })

  it('should return reactive values', () => {
    const store = useStore()
    const { foo, a, b } = storeToRefs(store)

    expect(foo.value).toBe(true)
    expect(a.value).toBe(1)
    expect(b.value).toBe('1')

    foo.value = false
    a.value = 200
    b.value = '2'
    expect(foo.value).toBe(false)
    expect(a.value).toBe(200)
    expect(b.value).toBe('2')
  })

  it('contains getters', () => {
    const store = defineStore('a', () => {
      const a = ref(0)
      const doubled = computed(() => a.value * 2)
      return { a, doubled }
    })()

    const { a } = storeToRefs(store)
    a.value = 2

    expect(store.doubled).toBe(4)
  })
})
