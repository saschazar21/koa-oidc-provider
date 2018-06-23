import dotenv from 'dotenv';
import test from 'ava';
import { expect } from 'chai';

import { configuration, initMongo } from '../../server/lib/db/mongo';


dotenv.config();
let connection;

test.serial(async () => {
  const config = {
    ...configuration,
    pass: process.env.MONGO_PASSWORD,
    user: process.env.MONGO_USER,
  };
  connection = await initMongo(process.env.MONGO_HOST, process.env.MONGO_PORT, config);
  expect(typeof connection).to.equal('object');
});
