import debug from 'debug';
import Router from 'koa-router';
import * as url from '../lib/tools/url';

const info = debug('info');
const router = new Router();

export default async function bootstrapRoutes(provider) {
  router.get(`${url.oidcPrefix}/interaction/:id`, async (ctx) => {
    const details = await provider.interactionDetails(ctx.req);
    info(details);
    // TODO: Handle details

    ctx.redirect(`${url.nuxtPrefix}/interaction/${ctx.params.id}`);
    ctx.status = 301;
  });

  router.all('/', (ctx) => {
    ctx.redirect(url.nuxtPrefix);
    ctx.status = 301;
  });

  return router;
}

