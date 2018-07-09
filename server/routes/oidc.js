import debug from 'debug';
import Router from 'koa-router';
import * as url from '../lib/tools/url';
import bootstrapProvider from '../provider';

const info = debug('info');
const error = debug('error');
const router = new Router();

export default async function oidcRoutes() {
  const provider = await bootstrapProvider();

  router.get(`${url.oidcPrefix}/interaction/:grant`, async (ctx) => {
    try {
      const details = await provider.interactionDetails(ctx.req);
      info(details);

      const redirect = details.interaction.error === 'login_required'
        ? `${url.nuxtPrefix}/login?client_id=${details.params.client_id}&grant=${ctx.params.grant}`
        : `${url.nuxtPrefix}/interaction/${ctx.params.grant}?client_id=${details.params.client_id}`;
      ctx.redirect(redirect);
    } catch (e) {
      error(e.message || e);
      ctx.redirect(`${url.nuxtPrefix}/error?status=${e.status || 500}`);
    }
    ctx.status = 302;
  });

  router.post(`${url.oidcPrefix}/interaction/:grant/confirm`, async (ctx, next) => {
    const result = {};
    await provider.interactionFinished(ctx.req, ctx.res, result);
    await next();
  });

  router.post(`${url.oidcPrefix}/interaction/:grant/login`, async (ctx) => {
    // TODO: Read user's accountId and store it in session
    await provider.setProviderSession(ctx.req, ctx.res, {
      account: 'user accountId',
    });
    ctx.redirect(`${url.oidcPrefix}/interaction/${ctx.params.grant}`);
    ctx.status = 302;
  });

  return router;
}

