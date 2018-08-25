/* eslint no-param-reassign: 0 */
const state = () => ({});

const mutations = {
  reset(current, user) {
    current = {
      ...user,
    };
  },
};

export default {
  mutations,
  namespaced: true,
  state,
};
