import { isReactive, isRef, toRaw, toRef } from 'vue-demi'

// 之前在create的时候会把state里面的全部转化为ref
// 所以store里面的所有reactive ref都是state里面的值
// 作为一个对象返回就好了
export function storeToRefs(store: any): Record<string, any> {
  store = toRaw(store)

  const refs = {}
  for (const key in store) {
    const value = store[key]

    if (isReactive(value) || isRef(value))
      // @ts-expect-error
      refs[key] = toRef(store, key)
  }

  return refs
}
