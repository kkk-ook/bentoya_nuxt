export const state = () => ({
  successMessage: ""
})

export const mutations = {
  setMessage(state, message) {
    state.successMessage = message;
  },
  deleteMessage(state) {
    state.successMessage = "";
  }
}