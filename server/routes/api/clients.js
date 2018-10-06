import Router from 'koa-router';
import debug from 'debug';

import ClientAdapter from '../../lib/db/adapter/clientAdapter';
import { bootstrapPassport } from '../../lib/auth';

const error = debug('error:router');
const router = new Router({
  prefix: '/clients',
});

export default async function clientRoutes(customClient) {
  const passport = await bootstrapPassport(customClient);
  const adapter = new ClientAdapter(null, customClient);
  router.get(
    '/',
    passport.authenticate(['bearer']),
    async (ctx) => {
      try {
        // eslint-disable-next-line no-underscore-dangle
        const result = await adapter.get(ctx.state.user._id);
        if (!result) {
          throw new Error('Something went wrong while fetching clients.');
        }
        ctx.status = 200;
        ctx.body = result.map(client => client.toJSON());
      } catch (e) {
        error(e.message || e);
        ctx.status = e.statusCode || 500;
        ctx.body = { error: e.message || e };
      }
    },
  );
  // Don't use POST /, as this is default for dynamic client registration!

  router.get('/:id/reset', async (ctx) => {
    try {
      const result = await adapter.reset(ctx.params.id);
      if (!result) {
        throw new Error('Something went wrong while resetting the password.');
      }
      ctx.status = 200;
      ctx.body = result.toJSON();
    } catch (e) {
      error(e.message || e);
      ctx.status = e.statusCode || 500;
      ctx.body = { error: e.message || e };
    }
  });

  router.put('/:id', async (ctx) => {
    if (!ctx.req.body || ctx.req.body.client_secret) {
      const err = ctx.req.body ? 'Updating client secret is not allowed' : 'No request body found.';
      error(err);
      ctx.status = 400;
      ctx.body = { error: err };
    }
    try {
      const result = await adapter.upsert(ctx.params.id, ctx.req.body);
      ctx.status = 200;
      ctx.body = result.toJSON();
    } catch (e) {
      error(e.message || e);
      ctx.status = e.statusCode || 500;
      ctx.body = { error: e.message || e };
    }
  });

  router.delete('/:id', async (ctx) => {
    try {
      const result = await adapter.destroy(ctx.params.id);
      if (!result) {
        throw new Error(`Something went wrong while deleting client ID: ${ctx.params.id}`);
      }
      ctx.status = 200;
      ctx.body = result.toJSON();
    } catch (e) {
      error(e.message || e);
      ctx.status = e.statusCode || 500;
      ctx.body = { error: e.message || e };
    }
  });

  return router;
}
