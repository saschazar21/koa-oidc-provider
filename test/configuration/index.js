/* eslint-env node, mocha */
/* eslint prefer-arrow-callback: [ "off", { "allowNamedFunctions": true } ] */
/* eslint func-names: ["off", "always"] */
import { expect } from 'chai';
import { ensureDir, pathExists, readJson } from 'fs-extra';

import { Configuration, directory, getClients } from '../../server/lib';
import defaultConfig from '../../server/lib/config/default';

describe('Configuration', function () {
  before(async function () {
    this.config = new Configuration();
  });

  describe(directory.privateDir, async function () {
    it('should exist', async function () {
      return ensureDir(directory.privateDir);
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
