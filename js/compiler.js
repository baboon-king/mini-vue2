import { Watcher } from "./watcher"
export class Compiler {
  constructor(vm) {
    this.el = vm.$el
    this.vm = vm
    this.compile(this.el)
  }

  // 编译模板 处理文本和元素节点
  compile(el) {
    let childNodes = el.childNodes
    Array.from(childNodes).forEach(node => {
      if (this.isTextNode(node)) {
        this.compileText(node)
      }
      if (this.isElementNode(node)) {
        this.compileElement(node)
      }
      if (node.childNodes && node.childNodes.length) {
        this.compile(node)
      }
    })

  }
  // 编译元素节点,处理指令
  compileElement(node) {

    Array.from(node.attributes).forEach(attr => {
      let attrName = attr.name
      if (this.isDirective(attrName)) {
        // v-text  ---> text
        attrName = attrName.substr(2)
        // dataKey
        let key = attr.value
        this.update(node, key, attrName)
      }
    })

  }

  update(node, key, directiveName) {
    const updateFn = this[directiveName + 'Updater']
    updateFn && updateFn.call(this, node, this.vm[key], key)
  }

  // v-text
  textUpdater(node, value, key) {
    node.textContent = value
    new Watcher(this.vm, key, (newValue) => {
      node.textContent = newValue
    })
  }
  // v-model
  modelUpdater(node, value, key) {
    node.value = value
    new Watcher(this.vm, key, (newValue) => {
      node.value = newValue
    })
    // 双向绑定
    node.addEventListener('input', () => {
      this.vm[key] = node.value
    })
  }
  // 编译 文本节点,处理插值表达式
  compileText(node) {
    // console.dir(node);
    // {{ msg }} 匹配 {{}} 中的表达式
    let reg = /\{\{(.+?)\}\}/
    let value = node.textContent
    if (reg.test(value)) {
      let key = RegExp.$1.trim()
      node.textContent = this.vm[key]
      // value.replace(reg, this.vm[key])

      // 创建watcher 响应更新视图
      new Watcher(this.vm, key, (newValue) => {
        node.textContent = newValue
      })
    }
  }
  // 是否是指令
  isDirective(attrName) {
    return attrName.startsWith('v-')
  }
  // 是否是文本节点
  isTextNode(node) {
    return node.nodeType === 3
  }
  // 是否是问题节点
  isElementNode(node) {
    return node.nodeType === 1
  }
}