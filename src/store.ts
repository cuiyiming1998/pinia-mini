import type { EffectScope } from 'vue-demi'
import { effectScope, reactive, toRefs } from 'vue-demi'
import { activePinia, setActivePinia } from './rootStore'
import { assign } from './shared'
import type { Pinia } from './types.d'

function createSetupStore(id: string, setup: any, options: any, pinia: Pinia) {
  let scope!: EffectScope
  const $id = id
  const partialStore = {
    _p: pinia,
    $id,
  }

  const store = reactive(assign({}, partialStore))
  pinia._s.set(id, store)

  const setupStore = pinia._e.run(() => {
    scope = effectScope()
    // 执行setup获得localState
    return scope.run(() => setup())
  })
  for (const key in setupStore) {
    const prop = setupStore[key]
    // TODO: 把prop放进state.value[$id]
  }
}

function createOptionsStore(id: string, options: any, pinia: Pinia) {
  const { state } = options

  const initialState = pinia.state.value[id]

  // 创建setup
  function setup() {
    if (!initialState)
      pinia.state.value[id] = state ? state() : {}

    const localState = toRefs(pinia.state.value[id])

    return { localState }
  }

  const store = createSetupStore(id, setup, options, pinia)

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
      // 如果没有创建过 去创建
      createOptionsStore(id, options, pinia)
    }

    const store = pinia._s.get(id)
    return store
  }

  return useStore
}
