/* eslint-disable no-underscore-dangle */
import dotenv from 'dotenv';
import test from 'ava';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import ClientAdapter from '../../server/lib/db/adapter/clientAdapter';
import { configuration, initMongo } from '../../server/lib/db/mongo';
import { safeIdFactory } from '../../server/lib/tools/id';

chai.use(chaiAsPromised);

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
  clientAdapter = new ClientAdapter('client', mongoose);
});

test.serial('should create a client model via adapter', async () => {
  const model = {
    owner: safeIdFactory(),
    redirect_uris: 'https://localspaghetti.com',
    client_name: 'Spaghettibot',
  };
  client = await clientAdapter.upsert(null, model);
  chai.expect(client).to.have.property('owner', client.owner);
});

test.serial('should return the created model via adapter', async () => {
  const result = await clientAdapter.find(client._id);
  chai.expect(result.toJSON()).to.have.property('client_id');
  chai.expect(result.toJSON()).to.have.property('client_name', client.toJSON().client_name);
});

test.serial('should return all clients registered by user ID', async () => {
  const result = await clientAdapter.get(client.owner);
  chai.expect(Array.isArray(result)).to.equal(true);
  chai.expect(result.length).to.equal(1);
  chai.expect(result[0].get('client_secret')).to.equal(undefined);
  chai.expect(result[0].toJSON()).to.have.property('_id', client.client_id);
});

test.serial('should exclude fields based on string', async () => {
  const result = await clientAdapter.find(client._id, '-client_secret');
  chai.expect(result.toJSON()).to.not.have.property('client_secret');
  chai.expect(result.toJSON()).to.not.deep.equal(client.toJSON());
});

test.serial('should reset client secret', async () => {
  const result = await clientAdapter.reset(client.client_id);
  chai.expect(typeof result.get('client_secret')).to.equal('string');
  chai.expect(result.get('client_secret')).to.not.equal(client.get('client_secret'));
  client = result;
});

test.serial('should delete a client model via adapter', async () => {
  const result = await clientAdapter.destroy(client._id);
  chai.expect(result.toJSON()).to.deep.equal(client.toJSON());
});

test('should return null, when creating invalid model', async () => {
  const model = {
    owner: safeIdFactory(),
    redirect_uris: 'https://localhost:3000',
    client_name: 'Unlikely',
  };
  return chai.expect(clientAdapter.upsert(null, model)).to.be.rejectedWith('localhost');
});

test('should reject Promise with Error, when no client was found', async () => {
  chai.expect(clientAdapter.find('123')).to.be.rejectedWith(Error);
});

test('should reject Promise with Error, when no client was deleted', async () => {
  chai.expect(clientAdapter.destroy('123')).to.be.rejectedWith(Error);
});
