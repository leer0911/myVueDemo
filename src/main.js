// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

// element UI
import '../theme/index.css'
// import { Button, Select } from 'element-ui'
import './assets/iconfont.js' // Symbol 代码
import vueIconfont from 'components/icon.js' // icon 组件

Vue.component('icon', vueIconfont)

// Vue.component(Button.name, Button)
// Vue.component(Select.name, Select)
Vue.config.productionTip = false

// Vue.directive('drag', function (el) {
//   console.log(el)
//   el.onmousedown = function (ev) {
//     console.log(ev)
//     document.onmousemove = function (ev) {
//       let l = ev.clientX - 288
//       let t = ev.clientY - 170
//       let val = `translate(${l},${t}) scale(3)`
//       console.log(val)
//       el.setAttribute('transform', val)
//       console.log(el)
//     }
//     document.onmouseup = function () {
//       document.onmousemove = null
//       document.onmouseup = null
//     }
//   }
// })

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
  store: store
})
