/* eslint-env node, mocha */
/* eslint prefer-arrow-callback: [ "off", { "allowNamedFunctions": true } ] */
/* eslint func-names: ["off", "always"] */
import { expect } from 'chai';
import { ensureDir, pathExists, readJson } from 'fs-extra';

import { privateDir } from '../../server/lib/tools/directory';
import { defaultIdLength, idFactory, safeIdFactory } from '../../server/lib/tools/id';
import Configuration from '../../server/lib/config';
import defaultConfig from '../../server/lib/config/default';
import getClients from '../../server/lib/config/clients';

describe('Configuration', function () {
  before(async function () {
    this.config = new Configuration();
  });

  describe(privateDir, async function () {
    it('should exist', async function () {
      return ensureDir(privateDir);
    });
  });

  describe(Configuration.getConfigFileUrl(), function () {
    it('should exist', async function () {
      await this.config.getConfig();
      expect(await pathExists(Configuration.getConfigFileUrl())).to.equal(true);
    });

    it('should be a parseable JSON file', async function () {
      expect(typeof await readJson(Configuration.getConfigFileUrl())).to.equal('object');
    });
  });

  describe('getConfig()', async function () {
    it('should consist of concatenated default & custom configuration', async function () {
      const config = {
        ...defaultConfig,
        ...await readJson(Configuration.getConfigFileUrl()),
      };
      expect(await this.config.getConfig()).to.deep.equal(config);
      expect(await this.config.getConfig()).to.not.equal({});
    });
  });
});

describe('Clients', function () {
  describe('default clients', function () {
    it('should return an empty array as default setting', async function () {
      const clients = await getClients();
      expect(Array.isArray(clients)).to.equal(true);
      expect(clients).to.have.lengthOf(0);
    });
  });
});

describe('ID generation', function () {
  describe('ID factory', function () {
    it(`should have length ${defaultIdLength} by default`, function () {
      const id = idFactory();
      expect(id).to.have.lengthOf(defaultIdLength);
    });

    it('should also only output ID w/ custom length', function () {
      const length = 12;
      const id = idFactory(length);
      expect(id).to.have.lengthOf(length);
    });

    it('should fall back to default length if unsupported length was given', function () {
      const length = 'unsupported';
      const id = idFactory(length);
      expect(id).to.have.lengthOf(defaultIdLength);
    });
  });

  describe('Safe ID generation', function () {
    it(`should have length ${defaultIdLength} by defauul`, function () {
      const id = safeIdFactory();
      expect(id.length).to.equal(defaultIdLength);
    });

    it('should also only output ID w/ custom length', function () {
      const length = 12;
      const id = safeIdFactory(length);
      expect(id).to.have.lengthOf(length);
    });

    it('should fall back to default length if unsupported length was given', function () {
      const length = 'unsupported';
      const id = safeIdFactory(length);
      expect(id).to.have.lengthOf(defaultIdLength);
    });
  });
});
