import Vue from 'vue'
import axios from 'axios'
import VueSwal from 'vue-swal'
import { library } from '@fortawesome/fontawesome-svg-core'
import { 
  faPhoneSquareAlt, 
  faAddressCard, 
  faEnvelope, 
  faFax, 
  faExternalLinkAlt,
  faHome, 
  faSearchLocation, 
  faRoute,
  faTimes,
  faBars
} from '@fortawesome/free-solid-svg-icons'
import App from './App.vue'
import router from './router'
import store from './store' 
import 'vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css'
import './assets/css/style.css'

Vue.use(VueSwal)

library.add(
  faPhoneSquareAlt, 
  faAddressCard, 
  faEnvelope, 
  faFax, 
  faExternalLinkAlt, 
  faHome, 
  faSearchLocation, 
  faRoute,
  faTimes,
  faBars
)

window.axios = axios

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
