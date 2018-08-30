const debug = require('debug');

const error = debug('error:nuxt');

export default async ({ app, store, redirect }) => {
  try {
    const expires = Date.parse(store.getters['user/token_expires']);
    if (Number.isNaN(expires) || new Date() > new Date(expires)) {
      throw new Error(`Invalid expiry date: ${new Date(expires)}`);
    }
    return true;
  } catch (e) {
    error(e.message || e);
    const token = store.getters['user/refresh_token'];
    const client = store.getters['setup/baseClient'];
    if (token && client.client_secret) {
      try {
        const tokenUrl = store.getters['setup/tokenUrl'];
        const sanitized = tokenUrl && tokenUrl.startsWith('/') ? tokenUrl : `/${tokenUrl}`;
        const result = await app.$axios({
          auth: {
            pass: client.client_secret,
            user: client.client_id,
          },
          data: {
            grant_type: 'refresh_token',
            refresh_token: token,
          },
          method: 'post',
          url: sanitized,
        });
        return store.commit('user/token', result.data);
      } catch (err) {
        error(err.message || err);
      }
    }
    // FIXME: Enter correct base URL
    return redirect('/login');
  }
};
