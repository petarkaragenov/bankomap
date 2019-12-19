import Vue from 'vue'
import Vuex from 'vuex'
// import { threadId } from 'worker_threads'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    data: null,
    location: null,
    routingParameters: {
      'mode': 'fastest;car',
      'waypoint0': null,
      'waypoint1': null,
      'representation': 'display',
      'routeAttributes': "summary"
    },
    leftPanelControls: 'bars'
  },
  mutations: {
    POPULATE(state, data) {
      state.data = data
    },
    SET_LOCATION(state, location) {
      state.location = location
    },
    SET_START_WAYPOINT(state, waypoint) {
      state.routingParameters['waypoint0'] = waypoint
    },
    SET_END_WAYPOINT(state, waypoint) {
      state.routingParameters['waypoint1'] = waypoint
    },
    CHANGE_LEFT_PANEL_CONTROL(state, icon) {
      state.leftPanelControls = icon
    }
  },
  actions: {
    populateData({ commit }, data) {
      commit('POPULATE', data)
    },
    setLocation({ commit }, location) {
      commit('SET_LOCATION', location)
    },
    setStartWaypoint({ commit }, waypoint) {
      commit('SET_START_WAYPOINT', waypoint)
    },
    setEndWaypoint({ commit }, waypoint) {
      commit('SET_END_WAYPOINT', waypoint)
    },
    changeLeftPanelControl({ commit }, icon) {
      commit('CHANGE_LEFT_PANEL_CONTROL', icon)
    }
  },
  getters: {
    getData(state) {
      return state.data
    },
    getLocation(state) {
      return state.location
    },
    getRoutingParameters(state) {
      return state.routingParameters
    },
    getLeftPanelControl(state) {
      return state.leftPanelControls
    }
  }
})
