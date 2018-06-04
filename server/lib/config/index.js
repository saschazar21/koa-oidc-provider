import * as debug from 'debug';
import { pathExists, readJson, writeJson } from 'fs-extra';
import { resolve } from 'path';

import { privateDir } from '../tools/directory';

const error = debug('error');
const info = debug('info');

export default class Configuration {
  constructor() {
    this.configFileUrl = Configuration.getConfigFileUrl();
  }

  static getConfigFileUrl() {
    return resolve(privateDir, './configuration.json');
  }

  async getConfig() {
    if (!this.config) {
      this.config = await this.loadConfig();
      return this.config;
    }
    return this.config;
  }

  async loadConfig() {
    try {
      if (!await pathExists(this.configFileUrl)) {
        const config = this.config || {};
        await writeJson(this.configFileUrl, config, {
          spaces: 2,
        });
        return config;
      }
      info(`${this.configFileUrl} exists. Attempting to use that file.`);
      return readJson(this.configFileUrl);
    } catch (e) {
      error(e);
      return null;
    }
  }

  async storeConfig(contents) {
    try {
      await writeJson(this.configFileUrl, contents, {
        spaces: 2,
      });
      info(`Configuration file saved to ${this.configFileUrl}`);
      return true;
    } catch (e) {
      error(`Configuration file could not be stored:\n${e.message || e}`);
      return null;
    }
  }
}
