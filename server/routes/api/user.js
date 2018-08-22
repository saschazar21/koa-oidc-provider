import Promise from 'bluebird';
import Router from 'koa-router';
import debug from 'debug';

import { bootstrapPassport } from '../../lib/auth';
import { getBaseClient } from '../../lib/config/clients';
import { baseUrl } from '../../lib/tools/url';
import { requireScopes, checkScopes } from '../../lib/tools/auth';

const error = debug('error:router');
const info = debug('info');
const router = new Router({
  prefix: '/user',
});

export default async function userRoutes() {
  try {
    const passport = await bootstrapPassport();
    const baseClient = await getBaseClient();

    router.post(
      '/',
      async (ctx, next) => requireScopes(ctx, next, ['user', 'user:create']),
      passport.authenticate(['bearer', 'basic']),
      async (ctx, next) => {
        try {
          if (ctx.state.user.clientId === baseClient.client_id && ctx.request.origin === baseUrl) {
            return next();
          }
          if (ctx.state.user.scope) {
            return checkScopes(ctx, next);
          }
          ctx.status = 403;
          throw new Error('Invalid request, check your authentication settings!');
        } catch (err) {
          error(err.message || err);
          ctx.status = ctx.status && ctx.status > 200 ? ctx.status : 500;
          ctx.body = {
            error: err.message,
          };
          return err;
        }
      },
      async (ctx) => {
        info(ctx.state.user);
        info(ctx.request.origin);
        ctx.status = 200;

        // FIXME Create logic for persisting user in database
        ctx.body = ctx.request.body;
      },
    );
    return router;
  } catch (e) {
    error(e.message || e);
    return Promise.reject(e);
  }
}
