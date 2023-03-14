import { beforeEach, describe, it } from 'vitest'
import { createPinia, setActivePinia } from '../src'

describe('state', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })
  it('can directly access state at the store level', () => {

  })
})
