import Vue from 'vue'
import App from './App'
import uView from 'uview-ui'

Vue.config.productionTip = false
App.mpType = 'app'
Vue.use(uView)

const app = new Vue({
  ...App
})


// 为了兼容小程序及app端必须这样写才有效果
// #ifndef H5
app.$mount()
// #endif
