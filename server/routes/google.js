import Router from 'koa-router';
import debug from 'debug';

import { isGoogleEnabled } from '../lib/tools/auth';
import { bootstrapPassport } from '../lib/auth';

const error = debug('error:router');
const router = new Router();

export default async function googleRoutes() {
  if (!isGoogleEnabled) {
    error(`GOOGLE_CLIENT_ID: ${process.env.GOOGLE_CLIENT_ID} and/or GOOGLE_CLIENT_SECRET: ${process.env.GOOGLE_CLIENT_SECRET} invalid. No google routes created.`);
    return router;
  }

  const passport = await bootstrapPassport();

  router.get('/google', passport.authenticate('google'));

  return router;
}
