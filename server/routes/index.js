import Router from 'koa-router';
import { url } from '../lib';

const router = new Router();

router.redirect('/', url.nuxtPrefix);

export { router as default };
