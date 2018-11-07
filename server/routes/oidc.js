import debug from 'debug';
import Promise from 'bluebird';
import Router from 'koa-router';
import { URL } from 'url';

import { oidcPrefix, nuxtUrl } from '../lib/tools/url';
import { getNuxt } from '../nuxt';
import bootstrapProvider from '../provider';
import userModel from '../lib/db/models/user';

const error = debug('error:setup');
const info = debug('info');
const router = new Router();

export default async function oidcRoutes(customClient) {
  const nuxt = getNuxt();
  const [provider, User] = await Promise.all([
    bootstrapProvider(customClient),
    userModel(customClient),
  ]);

  router.get(`${oidcPrefix}/interaction/:grant`, async (ctx) => {
    try {
      const details = await provider.interactionDetails(ctx.req);
      const route = details.interaction.error === 'login_required' ? '/login' : `/interaction/${details.uuid}`;
      const redirect = new URL(`${nuxtUrl}${route}`);
      redirect.searchParams.append('client_id', details.params.client_id);
      redirect.searchParams.append('scope', details.params.scope);
      redirect.searchParams.append('grant', details.uuid);
      redirect.searchParams.append('return_to', details.returnTo);
      ctx.redirect(redirect.href);
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

  router.post(`${oidcPrefix}/interaction/:grant/login`, async (ctx, next) => {
    const {
      email,
      password,
      remember,
    } = ctx.request.body;

    let result = {};
    try {
      const found = await User.findOne({ email });
      if (!found || !await found.correctPassword(password)) {
        throw new Error(`No user found with e-mail: ${email}, or wrong password given!`);
      }
      result = {
        login: {
          /* eslint-disable-next-line no-underscore-dangle */
          account: found._id,
          acr: found.get('acr'),
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
    info(result);
    return provider.interactionFinished(ctx.req, ctx.res, result)
      .then(next);
  });

  router.post(`${oidcPrefix}/interaction/:grant`, async (ctx, next) => {
    let result;
    try {
      const {
        account,
        remember,
      } = ctx.request.body;
      const userResult = await User.findById(account, 'acr');
      if (!userResult) {
        throw new Error(`No user found with ID: ${account}`);
      }
      result = {
        login: {
          account,
          acr: userResult.get('acr'),
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
    info(result);
    return provider.interactionFinished(ctx.req, ctx.res, result)
      .then(next);
  });

  return router;
}

