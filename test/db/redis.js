import test from 'ava';
import { expect } from 'chai';
import dotenv from 'dotenv';

import { initRedis, configuration } from '../../server/lib/db/redis';

dotenv.config();
let redis;
let timestamp;

test.before(() => {
  timestamp = new Date().toISOString();
  const conf = {
    ...configuration,
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    path: process.env.REDIS_PATH,
    db: process.env.REDIS_DB,
    password: process.env.REDIS_PASSWORD,
    user: process.env.REDIS_USER,
  };
  redis = initRedis(conf);
  redis.set('TEST_KEY', timestamp);
});

test('retrieve test key to redis', async () => {
  const result = await redis.getAsync('TEST_KEY');
  expect(result).to.equal(timestamp);
});
