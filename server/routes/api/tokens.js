import debug from 'debug';
import Router from 'koa-router';
import { bootstrapPassport } from '../../lib/auth';
import TokenAdapter from '../../lib/db/adapter/tokenAdapter';
import { requireScopes } from '../../lib/tools/auth';

const error = debug('error:router');
const router = new Router({
  prefix: '/tokens',
});

export default async function tokenRoutes(customClient) {
  const passport = await bootstrapPassport(customClient);
  const adapter = new TokenAdapter('AccessToken', customClient);

  router.get(
    '/',
    passport.authenticate(['bearer']),
    async (ctx, next) => requireScopes(ctx, next, ['token']),
    async (ctx) => {
      try {
        /* eslint-disable-next-line no-underscore-dangle */
        const result = await adapter.get(ctx.state.user._id);
        ctx.status = 200;
        ctx.body = result.map(token => token.toJSON());
      } catch (e) {
        error(e.message || e);
        ctx.status = e.statusCode || 500;
        ctx.body = {
          error: e.message || e,
        };
      }
    },
  );

  return router;
}
