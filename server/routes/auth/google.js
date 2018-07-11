import Router from 'koa-router';
import debug from 'debug';

import { isGoogleEnabled } from '../../lib/tools/auth';
import { bootstrapPassport } from '../../lib/auth';
import { nuxtPrefix } from '../../lib/tools/url';

const error = debug('error:router');
const router = new Router({
  prefix: '/google',
});

export default async function googleRoutes() {
  if (!isGoogleEnabled) {
    error(`GOOGLE_CLIENT_ID: ${process.env.GOOGLE_CLIENT_ID} and/or GOOGLE_CLIENT_SECRET: ${process.env.GOOGLE_CLIENT_SECRET} invalid. No google routes created.`);
    return router;
  }

  const passport = await bootstrapPassport();

  router.get('/', passport.authenticate('google'));
  router.get('/finish', passport.authenticate('google', {
    failureRedirect: '/login',
    successRedirect: nuxtPrefix,
  }));

  return router;
}
