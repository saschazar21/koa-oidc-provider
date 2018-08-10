import Promise from 'bluebird';
import Router from 'koa-router';

import apiRoutes from './api';
import authRoutes from './auth';
import oidcRoutes from './oidc';
import { nuxtPrefix } from '../lib/tools/url';

const router = new Router();

export default async function bootstrapRoutes() {
  const result = await Promise.all([
    apiRoutes(),
    authRoutes(),
    oidcRoutes(),
  ]);

  result.forEach(route => router.use(route.routes()));

  router.all('/', (ctx) => {
    ctx.redirect(nuxtPrefix);
    ctx.status = 301;
  });

  return router;
}
