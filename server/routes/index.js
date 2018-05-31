import * as Router from 'koa-router';

import tokenRouter from './token';

const router = new Router({
  prefix: '/auth',
});

router.use(tokenRouter.routes());

export { router as default };
