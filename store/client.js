export const state = () => Object({});

export const getters = {
  clientId(current) {
    return current.client_id;
  },
  clientSecret(current) {
    return current.client_secret;
  },
};

export const mutations = {
  set(current, payload) {
    // eslint-disable-next-line no-param-reassign
    current = payload;
  },
};
