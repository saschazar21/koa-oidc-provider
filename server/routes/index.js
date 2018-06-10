import Router from 'koa-router';
import * as url from '../lib/tools/url';

const router = new Router();

router.redirect('/', url.nuxtPrefix);

export { router as default };
