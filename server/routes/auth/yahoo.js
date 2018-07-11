import Router from 'koa-router';
import debug from 'debug';

import { isYahooEnabled } from '../../lib/tools/auth';
import { bootstrapPassport } from '../../lib/auth';
import { nuxtPrefix } from '../../lib/tools/url';

const error = debug('error:router');
const router = new Router({
  prefix: '/yahoo',
});

export default async function yahooRoutes() {
  if (!isYahooEnabled) {
    error(`YAHOO_CLIENT_ID: ${process.env.YAHOO_CLIENT_ID} and/or YAHOO_CLIENT_SECRET: ${process.env.YAHOO_CLIENT_SECRET} invalid. No yahoo routes created.`);
    return router;
  }

  const passport = await bootstrapPassport();

  router.get('/', passport.authenticate('yahoo'));
  router.get('/finish', passport.authenticate('yahoo', {
    failureRedirect: '/login',
    successRedirect: nuxtPrefix,
  }));

  return router;
}
