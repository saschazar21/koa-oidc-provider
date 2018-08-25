/* eslint no-param-reassign: 0 */
const state = () => ({
  email: null,
  family_name: null,
  given_name: null,
});

const getters = {
  email(current) {
    return current.email;
  },
  firstName(current) {
    return current.given_name;
  },
  name(current) {
    return `${current.given_name} ${current.family_name}`;
  },
};

const mutations = {
  set(current, user) {
    current.email = user.email;
    current.family_name = user.family_name;
    current.given_name = user.given_name;
  },
};

export default {
  getters,
  mutations,
  namespaced: true,
  state,
};
