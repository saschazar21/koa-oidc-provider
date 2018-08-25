import Promise from 'bluebird';
import Router from 'koa-router';

import clientRoutes from './api/client';
import userRoutes from './api/user';

const router = new Router({
  prefix: '/api',
});

export default async function apiRoutes() {
  const result = await Promise.all([
    clientRoutes(),
    userRoutes(),
  ]);

  result.forEach(route => router.use(route.routes()));

  return router;
}
