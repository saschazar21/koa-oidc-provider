import session from 'koa-generic-session';

import initRedis from '../db/redis';

export default function createSession() {
  const store = initRedis();

  return session({
    store,
  });
}
