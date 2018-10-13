const state = ({
  tokens: [],
});

const getters = {
  tokens(current) {
    return current.tokens;
  },
};

const mutations = {
  remove(current, payload) {
    /* eslint-disable-next-line no-underscore-dangle */
    const idx = current.findIndex(token => token._id === payload._id);
    if (idx < 0) {
      return current;
    }
    /* eslint-disable-next-line no-param-reassign */
    current = [
      ...current.slice(0, idx),
      ...current.slice(idx + 1),
    ];
    return current;
  },
  set(current, payload) {
    /* eslint-disable-next-line no-param-reassign */
    current.tokens = [
      ...payload,
    ];
  },
};

export default {
  getters,
  mutations,
  namespaced: true,
  state,
};
