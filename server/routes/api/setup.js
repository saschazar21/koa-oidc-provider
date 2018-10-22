import Router from 'koa-router';
import debug from 'debug';

import { responseTypes } from '../../lib/config/responseTypes';
import { grantTypes } from '../../lib/tools/grantTypes';

const error = debug('error:router');
const info = debug('info');
const router = new Router({
  prefix: '/setup',
});

export default async function setupRoutes() {
  router.get(
    '/granttypes',
    (ctx) => {
      try {
        ctx.status = 200;
        ctx.body = grantTypes;
        info(`Supported grant types: ${grantTypes.join(', ')}`);
      } catch (e) {
        error(e.message || e);
        ctx.status = e.statusCode || 500;
        ctx.body = { error: e.message || e };
      }
    },
  );

  router.get(
    '/responsetypes',
    (ctx) => {
      try {
        ctx.status = 200;
        ctx.body = responseTypes;
        info(`Supported response types: ${responseTypes.join(', ')}`);
      } catch (e) {
        error(e.message || e);
        ctx.status = e.statusCode || 500;
        ctx.body = { error: e.message || e };
      }
    },
  );

  return router;
}
