/* eslint-env node, mocha */
/* eslint prefer-arrow-callback: [ "off", { "allowNamedFunctions": true } ] */
/* eslint func-names: ["off", "always"] */
import { expect } from 'chai';

import { validators, values } from '../server/lib/tools';
import Configuration from '../server/lib/config';

describe('Validators', function () {
  before(async function () {
    const configuration = new Configuration();
    this.config = {
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

    this.signatureAlg = 'signatureAlg';
    this.encryptionAlg = 'encryptionAlg';
    this.encryptionEnc = 'encryptionEnc';
  });

  describe('ID Token Encryption', function () {
    it('should return all available encryption alg values', async function () {
      const supported = await validators.filter(this.encryptionAlg, 'idTokenEncryptionAlgValues', this.config);
      expect(supported.length).to.be.greaterThan(0);
      expect(values[this.encryptionAlg].length).to.be.greaterThan(0);
      expect(supported).to.have.lengthOf(values[this.encryptionAlg].length);
      expect(await validators.idTokenEncryptedResponseAlg('RS256')).to.equal(false);
      expect(await validators.idTokenEncryptedResponseAlg('A192KW')).to.equal(true);
    });
  });

  describe('ID Token Signing', function () {
    it('should exclude unsupported signing values', async function () {
      const d = values.signatureAlg.length - this.config.unsupported.idTokenSigningAlgValues.length;
      const supported = await validators.filter(this.signatureAlg, 'idTokenSigningAlgValues', this.config);
      expect(supported).to.not.include(this.config.unsupported.idTokenSigningAlgValues[0]);
      expect(supported).to.include('RS256');
      expect(supported).to.have.length(d);
    });
  });
});
