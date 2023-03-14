import { Ref } from 'vue-demi'

export interface Pinia {
  state: Ref<Record<string, StateTree>>
}

export type StateTree = Record<string | number | symbol, any>