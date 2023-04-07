import { computed, effectScope, isReactive, isRef, markRaw, reactive, toRaw, toRefs, unref } from 'vue-demi'
import type { ComputedRef, EffectScope } from 'vue-demi'
import { activePinia, setActivePinia } from './rootStore'
import { assign, isComputed } from './shared'
import type { Pinia } from './types.d'

/**
 * description
 * 创建setup类型的store
 *
 * @param { id } 唯一id
 * @param { setup } setup函数
 * @param { options }
 * @param { pinia } 实例
 * @param { isOptionsStore } 是否是options创建的形式
 * @return z
 *
 */
function createSetupStore(
  id: string,
  setup: any,
  options: any,
  pinia: Pinia,
  isOptionsStore?: boolean,
) {
  let scope!: EffectScope
  const $id = id

  function $patch(partialStateOrMutator: any) {
    if (typeof partialStateOrMutator === 'function')
      partialStateOrMutator(pinia.state.value[$id])
  }

  function $reset() {
    if (isOptionsStore) {
      const { state } = options
      const newState = state ? state() : {}
      $patch(($state: any) => {
        assign($state, newState)
      })
    }
  }
  // 初始化store
  const partialStore = {
    _p: pinia,
    $id,
    $onAction: {},
    $patch,
    $reset,
    $subscribe: {},
    $dispose: {},
  }

  const initialState = pinia.state.value[$id]
  // 如果不是optionsStore的话 这里应该初始化一下store
  if (!isOptionsStore && !initialState)
    pinia.state.value[$id] = {}

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
        // setupStore的话需要把setup()执行之后的结果放进当前id对应的store中
        pinia.state.value[$id][key] = unref(prop)
      }
    }
    else if (typeof prop === 'function') {
      // TODO: 处理action
    }
  }

  // 最后进行合并
  assign(toRaw(store), setupStore)

  // 生成$state
  Object.defineProperty(store, '$state', {
    get: () => pinia.state.value[$id],
    set: (state) => {
      $patch(($state: any) => {
        assign($state, state)
      })
    },
  })
  return store
}

/**
 * description
 * 将options类型的store转化成setup函数
 *
 * @param { id } 当前store的唯一id
 * @param { options } 创建的options参数
 * @param { pinia } 当前活跃的pinia实例
 * @return z
 *
 */
function createOptionsStore(id: string, options: any, pinia: Pinia) {
  const { state, actions, getters } = options

  const initialState = pinia.state.value[id]

  // 创建setup
  function setup() {
    // 初始化
    if (!initialState)
      pinia.state.value[id] = state ? state() : {}

    // 获取state里面的值
    const localState = toRefs(pinia.state.value[id])

    // 拼接state, action, getters
    const assigned = assign(
      localState,
      actions,
      Object.keys(getters || {}).reduce((computedGetters, name) => {
        // 为每个getter创建响应式数据 -> 也就是computed
        computedGetters[name] = markRaw(
          computed(() => {
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

    // 如果没有创建过 去创建
    if (!pinia?._s.has(id)) {
      // setup类型
      if (isSetupStore) {
        createSetupStore(id, setup, options, pinia)
      }
      else {
        // options类型 需要转化为setup类型
        createOptionsStore(id, options, pinia)
      }
    }

    const store = pinia._s.get(id)
    return store
  }

  useStore.$id = id
  return useStore
}
