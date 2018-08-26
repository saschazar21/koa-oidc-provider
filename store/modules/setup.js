/* eslint-disable no-param-reassign */

const state = () => ({
  setup: null,
});

const getters = {
  registration(current) {
    return current.setup.registration;
  },
};

const mutations = {
  set(current, payload) {
    current.setup = payload;
  },
};

export default {
  getters,
  mutations,
  namespaced: true,
  state,
};
