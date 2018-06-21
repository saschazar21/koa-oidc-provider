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
});

test.serial('store timestamp into TEST_KEY', async () => {
  const result = await redis.setAsync('TEST_KEY', timestamp);
  expect(result).to.equal('OK');
});

test.serial('retrieve test key from redis', async () => {
  const result = await redis.getAsync('TEST_KEY');
  expect(result).to.equal(timestamp);
});

test('should delete TEST_KEY', async () => {
  const result = await redis.delAsync('TEST_KEY');
  expect(result).to.equal(1);
});
