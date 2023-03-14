import type { Ref } from 'vue-demi'
import { effectScope, markRaw, ref } from 'vue-demi'
import type { Pinia, StateTree } from './types.d'

export const createPinia = (): Pinia => {
  const scope = effectScope(true)
  const state = scope.run<Ref<Record<string, StateTree>>>(() =>
    ref<Record<string, StateTree>>({}),
  )!

  const pinia = markRaw({ state })

  return pinia
}
