import debug from 'debug';
import Router from 'koa-router';
import * as url from '../lib/tools/url';
import bootstrapProvider from '../provider';
import userModel from '../lib/db/models/user';

const info = debug('info');
const error = debug('error:setup');
const router = new Router();

export default async function oidcRoutes() {
  const provider = await bootstrapProvider();

  router.get(`${url.oidcPrefix}/interaction/:grant`, async (ctx) => {
    try {
      const details = await provider.interactionDetails(ctx.req);
      info(details);

      const redirect = details.interaction.error === 'login_required'
        ? `${url.nuxtPrefix}/login?client_id=${details.params.client_id}&grant=${ctx.params.grant}`
        : `${url.nuxtPrefix}/interaction?client_id=${details.params.client_id}&grant=${ctx.params.grant}`;
      ctx.redirect(redirect);
    } catch (e) {
      error(e.message || e);
      ctx.redirect(`${url.nuxtPrefix}/error?status=${e.status || 500}`);
    }
    ctx.status = 302;
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
      ts,
    } = ctx.body;
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
          remember,
          ts,
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

