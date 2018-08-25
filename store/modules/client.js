/* eslint-disable no-param-reassign */

const state = () => ({
  client_id: null,
  client_secret: null,
});

const getters = {
  clientId(current) {
    return current.client_id;
  },
  clientSecret(current) {
    return current.client_secret;
  },
};

const mutations = {
  set(current, payload) {
    current.client_id = payload.client_id;
    current.client_secret = payload.client_secret;
  },
};

export default {
  getters,
  mutations,
  namespaced: true,
  state,
};
