/* eslint-disable no-underscore-dangle */
import dotenv from 'dotenv';
import test from 'ava';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { configuration, initMongo } from '../../server/lib/db/mongo';
import Adapter from '../../server/lib/db/adapter';
import { safeIdFactory } from '../../server/lib/tools/id';

dotenv.config();
chai.use(chaiAsPromised);

let adapter;
let client;

test.before(async () => {
  const config = {
    ...configuration,
    pass: process.env.MONGO_PASSWORD,
    user: process.env.MONGO_USER,
  };
  adapter = new Adapter('Client', await initMongo(process.env.MONGO_HOST, process.env.MONGO_PORT, config));
});

test.serial('should create a client model and store it in the DB', async () => {
  const model = {
    owner: safeIdFactory(),
    redirect_uris: 'https://localpizza.com',
    client_name: 'Adapterbot',
  };
  client = await adapter.upsert(null, model);
  chai.expect(client).to.have.property('client_name', model.client_name);
  chai.expect(client).to.have.property('_id');
});

test.serial('should find the newly created model in DB', async () => {
  chai.expect(adapter.find(client._id)).to.eventually.deep.equal(client);
});

test.serial('should delete model from DB', async () => {
  chai.expect(adapter.destroy(client._id)).to.eventually.deep.equal(client);
});
