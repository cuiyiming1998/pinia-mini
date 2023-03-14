import type { Pinia } from './types.d'

export let activePinia: Pinia | undefined

export const setActivePinia = (pinia: Pinia | undefined) =>
  (activePinia = pinia)
