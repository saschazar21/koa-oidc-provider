import dotenv from 'dotenv';
import test from 'ava';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { configuration, initMongo } from '../../server/lib/db/mongo';
import clientModel from '../../server/lib/db/models/client';
import { safeIdFactory } from '../../server/lib/tools/id';
import { getBaseClient } from '../../server/lib/config/clients';

chai.use(chaiAsPromised);

dotenv.config();
let Client;
let client;
let mongoose;

test.before(async () => {
  const config = {
    ...configuration,
    pass: process.env.MONGO_PASSWORD,
    user: process.env.MONGO_USER,
  };

  mongoose = await initMongo(
    process.env.MONGO_HOST,
    process.env.MONGO_PORT,
    process.env.MONGO_DB,
    config,
  );
  Client = await clientModel(mongoose);
});

test.serial('should create a client model', async () => {
  client = new Client({
    owner: safeIdFactory(),
    redirect_uris: 'https://localme.com',
    client_name: 'Pizzabot',
  });
  chai.expect(client.toJSON()).to.haveOwnProperty('_id');
  chai.expect(await client.save()).to.have.property('_id');
});

test.serial('should delete the client model', async () => {
  const deleted = await Client.deleteOne({ client_name: 'Pizzabot' });
  chai.expect(deleted.n).to.be.greaterThan(0);
});

test('should fail with duplicate client_name', async () => {
  const newClient = {
    ...client,
  };
  chai.expect(new Client(newClient).save()).to.be.rejectedWith(Error);
});

test('should fail with redirect_uris set to localhost', async () => {
  const newClient = {
    ...client,
    client_name: 'Kebabbot',
    redirect_uris: 'https://localhost',
  };
  chai.expect(new Client(newClient).save()).to.be.rejectedWith(Error);
});

test('should create base client', async () => {
  const baseClient = await getBaseClient();
  chai.expect(baseClient).to.have.property('response_types');
  chai.expect(baseClient.response_types).to.have.lengthOf(1);
  chai.expect(baseClient).to.have.property('_id');
  chai.expect(baseClient).to.have.property('application_type', 'web');
});
