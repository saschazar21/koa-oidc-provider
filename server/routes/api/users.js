/* eslint-disable no-underscore-dangle */
import Promise from 'bluebird';
import Router from 'koa-router';
import debug from 'debug';

import { bootstrapPassport } from '../../lib/auth';
import { getBaseClient } from '../../lib/config/clients';
import { baseUrl } from '../../lib/tools/url';
import { requireScopes } from '../../lib/tools/auth';
import userModel from '../../lib/db/models/user';
import Configuration from '../../lib/config';

const error = debug('error:router');
const info = debug('info');
const configuration = new Configuration();
const router = new Router({
  prefix: '/users',
});

export default async function userRoutes(customClient) {
  try {
    const [passport, baseClient, { routes }, User] = await Promise.all([
      await bootstrapPassport(customClient),
      await getBaseClient(customClient),
      await configuration.getConfig(),
      await userModel(customClient),
    ]);

    router.get(
      '/',
      (ctx) => {
        ctx.status = 301;
        ctx.redirect(routes.userinfo);
      },
    );

    router.post(
      '/',
      passport.authenticate(['bearer', 'basic']),
      async (ctx, next) => requireScopes(ctx, next, ['user', 'user:create']),
      async (ctx, next) => {
        try {
          const { user } = ctx.state;
          if (user.token
              || (user.clientId === baseClient.client_id && ctx.request.origin === baseUrl)) {
            return next();
          }
          ctx.status = 403;
          throw new Error('Invalid request, check your authentication settings!');
        } catch (err) {
          error(err.message || err);
          ctx.status = ctx.status && ctx.status > 200 ? ctx.status : 500;
          ctx.body = {
            error: err.message,
          };
          return err;
        }
      },
      async (ctx) => {
        info(ctx.state.user);
        info(ctx.request.origin);

        try {
          const user = new User(ctx.request.body);
          const result = await user.save();
          info(user);
          ctx.status = 200;
          ctx.body = {
            email: result.get('email'),
            family_name: result.get('family_name'),
            given_name: result.get('given_name'),
            picture: result.get('picture'),
          };
        } catch (err) {
          error(err.message || err);
          ctx.status = 400;
          ctx.body = {
            error: err.message || err,
          };
        }
      },
    );

    router.put(
      '/:id',
      passport.authenticate(['bearer']),
      async (ctx, next) => requireScopes(ctx, next, ['user', 'user:edit']),
      async (ctx) => {
        const { id } = ctx.params;
        const { body } = ctx.request;
        try {
          if (id !== ctx.state.user._id) {
            throw new Error(`Not able to update user with ID: ${id}.`);
          }
          if (!body) {
            throw new Error('No data found in request to update user.');
          }
          const { _id, email } = body;
          if (_id || email) {
            throw new Error('_id or email must not be altered.');
          }
          const result = await User.findByIdAndUpdate(
            id,
            {
              $set: body,
              $inc: { __v: 1 },
            },
            {
              new: true,
              runValidators: true,
              select: '-__v -password',
              setDefaultsOnInsert: true,
            },
          );
          ctx.status = 200;
          ctx.body = result.toJSON();
        } catch (err) {
          error(err.message || err);
          ctx.status = 400;
          ctx.body = {
            error: err.message || err,
          };
        }
      },
    );

    // TODO: Add DELETE route, make sure to also remove depending clients & tokens

    return router;
  } catch (e) {
    error(e.message || e);
    return Promise.reject(e);
  }
}
