import debug from 'debug';
import Router from 'koa-router';

import * as url from '../lib/tools/url';
import { getNuxt } from '../nuxt';
import bootstrapProvider from '../provider';
import userModel from '../lib/db/models/user';

const info = debug('info');
const error = debug('error:setup');
const router = new Router();

export default async function oidcRoutes() {
  const nuxt = getNuxt();
  const provider = await bootstrapProvider();

  router.get(`${url.oidcPrefix}/interaction/:grant`, async (ctx) => {
    try {
      const details = await provider.interactionDetails(ctx.req);
      const client = await provider.Client.find(details.params.client_id);
      info(details);

      const context = {
        req: {
          ...ctx.req,
          meta: {
            ...details,
            params: {
              ...details.params,
              client: {
                ...client,
                client_secret: null,
              },
            },
          },
        },
      };
      const result = await nuxt.renderRoute(details.interaction.error === 'login_required' ? '/login' : '/interaction', context);
      if (result.error || result.redirect) {
        throw new Error('Something went wrong while redirecting to login');
      }
      ctx.status = 200;
      ctx.body = result.html;
    } catch (e) {
      error(e.message || e);
      ctx.req.meta = {
        error: e.name || e.status,
        error_description: e.message,
      };
      ctx.status = e.status || 500;
      const result = await nuxt.renderRoute('/error', ctx);
      ctx.body = result.html;
    }
  });

  router.post(`${url.oidcPrefix}/interaction/:grant/confirm`, async (ctx, next) => {
    // TODO: Interaction handler
    const result = {};
    await provider.interactionFinished(ctx.req, ctx.redirect, result);
    await next();
  });

  router.post(`${url.oidcPrefix}/interaction/:grant/login`, async (ctx, next) => {
    const {
      email,
      password,
      remember,
    } = ctx.request.body;
    const User = await userModel();

    let result = {};
    try {
      const found = await User.findOne({ email });
      if (!found || !await found.correctPassword(password)) {
        throw new Error(`No user found with e-mail: ${email}, or wrong password given!`);
      }
      const user = found.toJSON();
      result = {
        login: {
          account: user.sub,
          acr: user.acr,
          remember: remember && remember === 'on',
          ts: Date.now(),
        },
        consent: { },
      };
    } catch (e) {
      error(e.message || e);
      result = {
        error: 'access_denied',
        error_description: e.message,
      };
    }
    await provider.interactionFinished(ctx.req, ctx.res, result);
    await next();
  });

  return router;
}

