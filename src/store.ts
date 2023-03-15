import { toRefs } from 'vue-demi'
import { activePinia, setActivePinia } from './rootStore'
import type { Pinia } from './types.d'

function createSetupStore(id: string, setup: any, options: any, pinia: Pinia) {

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
  }

  return useStore
}
