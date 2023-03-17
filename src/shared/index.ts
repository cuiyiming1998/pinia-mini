import type { ComputedRef } from 'vue-demi'
import { isRef } from 'vue-demi'

export const assign = Object.assign

export function isComputed<T>(value: ComputedRef<T> | unknown): value is ComputedRef<T>
export function isComputed(o: any): o is ComputedRef {
  return !!(isRef(o) && (o as any).effect)
}
