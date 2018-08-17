const debug = require('debug');

const error = debug('error:router');

export default async function registrationEnabled(ctx) {
  try {
    const setup = await ctx.app.$axios.$get('/api/setup');
    if (setup && setup.registration) {
      ctx.registrationEnabled = setup.registration;
    }
  } catch (e) {
    error(e.message || e);
    ctx.redirect('/');
  }
}
