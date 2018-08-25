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
  setClient(current, payload) {
    // eslint-disable-next-line no-param-reassign
    current = payload;
  },
};

export default {
  getters,
  mutations,
  namespaced: true,
  state,
};
