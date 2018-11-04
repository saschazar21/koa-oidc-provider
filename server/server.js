import { ensureDir } from 'fs-extra';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import helmet from 'koa-helmet';
import logger from 'koa-logger';
import mount from 'koa-mount';

import { privateDir } from './lib/tools/directory';
import * as url from './lib/tools/url';
import bootstrapNuxt from './nuxt';
import bootstrapProvider from './provider';
import bootstrapRoutes from './routes';
import { bootstrapPassport } from './lib/auth';
import keys from './lib/tools/cookie';
import middleware from './lib/tools/middleware';
import session from './lib/tools/session';

export async function bootstrap() {
  return ensureDir(privateDir).then(bootstrapProvider.bind(this));
}

export async function start(provider) {
  const app = new Koa();
  const port = process.env.NODE_PORT || 3000;

  app.proxy = true;
  app.keys = keys();
  app.use(logger());
  app.use(session());
  app.use(helmet({
    hsts: {
      maxAge: 5184000,
      includeSubdomains: true,
      preload: true,
    },
  }));
  app.use(bodyParser());

  const passport = await bootstrapPassport();
  app.use(passport.initialize());
  app.use(passport.session());

  const router = await bootstrapRoutes();
  app.use(middleware);
  app.use(router.routes());
  app.use(mount(url.oidcPrefix.length === 0 ? '/' : url.oidcPrefix, provider.app));
  app.use(mount(await bootstrapNuxt()));

  const server = app.listen(port);
  console.log(`Server listening on port ${port}`); // eslint-disable-line no-console
  return server;
}

export default async function init() {
  return bootstrap().then(start.bind(this));
}
