/* eslint-disable no-param-reassign */
const state = () => ({
  clients: [],
});

const getters = {
  clients(current) {
    return current.clients;
  },
};

const mutations = {
  add(current, payload) {
    const addition = Array.isArray(payload) ? payload : [payload];
    /* eslint-disable-next-line no-underscore-dangle */
    const sanitized = addition.filter(el => current.clients.findIndex(e => e._id === el._id) < 0);
    current.clients = [
      ...current.clients,
      ...sanitized,
    ];
  },
  remove(current, payload) {
    const subtraction = Array.isArray(payload) ? payload : [payload];
    subtraction.forEach((el) => {
      /* eslint-disable-next-line no-underscore-dangle */
      const idx = current.clients.findIndex(available => available._id === el._id);
      if (idx < 0) {
        return null;
      }
      const removed = [
        ...current.clients.slice(0, idx),
        ...current.clients.slice(idx + 1),
      ];
      current.clients = removed;
      return true;
    });
  },
  set(current, payload) {
    const p = Array.isArray(payload) ? payload : [payload];
    current.clients = [
      ...p,
    ];
  },
};

export default {
  getters,
  mutations,
  namespaced: true,
  state,
};
