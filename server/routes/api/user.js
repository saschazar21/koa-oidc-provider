import Promise from 'bluebird';
import Router from 'koa-router';
import debug from 'debug';

import { bootstrapPassport } from '../../lib/auth';
import { getBaseClient } from '../../lib/config/clients';
import { baseUrl } from '../../lib/tools/url';

const error = debug('error:router');
const info = debug('info');
const router = new Router({
  prefix: '/user',
});

export default async function userRoutes() {
  try {
    const passport = await bootstrapPassport();
    const baseClient = await getBaseClient();

    router.post('/', passport.authenticate(['bearer', 'basic']), async (ctx) => {
      try {
        if (ctx.state.user.clientId === baseClient.client_id && ctx.request.origin !== baseUrl) {
          ctx.status = 401;
          throw new Error(`Forbidden URL for basic authentication: ${ctx.request.origin}`);
        }
        info(ctx.state.user);
        info(ctx.request.origin);
        ctx.status = 200;

        // FIXME Create logic for persisting user in database
        ctx.body = ctx.request.body;
      } catch (err) {
        error(err.message || err);
        ctx.status = ctx.status && ctx.status > 200 ? ctx.status : 500;
      }
    });
    return router;
  } catch (e) {
    error(e.message || e);
    return Promise.reject(e);
  }
}
