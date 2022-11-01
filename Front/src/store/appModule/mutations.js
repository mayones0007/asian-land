
export const mutations = {
  setLoginPopup(state) {
    state.showLoginPopup = !state.showLoginPopup
  },
  setIsDesktop(state, payload) {
    state.isDesktop = payload
  },
}