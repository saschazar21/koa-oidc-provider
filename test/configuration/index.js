/* eslint-env node, mocha */
/* eslint prefer-arrow-callback: [ "off", { "allowNamedFunctions": true } ] */
/* eslint func-names: ["off", "always"] */
import { assert, expect } from 'chai';
import { ensureDir, pathExists, readJson } from 'fs-extra';

import { directory } from '../../server/lib';
import Configuration from '../../server/lib/config';
import defaultConfig from '../../server/lib/config/default';

describe('Configuration', function () {
  before(async function () {
    this.config = new Configuration();
  });

  describe(directory.privateDir, async function () {
    it('should exist', async function () {
      assert(await ensureDir(directory.privateDir), true);
    });
  });

  describe(Configuration.getConfigFileUrl(), function () {
    it('should exist', async function () {
      await this.config.getConfig();
      assert(await pathExists(Configuration.getConfigFileUrl()), true, 'should be able to read the configuration file');
    });

    it('should be a parseable JSON file', async function () {
      assert(typeof await readJson(Configuration.getConfigFileUrl()), Object, 'should be of type Object');
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
