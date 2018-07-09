import Promise from 'bluebird';
import Router from 'koa-router';

import oidcRoutes from './oidc';
import { nuxtPrefix } from '../lib/tools/url';
import authRoutes from './auth';

const router = new Router();

export default async function bootstrapRoutes() {
  const result = await Promise.all([oidcRoutes(), authRoutes()]);
  const oidc = result[0];
  const auth = result[1];

  router.use('/', auth.routes());
  router.use('/', oidc.routes());

  router.all('/', (ctx) => {
    ctx.redirect(nuxtPrefix);
    ctx.status = 301;
  });

  return router;
}
