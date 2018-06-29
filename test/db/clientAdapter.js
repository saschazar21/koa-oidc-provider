/* eslint-disable no-underscore-dangle */
import dotenv from 'dotenv';
import test from 'ava';
import { expect } from 'chai';

import ClientAdapter from '../../server/lib/db/adapter/clientAdapter';
import { configuration, initMongo } from '../../server/lib/db/mongo';
import { safeIdFactory } from '../../server/lib/tools/id';

dotenv.config();
let clientAdapter;
let client;

test.before(async () => {
  const config = {
    ...configuration,
    pass: process.env.MONGO_PASSWORD,
    user: process.env.MONGO_USER,
  };
  const mongoose = await initMongo(process.env.MONGO_HOST, process.env.MONGO_PORT, config);
  clientAdapter = new ClientAdapter(mongoose);
});

test.serial('should create a client model via adapter', async () => {
  const model = {
    owner: safeIdFactory(),
    redirect_uris: 'https://localme.com',
    client_name: 'Pizzabot',
  };
  client = await clientAdapter.upsert(null, model);
  expect(client).to.have.property('owner', client.owner);
});

test.serial('should return the created model via adapter', async () => {
  const result = await clientAdapter.find(client._id);
  expect(result.toJSON()).to.deep.equal(client.toJSON());
});

test.serial('should delete a client model via adapter', async () => {
  const result = await clientAdapter.destroy(client._id);
  expect(result.toJSON()).to.deep.equal(client.toJSON());
});
