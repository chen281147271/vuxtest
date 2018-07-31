// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from  'vuex'
import FastClick from 'fastclick'
import VueRouter from 'vue-router'
import App from './App'
import routes from'./router'
import store from './vuex/store'
import axios from  'axios'
import ElementUi from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import moment from 'moment'

Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(ElementUi)
Vue.use(moment)
Vue.prototype.$http=axios
const router = new VueRouter({
  routes
})

FastClick.attach(document.body)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    router,
  store,
  render: h => h(App)
}).$mount('#app-box')
