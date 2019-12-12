import Vue from 'vue'
import axios from 'axios'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPhoneSquareAlt, faAddressCard, faEnvelope, faFax, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'
import App from './App.vue'
import router from './router'
import store from './store' 
import './assets/fonts/PlovdivDisplay-Regular.otf'
import './assets/fonts/PlovdivDisplay-Light.otf'
import './assets/fonts/PlovdivSans.otf'
import './assets/css/style.css'

library.add(faPhoneSquareAlt, faAddressCard, faEnvelope, faFax, faExternalLinkAlt)

window.axios = axios

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
