/* eslint-disable no-param-reassign */
function findIndex(current, payload) {
  const idx = current.clients.findIndex(available => available.client_id === payload.client_id);
  return idx < 0 ? null : idx;
}

const state = () => ({
  clients: [],
  ts: 0,
});

const getters = {
  client(current) {
    return (id) => {
      const idx = findIndex(current, { client_id: id });
      return idx === null ? null : current.clients[idx];
    };
  },
  clients(current) {
    return current.clients;
  },
  ts(current) {
    return new Date(current.ts * 1000);
  },
};

const mutations = {
  add(current, payload) {
    const addition = Array.isArray(payload) ? payload : [payload];
    const sanitized = addition.filter(el => findIndex(current, el) === null);
    current.clients = [
      ...sanitized,
      ...current.clients,
    ];
  },
  remove(current, payload) {
    const subtraction = Array.isArray(payload) ? payload : [payload];
    subtraction.forEach((el) => {
      const idx = findIndex(current, el);
      if (findIndex === null) {
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
  replace(current, payload) {
    const idx = findIndex(current, payload);
    if (idx === null) {
      return null;
    }
    const replaced = [
      ...current.clients.slice(0, idx),
      payload,
      ...current.clients.slice(idx + 1),
    ];
    current.clients = replaced;
    return true;
  },
  set(current, payload) {
    const p = Array.isArray(payload) ? payload : [payload];
    current.ts = Math.floor(Date.now() * 0.001);
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
