/* eslint-disable no-param-reassign */

const state = () => ({});

const mutations = {
  setup(current, payload) {
    current = {
      ...payload,
    };
  },
};

export default {
  mutations,
  namespaced: true,
  state,
};
