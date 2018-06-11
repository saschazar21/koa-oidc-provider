import Router from 'koa-router';
import * as url from '../lib/tools/url';

const router = new Router();

router.all('/', (ctx) => {
  ctx.redirect(url.nuxtPrefix);
  ctx.status = 301;
});

export { router as default };
