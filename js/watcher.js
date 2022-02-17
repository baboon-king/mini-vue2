import { Dep } from "./dep.js"
export class Watcher {
  constructor(vm, key, cb) {
    this.vm = vm
    this.key = key
    this.cb = cb

    // watcher记录到dep类的静态属性target
    Dep.target = this
    // 触发get方法,执行addSub
    this.oldValue = vm[key]
    // 添加后清空 防止溢出
    Dep.target = null
  }

  update() {
    let newValue = this.vm[this.key]
    if (this.oldValue === newValue) return
    this.cb(newValue)
  }
}