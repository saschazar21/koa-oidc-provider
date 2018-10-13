export default async function getClients({ app, store }) {
  const clients = store.getters['clients/clients'];
  const token = store.getters['user/access_token'];
  if (!clients || !clients.length) {
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
