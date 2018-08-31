import Koa from 'koa';
import { Nuxt, Builder } from 'nuxt';

import config from '../../nuxt.config';
import { nuxtPrefix } from '../lib/tools/url';
import middleware from '../lib/tools/middleware';

const app = new Koa();
// Import and Set Nuxt.js options
config.dev = !(app.env === 'production');

// Instantiate nuxt.js
const nuxt = new Nuxt(config);

async function parsedMiddleware(ctx, next) {
  ctx.req.baseClient = ctx.state.baseClient;
  ctx.req.client = ctx.state.client;
  ctx.req.setup = ctx.state.setup;
  return next();
}

export function getNuxt() {
  return nuxt;
}

export default async function bootstrapNuxt() {
  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt);
    await builder.build();
  }

  app.use(middleware);
  app.use(parsedMiddleware);
  app.use(async (ctx, next) => {
    await next();
    if (ctx.path.startsWith(nuxtPrefix) || ctx.path.startsWith('/favicon')) {
      ctx.status = 200; // koa defaults to 404 when it sees that status is unset
    }
    return new Promise((resolve, reject) => {
      ctx.res.on('close', resolve);
      ctx.res.on('finish', resolve);
      nuxt.render(ctx.req, ctx.res, (promise) => {
        // nuxt.render passes a rejected promise into callback on error.
        if (!promise) {
          return resolve();
        }
        return promise.then(resolve).catch(reject);
      });
    });
  });

  return app;
}
