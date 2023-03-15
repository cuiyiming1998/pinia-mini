import type { App } from 'vue-demi'
import { EffectScope, Ref } from 'vue-demi'

export interface Pinia {
  state: Ref<Record<string, StateTree>>
  _e: EffectScope
  _s: Map,
  _a: App,
  _p: any[]
}

export type StateTree = Record<string | number | symbol, any>