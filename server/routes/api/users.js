import Promise from 'bluebird';
import Router from 'koa-router';
import debug from 'debug';

import { bootstrapPassport } from '../../lib/auth';
import { getBaseClient } from '../../lib/config/clients';
import { baseUrl } from '../../lib/tools/url';
import { requireScopes, checkScopes } from '../../lib/tools/auth';
import userModel from '../../lib/db/models/user';

const error = debug('error:router');
const info = debug('info');
const router = new Router({
  prefix: '/users',
});

export default async function userRoutes(customClient) {
  try {
    const promises = await Promise.all([
      await bootstrapPassport(customClient),
      await getBaseClient(customClient),
      await userModel(customClient),
    ]);
    const passport = promises[0];
    const baseClient = promises[1];
    const User = promises[2];

    router.post(
      '/',
      passport.authenticate(['bearer', 'basic']),
      async (ctx, next) => requireScopes(ctx, next, ['user', 'user:create']),
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

        try {
          const user = new User(ctx.request.body);
          const result = await user.save();
          info(user);
          ctx.body = {
            email: result.get('email'),
            family_name: result.get('family_name'),
            given_name: result.get('given_name'),
            picture: result.get('picture'),
          };
        } catch (err) {
          error(err.message || err);
          ctx.status = 400;
          ctx.body = {
            error: err.message || err,
          };
        }
      },
    );
    return router;
  } catch (e) {
    error(e.message || e);
    return Promise.reject(e);
  }
}
