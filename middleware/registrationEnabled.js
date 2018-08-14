const debug = require('debug');

const error = debug('error:router');

export default async function registrationEnabled({ app, redirect, store }) {
  try {
    const setup = await app.$axios.$get('/api/setup');
    if (!setup || !setup.registration) {
      throw new Error('Registration not enabled.');
    }
    return store.commit('form/setHeader', 'Register');
  } catch (e) {
    error(e.message || e);
    return redirect('/');
  }
}
