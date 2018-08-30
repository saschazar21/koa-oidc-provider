/* eslint no-param-reassign: 0 */
const state = () => ({
  user: null,
});

const getters = {
  email(current) {
    return current.user.email;
  },
  firstName(current) {
    return current.user.given_name;
  },
  name(current) {
    return `${current.user.given_name} ${current.user.family_name}`;
  },
  refresh_token(current) {
    if (!current.user) {
      return null;
    }
    return current.user.token.refresh_token;
  },
  token_expires(current) {
    if (!current.user) {
      return null;
    }
    return current.user.token.expires_in;
  },
  user(current) {
    return current.user;
  },
};

const mutations = {
  set(current, user) {
    current.user = {
      token: {},
      ...user,
    };
  },
  token(current, token) {
    current.user = {
      ...current.user,
      token,
    };
  },
};

export default {
  getters,
  mutations,
  namespaced: true,
  state,
};
