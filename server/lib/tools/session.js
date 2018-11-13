import session from 'koa-generic-session';
import redis from 'koa-redis';

import client from '../db/redis';
import Configuration from '../config';

const configuration = new Configuration();

export default async function createSession() {
  const { cookies } = await configuration.getConfig();
  const store = redis({ client: client() });
  return session({
    cookie: {
      path: '/',
      httpOnly: true,
      maxAge: cookies.long.maxAge,
      overwrite: true,
      signed: true,
    },
    store,
  });
}
