import Router from 'koa-router';
import googleRoutes from './google';

const router = new Router();

export default async function authRoutes() {
  const google = await googleRoutes();
  router.use('/', google.routes());

  return router;
}
