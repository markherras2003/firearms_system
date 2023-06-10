import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

const store = createStore({
  state() {
    return {
      user: null,
      currentUserRole: null,
      roles: [],
      permissions: [],
    }
  },
  mutations: {
    user(state, { user }) {
      state.user = user;
    },
    setCurrentUserRole(state, currentUserRole) {
      state.currentUserRole = currentUserRole;
    },
    setRoles(state, roles) {
      state.roles = roles;
    },
    setPermissions(state, permissions) {
      state.permissions = permissions;
    },
  },
  actions: {
    user({ commit }, user) {
      commit('user', { user });
    },
  },
  plugins: [createPersistedState()],
})

export default store;