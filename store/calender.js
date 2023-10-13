export const state = () => ({
  events: ""
})

export const mutations = {
  setEvents(state, data) {
    state.events = data
  }
}