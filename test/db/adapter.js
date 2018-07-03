/* eslint-disable no-underscore-dangle */
import Provider from 'oidc-provider';
import dotenv from 'dotenv';
import test from 'ava';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

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
let provider;

test.before(async () => {
  const providerConfig = new Configuration();
  provider = new Provider('http://127.0.0.1', await providerConfig.getConfig());
  await provider.initialize({ adapter: Adapter });
});

test.serial('should create an Authorization Code', async () => {
  ac = new provider.AuthorizationCode(data);
  ac = await ac.save();
  chai.expect(typeof ac).to.equal('string');
});

test.serial('should find the newly created Authorization Code', async () => {
  ac = await provider.AuthorizationCode.find(ac);
  chai.expect(ac).to.have.property('sub', data.accountId);
  chai.expect(ac).to.not.have.property('consumed');
});

test.serial('should consume the newly created Authorization Code', async () => {
  chai.expect(await ac.consume()).to.have.property('consumed');
});

test.serial('should destroy the Authorization Code', async () => {
  chai.expect(await ac.destroy()).to.have.property('accountId', data.accountId);
});
