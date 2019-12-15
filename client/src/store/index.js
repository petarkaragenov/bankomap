import Vue from 'vue'
import Vuex from 'vuex'
// import { threadId } from 'worker_threads'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    data: null,
    location: null
  },
  mutations: {
    POPULATE(state, data) {
      state.data = data
    },
    SET_LOCATION(state, location) {
      state.location = location
    }
  },
  actions: {
    populateData({ commit }, data) {
      commit('POPULATE', data)
    },
    setLocation({ commit }, location) {
      commit('SET_LOCATION', location)
    }
  },
  getters: {
    getData(state) {
      return state.data
    },
    getLocation(state) {
      return state.location
    }
  }
})
