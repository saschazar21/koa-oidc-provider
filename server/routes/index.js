import * as Router from 'koa-router';

import tokenRouter from './token';
import wellKnownRouter from './well-known';

const router = new Router();

router.use('/auth', tokenRouter.routes());
router.use(wellKnownRouter.routes());

export { router as default };
