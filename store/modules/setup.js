/* eslint-disable no-param-reassign */

const state = () => ({
  registration: null,
});

const mutations = {
  set(current, payload) {
    current.registration = payload.registration;
  },
};

export default {
  mutations,
  namespaced: true,
  state,
};
