export const actions = {
  nuxtServerInit({ commit }, { req }) {
    if (req.state.user || req.user) {
      commit('user/set', req.state.user || req.user);
    }
  },
};

export { actions as default };
