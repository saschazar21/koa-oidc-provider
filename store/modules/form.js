/* eslint-disable no-param-reassign */
const state = () => Object({
  header: null,
  body: {},
});

const mutations = {
  /* eslint-disable-next-line no-unused-vars */
  reset(current) {
    current = {
      header: null,
      body: {},
    };
  },
  setHeader(current, payload) {
    current.header = payload;
  },
  updateBody(current, payload) {
    current.body = {
      ...current.body,
      ...payload,
    };
  },
};

export default {
  mutations,
  namespaced: true,
  state,
};
