import Promise from 'bluebird';
import Router from 'koa-router';
import debug from 'debug';

import apiRoutes from './api';
import authRoutes from './auth';
import oidcRoutes from './oidc';
import bootstrapProvider from '../provider';
import { nuxtPrefix } from '../lib/tools/url';

const router = new Router();
const error = debug('error:auth');
const info = debug('info');

export default async function bootstrapRoutes(customClient) {
  const result = await Promise.all([
    apiRoutes(customClient),
    authRoutes(customClient),
    oidcRoutes(customClient),
    bootstrapProvider(customClient),
  ]);
  const provider = result.pop();

  result.forEach(route => router.use(route.routes()));

  router.get('/logout', async (ctx) => {
    if (ctx.state && ctx.state.user) {
      const { user } = ctx.state;
      try {
        const token = await provider.AccessToken.find(user.token.access_token);
        await token.destroy();
        ctx.logout();
        /* eslint-disable-next-line no-underscore-dangle */
        info(`Token ${token._id} destroyed, ${user.name} logged out.`);
      } catch (e) {
        error(e.message || e);
      }
    }
    return ctx.redirect('/');
  });

  router.all('/', (ctx) => {
    ctx.redirect(nuxtPrefix);
    ctx.status = 301;
  });

  return router;
}
