import Router from 'koa-router';
import debug from 'debug';

import ClientAdapter from '../../lib/db/adapter/clientAdapter';

const error = debug('error:router');
const adapter = new ClientAdapter();
const router = new Router({
  prefix: '/client',
});

export default function clientRoutes() {
  router.get('/', async (ctx) => {
    try {
      ctx.status = 200;
      // eslint-disable-next-line no-underscore-dangle
      ctx.body = await adapter.get(ctx.state.user._id);
    } catch (e) {
      error(e.message || e);
      ctx.status = e.statusCode || 500;
      ctx.body = { error: e.message || e };
    }
  });
  // Don't use POST /, as this is default for dynamic client registration!

  router.get('/:id/reset', async (ctx) => {
    try {
      ctx.status = 200;
      ctx.body = await adapter.reset(ctx.params.id);
    } catch (e) {
      error(e.message || e);
      ctx.status = e.statusCode || 500;
      ctx.body = { error: e.message || e };
    }
  });

  router.put('/:id/update', async (ctx) => {
    if (!ctx.req.body || ctx.req.body.client_secret) {
      const err = ctx.req.body ? 'Updating client secret is not allowed' : 'No request body found.';
      error(err);
      ctx.status = 400;
      ctx.body = { error: err };
    }
    try {
      ctx.status = 200;
      ctx.body = await adapter.upsert(ctx.params.id, ctx.req.body);
    } catch (e) {
      error(e.message || e);
      ctx.status = e.statusCode || 500;
      ctx.body = { error: e.message || e };
    }
  });

  // TODO: Add delete route

  return router;
}
