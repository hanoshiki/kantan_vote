export const state = () => ({
  selected: -1
})

export const mutations = {
  setSelected(state, payload) {
    state.selected = payload
  }
}

export const actions = {
  setSelected({ commit }, payload) {
    commit('setSelected', payload)
  }
}

export const getters = {
  selected(state) {
    return state.selected
  }
}
