/* eslint no-param-reassign: 0 */
const state = () => ({
  user: null,
});

const getters = {
  email(current) {
    return current.user
      ? current.user.email
      : null;
  },
  firstName(current) {
    return current.user
      ? current.user.given_name
      : null;
  },
  name(current) {
    return current.user
      ? `${current.user.given_name} ${current.user.family_name}`
      : null;
  },
  refresh_token(current) {
    if (!current.user || !current.user.token) {
      return null;
    }
    return current.user.token.refresh_token;
  },
  token_expires(current) {
    if (!current.user || !current.user.token) {
      return null;
    }
    return current.user.token.expires_at;
  },
  user(current) {
    return current.user;
  },
};

const mutations = {
  set(current, user) {
    current.user = {
      token: current.user ? current.user.token : null,
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
