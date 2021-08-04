import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('token') || null,
    role: localStorage.getItem('role') || null,
    region: localStorage.getItem('region') || null,
    username: localStorage.getItem('username') || null
  },
  mutations: {
    login (state, data) {
      localStorage.setItem('token', data.token)
      localStorage.setItem('role', data.role)
      localStorage.setItem('username', data.username)
      state.role = data.role
      state.token = data.token
      state.username = data.username
      if (state.role === 'Librarian' || state.role === 'SuperLibrarian') {
        localStorage.setItem('region', data.region)
        state.region = data.region
      }
    },
    logout (state) {
      // 移除token
      localStorage.removeItem('token')
      localStorage.removeItem('role')
      localStorage.removeItem('username')
      localStorage.removeItem('region')
      state.username = null
      state.role = null
      state.token = null
      state.region = null
    }
  },
  actions: {
  }
})
