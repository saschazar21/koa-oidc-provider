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
  user(current) {
    return current.user;
  },
};

const mutations = {
  set(current, user) {
    current.user = user;
  },
};

export default {
  getters,
  mutations,
  namespaced: true,
  state,
};
