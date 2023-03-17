import { computed, effectScope, isReactive, isRef, markRaw, reactive, toRaw, toRefs } from 'vue-demi'
import type { ComputedRef, EffectScope } from 'vue-demi'
import { activePinia, setActivePinia } from './rootStore'
import { assign, isComputed } from './shared'
import type { Pinia } from './types.d'

function createSetupStore(
  id: string,
  setup: any,
  options: any,
  pinia: Pinia,
  isOptionsStore?: boolean,
) {
  let scope!: EffectScope
  const $id = id
  const partialStore = {
    _p: pinia,
    $id,
    $onAction: {},
    $patch: {},
    $reset: {},
    $subscribe: {},
    $dispose: {},
  }

  const store = reactive(assign({}, partialStore))

  pinia._s.set($id, store)

  const setupStore = pinia._e.run(() => {
    scope = effectScope()
    // 执行setup获得localState
    return scope.run(() => setup())
  })

  for (const key in setupStore) {
    const prop = setupStore[key]

    if ((isRef(prop) && !isComputed(prop)) || isReactive(prop)) {
      if (!isOptionsStore) {
        // optionsStore已经把state注入进去了
        pinia.state.value[$id][key] = prop
      }
    }
  }

  assign(toRaw(store), setupStore)
  return store
}

function createOptionsStore(id: string, options: any, pinia: Pinia) {
  const { state, actions, getters } = options

  const initialState = pinia.state.value[id]

  // 创建setup
  function setup() {
    if (!initialState)
      pinia.state.value[id] = state ? state() : {}

    const localState = toRefs(pinia.state.value[id])

    const assigned = assign(
      localState,
      actions,
      Object.keys(getters || {}).reduce((computedGetters, name) => {
        computedGetters[name] = markRaw(
          computed(() => {
            // 为每个getter创建响应式数据 -> 也就是computed
            setActivePinia(pinia)
            const store = pinia._s.get(id)
            return getters[name].call(store, store)
          }),
        )
        return computedGetters
      }, {} as Record<string, ComputedRef>),
    )

    return assigned
  }

  const store = createSetupStore(id, setup, options, pinia, true)
  return store
}

export const defineStore = (idOrOptions: any, setup?: any, setupOptions?: any) => {
  let id: string
  let options: any

  const isSetupStore = typeof setup === 'function'

  if (typeof idOrOptions === 'string') {
    id = idOrOptions
    options = isSetupStore ? setupOptions : setup
  }
  else {
    options = idOrOptions
    id = idOrOptions.id
  }
  function useStore(pinia?: Pinia) {
    if (pinia) {
      // 如果存在 需要切换成active
      setActivePinia(pinia)
    }
    pinia = activePinia!

    if (!pinia?._s.has(id)) {
      if (isSetupStore) {
        createSetupStore(id, setup, options, pinia)
      }
      else {
        // 如果没有创建过 去创建
        createOptionsStore(id, options, pinia)
      }
    }

    const store = pinia._s.get(id)
    return store
  }

  useStore.$id = id
  return useStore
}
