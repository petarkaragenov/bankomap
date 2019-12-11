import Vue from 'vue'
import axios from 'axios'
import App from './App.vue'
import router from './router'
import store from './store' 
import './assets/fonts/PlovdivDisplay-Regular.otf'
import './assets/fonts/PlovdivDisplay-Light.otf'
import './assets/css/style.css'

window.axios = axios

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
