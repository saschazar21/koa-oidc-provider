/* eslint-disable no-param-reassign */

const state = () => ({
  setup: {},
});

const getters = {
  baseClient(current) {
    return current.setup.client;
  },
  baseUrl(current) {
    return current.setup.baseUrl;
  },
  grant(current) {
    return current.setup.grant;
  },
  grant_types(current) {
    return current.setup.grantTypes;
  },
  registration(current) {
    return current.setup.registration;
  },
  response_types(current) {
    return current.setup.responseTypes;
  },
  return_to(current) {
    return current.setup.return_to;
  },
  routes(current) {
    return current.setup.routes;
  },
  scope(current) {
    return current.setup.scope;
  },
  tokenUrl(current) {
    return current.setup.routes.tokenUrl;
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
