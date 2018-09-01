/* eslint-disable no-param-reassign */

const state = () => ({
  client: null,
});

const getters = {
  client(current) {
    return current.client;
  },
  clientId(current) {
    return current.client ? current.client.client_id : null;
  },
  clientSecret(current) {
    return current.client ? current.client.client_secret : null;
  },
};

const mutations = {
  set(current, payload) {
    current.client = payload;
  },
};

export default {
  getters,
  mutations,
  namespaced: true,
  state,
};
