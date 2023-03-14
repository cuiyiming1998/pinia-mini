import { markRaw } from 'vue-demi'

export const createPinia = () => {
  const pinia = markRaw({})

  return pinia
}
