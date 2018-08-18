const debug = require('debug');

const error = debug('error:router');

export default async function registrationEnabled(ctx) {
  try {
    const setup = await ctx.app.$axios.$get('/api/setup');
    if (setup && setup.registration) {
      /* eslint-disable-next-line no-param-reassign */
      ctx.route.meta = {
        ...ctx.route.meta,
        ...setup,
      };
    }
    if (process.server && ctx.req && ctx.req.client) {
      ctx.route.meta = {
        ...ctx.route.meta,
        client: ctx.req.client,
      };
    }
  } catch (e) {
    error(e.message || e);
    ctx.redirect('/error');
  }
}
