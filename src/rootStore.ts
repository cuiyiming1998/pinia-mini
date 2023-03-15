import type { InjectionKey } from 'vue-demi'
import type { Pinia } from './types.d'

export const piniaSymbol = Symbol('pinia') as InjectionKey<Pinia>
export let activePinia: Pinia | undefined

export const setActivePinia = (pinia: Pinia | undefined) =>
  (activePinia = pinia)
