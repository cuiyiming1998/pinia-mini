import type { App, Ref } from 'vue-demi'
import { effectScope, markRaw, ref } from 'vue-demi'
import { piniaSymbol } from './rootStore'
import type { Pinia, StateTree } from './types.d'

export const createPinia = (): Pinia => {
  const scope = effectScope(true)

  let localApp: App | undefined

  const _p: Pinia['_p'] = []

  const toBeInstalled: any[] = []

  const state = scope.run<Ref<Record<string, StateTree>>>(() =>
    ref<Record<string, StateTree>>({}),
  )!

  const pinia = markRaw({
    install(app: App) {
      // 给Vue.use用的
      pinia._a = localApp = app
      // privide pinia实例
      app.provide(piniaSymbol, pinia)
      // 注册全局$pinia
      app.config.globalProperties.$pinia = pinia

      // 加载pinia插件
      toBeInstalled.forEach(plugin => _p.push(plugin))
    },
    use(plugin: any) { // 这是pinia暴露的插件用法
      if (!localApp)
        toBeInstalled.push(plugin) // 将插件存入[]，待初始化的时候使用
      else
        _p.push(plugin)
      return this
    },
    state,
    _s: new Map(), // state对象
    _a: localApp!, // 实例
    _p, // 插件
  })

  return pinia
}
