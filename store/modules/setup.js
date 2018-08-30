/* eslint-disable no-param-reassign */

const state = () => ({
  setup: null,
});

const getters = {
  baseClient(current) {
    return current.setup.client;
  },
  grant(current) {
    return current.setup.grant;
  },
  registration(current) {
    return current.setup.registration;
  },
  return_to(current) {
    return current.setup.return_to;
  },
  scope(current) {
    return current.setup.scope;
  },
  tokenUrl(current) {
    return current.setup.tokenUrl;
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
