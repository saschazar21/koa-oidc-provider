import Router from 'koa-router';
import debug from 'debug';

import ClientAdapter from '../../lib/db/adapter/clientAdapter';
import { bootstrapPassport } from '../../lib/auth';
import { requireScopes } from '../../lib/tools/auth';

const error = debug('error:router');
const info = debug('info');
const router = new Router({
  prefix: '/clients',
});

export default async function clientRoutes(customClient) {
  const passport = await bootstrapPassport(customClient);
  const adapter = new ClientAdapter(null, customClient);
  router.get(
    '/',
    passport.authenticate(['bearer']),
    async (ctx, next) => requireScopes(ctx, next, ['client']),
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

  router.get(
    '/:id/reset',
    passport.authenticate(['bearer']),
    async (ctx, next) => requireScopes(ctx, next, ['client', 'client:edit']),
    async (ctx) => {
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
    },
  );

  router.post(
    '/',
    passport.authenticate(['bearer']),
    async (ctx, next) => requireScopes(ctx, next, ['client', 'client:create']),
    async (ctx) => {
      try {
        if (!ctx.req.body || Object.keys(ctx.req.body).length === 0) {
          throw new Error('Empty body is not supported!');
        }
        if (ctx.req.body.client_id || ctx.req.body.client_secret) {
          throw new Error('Setting client_id or client_secret is not allowed!');
        }
        const { _id } = ctx.state.user;
        const client = {
          ...ctx.req.body,
          owner: _id,
        };
        info(`Trying to register new client '${ctx.req.body.name}'...`);
        const result = await adapter.upsert(null, client);
        ctx.status = 200;
        ctx.body = result.toJSON();
        info('Registered new client:');
        info(result.toJSON());
      } catch (e) {
        error(e.message || e);
        ctx.status = e.statusCode || 500;
        ctx.body = { error: e.message || e };
      }
    },
  );

  router.put(
    '/:id',
    passport.authenticate(['bearer']),
    async (ctx, next) => requireScopes(ctx, next, ['client', 'client:edit']),
    async (ctx) => {
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
    },
  );

  router.delete(
    '/:id',
    passport.authenticate(['bearer']),
    async (ctx, next) => requireScopes(ctx, next, ['client', 'client:delete']),
    async (ctx) => {
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
    },
  );

  return router;
}
