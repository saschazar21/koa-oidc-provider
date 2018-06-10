import { ensureDir } from 'fs-extra';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import helmet from 'koa-helmet';
import mount from 'koa-mount';

import { privateDir } from './lib/tools/directory';
import * as url from './lib/tools/url';
import bootstrapNuxt from './nuxt';
import bootstrapProvider from './provider';
import router from './routes';

async function bootstrap() {
  return ensureDir(privateDir);
}

async function start() {
  const app = new Koa();
  const host = process.env.HOST || '127.0.0.1';
  const port = process.env.PORT || 3000;

  app.use(helmet());
  app.use(bodyParser(), async (ctx) => {
    ctx.body = ctx.request.body;
  });

  app.use(mount(url.oidcPrefix, await bootstrapProvider()));
  app.use(mount(await bootstrapNuxt()));
  app.use(router.routes());

  app.listen(port, host);
  console.log(`Server listening on ${host}:${port}`); // eslint-disable-line no-console
}

bootstrap()
  .then(start.bind(this));
