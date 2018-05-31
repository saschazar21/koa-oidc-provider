import * as Router from 'koa-router';

const router = new Router({
  prefix: '/token',
});

router.get('/', (ctx) => {
  ctx.body = 'Hello, world';
});

export { router as default };
