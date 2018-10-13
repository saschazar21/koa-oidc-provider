export default async function getTokens({ app, store }) {
  const tokens = store.getters['tokens/tokens'];
  const token = store.getters['user/access_token'];
  if (!tokens || !tokens.length) {
    try {
      const result = await app.$axios({
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: 'GET',
        url: '/api/tokens',
      });
      return store.commit('tokens/set', result.data);
    } catch (e) {
      return Promise.reject(e.message || e);
    }
  }
  return null;
}
