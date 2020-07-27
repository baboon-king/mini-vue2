import { Vue } from "./js/vue"

let vm = new Vue({
  el: '#app',
  data() {
    return {
      msg: 'Hello Vue',
      count: 100,
      person: { name: 'zs' }
    }
  },
})
// vm.msg = { test: 'hello' }
console.log(vm);

