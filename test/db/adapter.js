/* eslint-disable no-underscore-dangle */
import Provider from 'oidc-provider';
import dotenv from 'dotenv';
import test from 'ava';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { configuration, initMongo } from '../../server/lib/db/mongo';
import Adapter from '../../server/lib/db/adapter';
import Configuration from '../../server/lib/config';
import { safeIdFactory } from '../../server/lib/tools/id';

dotenv.config();
chai.use(chaiAsPromised);

const data = {
  accountId: safeIdFactory(),
  authTime: Math.floor(Date.now() * 0.001),
  claims: {
    id_token: {
      email: null,
      family_name: { essential: true },
      gender: { essential: false },
      given_name: { value: 'John' },
      locale: { values: ['en-US', 'en-GB'] },
      middle_name: {},
    },
  },
  clientId: safeIdFactory(),
  grantId: safeIdFactory(),
  nonce: String(Math.random()),
  redirectUri: 'http://client.example.com/cb',
  scope: 'openid profile',
};

let ac;
let at;
let mongoose;
let provider;

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

  class CustomAdapter extends Adapter {
    constructor(name) {
      super(name, mongoose);
    }
  }

  const providerConfig = new Configuration();
  provider = new Provider('http://127.0.0.1', await providerConfig.getConfig());
  await provider.initialize({ adapter: CustomAdapter });
});

test.serial('should create an Authorization Code', async () => {
  ac = await new provider.AuthorizationCode(data).save();
  chai.expect(typeof ac).to.equal('string');
  chai.expect(ac.length).to.be.greaterThan(0);
});

test.serial('should find the newly created Authorization Code', async () => {
  ac = await provider.AuthorizationCode.find(ac);
  chai.expect(ac).to.have.property('sub', data.accountId);
  chai.expect(ac).to.not.have.property('consumed');
});

test.serial('should consume the newly created Authorization Code', async () => {
  const result = await ac.consume();
  chai.expect(result).to.have.property('consumed');
  chai.expect(result.__v).to.be.greaterThan(0);
});

test.serial('should create an Access Token based on Authorization Code', async () => {
  at = await new provider.AccessToken({
    accountId: data.accountId,
    claims: data.claims,
    clientId: data.clientId,
    grantId: data.grantId,
    scope: data.scope,
  }).save();
  chai.expect(typeof at).to.equal('string');
  chai.expect(at.length).to.be.greaterThan(0);
});

test.serial('should find the newly created Access Token', async () => {
  at = await provider.AccessToken.find(at);
  chai.expect(at).to.have.property('sub', ac.accountId);
  chai.expect(at.iat).to.be.below(Date.now() * 0.001);
  chai.expect(at.exp).to.be.greaterThan(Math.floor(Date.now() * 0.001));
});

test.serial('should destroy the Authorization Code', async () => {
  chai.expect(await ac.destroy()).to.have.property('accountId', data.accountId);
});

test.serial('should destroy the Access Token', async () => {
  chai.expect(await at.destroy()).to.have.property('accountId', data.accountId);
});
