import Promise from 'bluebird';
import Router from 'koa-router';
import debug from 'debug';

import clientRoutes from './api/client';
import registrationEnabled from '../lib/tools/registration';
import userRoutes from './api/user';

const error = debug('error:router');

const router = new Router({
  prefix: '/api',
});

export default async function apiRoutes() {
  const result = await Promise.all([
    clientRoutes(),
    userRoutes(),
  ]);

  result.forEach(route => router.use(route.routes()));

  router.get('/setup', async (ctx) => {
    try {
      const isEnabled = await registrationEnabled();
      ctx.status = 200;
      ctx.body = {
        registration: isEnabled,
      };
    } catch (e) {
      error(e.message || e);
      ctx.status = 500;
      ctx.body = {
        error: e.message || e,
      };
    }
  });

  return router;
}
