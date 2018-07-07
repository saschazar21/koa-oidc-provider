import Promise from 'bluebird';
import Provider from 'oidc-provider';

import Adapter from '../lib/db/adapter';
import Configuration from '../lib/config';
import { getBaseClient, getClients } from '../lib/config/clients';
import loadKeystore from '../lib/keys';
import * as url from '../lib/tools/url';

let provider;

export default async function bootstrapProvider() {
  if (provider) {
    return provider;
  }

  const configuration = new Configuration();
  const config = await configuration.getConfig();
  const keystore = await loadKeystore();
  const oidc = new Provider(url.oidcUrl, config);

  let clients;

  try {
    const baseClient = await getBaseClient();
    clients = [
      baseClient,
      ...await getClients(),
    ];
  } catch (e) {
    return Promise.reject(e);
  }

  /**
   * Config object for initialize contains the following properties:
   * adapter, clients = [], keystore
   */
  await oidc.initialize({
    adapter: Adapter,
    clients,
    keystore,
  });

  provider = oidc;
  return provider;
}
