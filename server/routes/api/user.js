import Promise from 'bluebird';
import Router from 'koa-router';
import debug from 'debug';

import { bootstrapPassport } from '../../lib/auth';
import { getBaseClient } from '../../lib/config/clients';

const error = debug('error:router');
const router = new Router({
  prefix: '/user',
});

export default async function userRoutes() {
  try {
    const passport = await bootstrapPassport();
    const baseClient = await getBaseClient();

    router.post('/', passport.authenticate(['bearer', 'basic']), async (ctx) => {
      try {
        // eslint-disable-next-line no-underscore-dangle
        if (!ctx.state.user.client_secret || baseClient.client_id !== ctx.state.user._id) {
          /* Fill in rest here */
        }
        ctx.status = 200;
        ctx.body = null;
      } catch (err) {
        error(err.message || err);
        ctx.status = 500;
      }
    });
    return router;
  } catch (e) {
    error(e.message || e);
    return Promise.reject(e);
  }
}
