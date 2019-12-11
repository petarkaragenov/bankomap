import Vue from 'vue'
import Vuex from 'vuex'
// import { threadId } from 'worker_threads'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    data: null
  },
  mutations: {
    POPULATE(state, data) {
      state.data = data
    }
  },
  actions: {
    populateData({ commit }, data) {
      commit('POPULATE', data)
    }
  },
  getters: {
    getData(state) {
      return state.data
    }
  }
})
