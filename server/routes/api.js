import Promise from 'bluebird';
import Router from 'koa-router';

import clientRoutes from './api/clients';
import setupRoutes from './api/setup';
import tokenRoutes from './api/tokens';
import userRoutes from './api/users';

const router = new Router({
  prefix: '/api',
});

export default async function apiRoutes(customClient) {
  const result = await Promise.all([
    clientRoutes(customClient),
    setupRoutes(),
    tokenRoutes(customClient),
    userRoutes(customClient),
  ]);

  result.forEach(route => router.use(route.routes()));

  return router;
}
