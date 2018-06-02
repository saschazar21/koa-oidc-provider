import * as Router from 'koa-router';

const router = new Router({
  prefix: '/.well-known',
});

/**
 * Append response type "application/json" for openid-configuration file
 */
router.get('/openid-configuration', async (ctx, next) => {
  ctx.type = 'application/json';
  await next();
});

export { router as default };
