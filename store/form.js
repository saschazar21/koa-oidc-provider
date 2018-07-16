/* eslint-disable no-param-reassign */
export const state = () => Object({
  header: null,
  body: {},
});

export const mutations = {
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
