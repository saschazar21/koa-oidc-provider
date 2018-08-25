import Koa from 'koa';
import { Nuxt, Builder } from 'nuxt';
import debug from 'debug';

import config from '../../nuxt.config';
import { nuxtPrefix } from '../lib/tools/url';
import { getBaseClient } from '../lib/config/clients';
import registrationEnabled from '../lib/tools/registration';

const error = debug('error:setup');

const app = new Koa();
// Import and Set Nuxt.js options
config.dev = !(app.env === 'production');

// Instantiate nuxt.js
const nuxt = new Nuxt(config);

export function getNuxt() {
  return nuxt;
}

export async function middleware(ctx, next) {
  let registration = await registrationEnabled();
  try {
    const client = await getBaseClient();
    ctx.req.client = client;
  } catch (e) {
    error(e.message || e);
    error('Unable to store client in request object. User registration disabled.');
    registration = false;
  }
  ctx.req.setup = {
    registration,
  };
  return next();
}

export default async function bootstrapNuxt() {
  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt);
    await builder.build();
  }

  app.use(middleware);
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
