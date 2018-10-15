export default async function getClients({ app, store }) {
  const clients = store.getters['clients/clients'];
  const token = store.getters['user/access_token'];
  const ts = store.getters['clients/ts'];
  if (!clients || !clients.length || ts < new Date(Date.now() - 600000)) {
    try {
      const result = await app.$axios({
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: 'GET',
        url: '/api/clients',
      });
      return store.commit('clients/set', result.data);
    } catch (e) {
      return Promise.reject(e.message || e);
    }
  }
  return null;
}
