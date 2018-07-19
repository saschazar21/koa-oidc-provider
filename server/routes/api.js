import Promise from 'bluebird';
import Router from 'koa-router';

import clientRoutes from './api/client';

const router = new Router({
  prefix: '/api',
});

export default async function apiRoutes() {
  const result = await Promise.all([clientRoutes]);

  result.forEach(route => router.use(route.routes()));

  return router;
}
