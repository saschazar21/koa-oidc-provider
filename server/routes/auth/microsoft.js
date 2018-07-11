import Router from 'koa-router';
import debug from 'debug';

import { isMicrosoftEnabled } from '../../lib/tools/auth';
import { bootstrapPassport } from '../../lib/auth';
import { nuxtPrefix } from '../../lib/tools/url';

const error = debug('error:router');
const router = new Router({
  prefix: '/microsoft',
});

export default async function microsoftRoutes() {
  if (!isMicrosoftEnabled) {
    error(`MICROSOFT_CLIENT_ID: ${process.env.MICROSOFT_CLIENT_ID} and/or MICROSOFT_CLIENT_SECRET: ${process.env.MICROSOFT_CLIENT_SECRET} invalid. No microsoft routes created.`);
    return router;
  }

  const passport = await bootstrapPassport();

  router.get('/', passport.authenticate('microsoft'));
  router.get('/finish', passport.authenticate('microsoft', {
    failureRedirect: '/login',
    successRedirect: nuxtPrefix,
  }));

  return router;
}
