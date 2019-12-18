import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Catalogue from '../views/Catalogue.vue'
import Map from '../views/Map.vue'
import store from '../store/index'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/catalogue',
    name: 'catalogue',
    component: Catalogue
  },
  {
    path: '/map',
    name: 'office-map',
    component: Map,
    beforeEnter(to, from, next) {
      if (store.getters.getData) {
        return next()
      } else {
        return next({ name: 'home' })
      }
    }
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
