import { ensureDir } from 'fs-extra';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import helmet from 'koa-helmet';
import mount from 'koa-mount';

import { privateDir } from './lib/tools/directory';
import * as url from './lib/tools/url';
import bootstrapNuxt from './nuxt';
import bootstrapProvider from './provider';
import keys from './lib/tools/cookie';
import router from './routes';
import session from './lib/tools/session';

export async function bootstrap() {
  return ensureDir(privateDir);
}

export async function start() {
  const app = new Koa();
  const host = process.env.HOST || '127.0.0.1';
  const port = process.env.PORT || 3000;

  app.keys = keys();
  app.use(session());
  app.use(helmet());
  app.use(bodyParser(), async (ctx) => {
    ctx.body = ctx.request.body;
  });

  app.use(router.routes());
  app.use(mount(url.oidcPrefix, await bootstrapProvider()));
  app.use(mount(await bootstrapNuxt()));

  const server = app.listen(port, host);
  console.log(`Server listening on ${host}:${port}`); // eslint-disable-line no-console
  return server;
}

export default async function init() {
  return bootstrap().then(start.bind(this));
}
