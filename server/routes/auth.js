import Router from 'koa-router';
import debug from 'debug';

import googleRoutes from './auth/google';
import microsoftRoutes from './auth/microsoft';
import yahooRoutes from './auth/yahoo';
import { bootstrapPassport } from '../lib/auth';
import { getBaseClient } from '../lib/config/clients';
import { nuxtPrefix } from '../lib/tools/url';

const error = debug('error:router');
const router = new Router({
  prefix: '/login',
});

export default async function authRoutes(customClient) {
  const routes = await Promise.all([googleRoutes(), microsoftRoutes(), yahooRoutes()]);
  routes.forEach(config => router.use(config.routes()));

  try {
    const client = await getBaseClient(customClient);
    const redirectUri = Array.isArray(client.redirect_uris)
      ? client.redirect_uris[0]
      : client.redirect_uris;

    const passport = await bootstrapPassport(customClient);
    router.get('/', passport.authenticate('oidc'));
    router.post(`/${redirectUri.split('/').pop()}`, passport.authenticate('oidc', {
      failureRedirect: '/login',
      successRedirect: nuxtPrefix,
    }));
    return router;
  } catch (e) {
    error(e.message || e);
    return Promise.reject(e);
  }
}
