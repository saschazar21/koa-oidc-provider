/* eslint-disable no-underscore-dangle */
import Provider from 'oidc-provider';
import dotenv from 'dotenv';
import test from 'ava';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import Adapter from '../../server/lib/db/adapter';
import Configuration from '../../server/lib/config';
import { configuration, initMongo } from '../../server/lib/db/mongo';

dotenv.config();
chai.use(chaiAsPromised);
const { AdapterTest } = Provider;
let adapter;
let provider;

const mongoConfig = {
  ...configuration,
  pass: process.env.MONGO_PASSWORD,
  user: process.env.MONGO_USER,
};

test.before(async () => {
  const providerConfig = new Configuration();
  provider = new Provider('http://127.0.0.1', await providerConfig.getConfig());
  adapter = new AdapterTest(provider);
});

test('should resolve internal adapter test', async () => {
  const mongoClient = await initMongo(process.env.MONGO_HOST, process.env.MONGO_PORT, mongoConfig);

  class TestAdapter extends Adapter {
    constructor(name) {
      super(name, mongoClient);
    }
  }
  return provider.initialize({ adapter: TestAdapter })
    .then(() => adapter.execute());
});
