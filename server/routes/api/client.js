import Router from 'koa-router';

const router = new Router({
  prefix: '/client',
});

export default function clientRoutes() {
  router.get('/', async (ctx) => {
    // TODO: Create client routes
    ctx.status = 200;
    ctx.body = {};
  });

  // Don't use POST /, as this is default for dynamic client registration!

  return router;
}
