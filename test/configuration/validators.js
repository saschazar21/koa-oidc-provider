import test from 'ava';
import { expect } from 'chai';

import { filter, idTokenEncryptedResponseAlg } from '../../server/lib/tools/validators';
import * as values from '../../server/lib/tools/values';
import Configuration from '../../server/lib/config';

let config;
const signatureAlg = 'signatureAlg';
const encryptionAlg = 'encryptionAlg';

test.before(async () => {
  const configuration = new Configuration();
  config = {
    ...await configuration.getConfig(),
    unsupported: {
      idTokenEncryptionAlgValues: [],
      idTokenEncryptionEncValues: [],
      idTokenSigningAlgValues: ['RS512', 'ES256'],
      requestObjectEncryptionAlgValues: [],
      requestObjectEncryptionEncValues: [],
      requestObjectSigningAlgValues: ['RS512', 'ES256'],
      tokenEndpointAuthSigningAlgValues: ['RS512', 'ES256'],
      introspectionEndpointAuthSigningAlgValues: ['RS512', 'ES256'],
      revocationEndpointAuthSigningAlgValues: ['RS512', 'ES256'],
      userinfoEncryptionAlgValues: [],
      userinfoEncryptionEncValues: [],
      userinfoSigningAlgValues: [],
    },
  };
});

test('ID Token Encryption', async () => {
  const supported = await filter(encryptionAlg, 'idTokenEncryptionAlgValues', config);
  expect(supported.length).to.be.greaterThan(0);
  expect(values[encryptionAlg].length).to.be.greaterThan(0);
  expect(supported).to.have.lengthOf(values[encryptionAlg].length);
  expect(await idTokenEncryptedResponseAlg('RS256')).to.equal(false);
  expect(await idTokenEncryptedResponseAlg('A192KW')).to.equal(true);
});

test('ID Token Signing', async () => {
  const d = values.signatureAlg.length - config.unsupported.idTokenSigningAlgValues.length;
  const supported = await filter(signatureAlg, 'idTokenSigningAlgValues', config);
  expect(supported).to.not.include(config.unsupported.idTokenSigningAlgValues[0]);
  expect(supported).to.include('RS256');
  expect(supported).to.have.length(d);
});
