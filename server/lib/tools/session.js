import session from 'koa-generic-session';
import redis from 'koa-redis';

import client from '../db/redis';

export default function createSession() {
  const store = redis({ client: client() });
  return session({
    store,
  });
}
