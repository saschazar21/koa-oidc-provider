import Promise from 'bluebird';
import debug from 'debug';
import { Issuer } from 'openid-client';

const error = debug('error:auth');
const info = debug('info');

export default class AbstractProvider {
  constructor(providerConfig) {
    this.providerConfig = providerConfig;
  }

  async client(name) {
    const providerConfig = this.providerConfig[name];
    if (!providerConfig) {
      throw new Error(`No provider config found for '${name}'\nAvailable configs are: ${Object.keys(this.providerConfig).join(', ')}`);
    }

    try {
      Issuer.defaultHttpOptions = {
        retries: 1,
        timeout: 12500,
      };
      const issuer = providerConfig.config
        ? new Issuer(providerConfig.config)
        : await Issuer.discover(providerConfig.discoveryUrl);

      info('Found issuer:');
      info(issuer.metadata);
      const client = new issuer.Client({
        ...providerConfig.client,
      });
      return client;
    } catch (e) {
      error(e.message || e);
      return Promise.reject(e);
    }
  }
}
