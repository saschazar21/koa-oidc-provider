import Promise from 'bluebird';
import Router from 'koa-router';

import oidcRoutes from './oidc';
import { nuxtPrefix } from '../lib/tools/url';

const router = new Router();

export default async function bootstrapRoutes() {
  const result = await Promise.all([oidcRoutes()]);
  const oidc = result[0];

  router.use('/', oidc.routes());

  router.all('/', (ctx) => {
    ctx.redirect(nuxtPrefix);
    ctx.status = 301;
  });

  return router;
}
