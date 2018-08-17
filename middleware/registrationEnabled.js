const debug = require('debug');

const error = debug('error:router');

export default async function registrationEnabled({ app, redirect, route }) {
  try {
    const setup = await app.$axios.$get('/api/setup');
    if (setup && setup.registration) {
      /* eslint-disable-next-line no-param-reassign */
      route.meta = {
        ...route.meta,
        ...setup,
      };
    }
  } catch (e) {
    error(e.message || e);
    redirect('/error');
  }
}
