import Provider from 'oidc-provider';

import Adapter from '../lib/db/adapter';
import Configuration from '../lib/config';
import getClients from '../lib/config/clients';
import loadKeystore from '../lib/keys';
import * as url from '../lib/tools/url';

export default async function bootstrapProvider() {
  const configuration = new Configuration();
  const config = await configuration.getConfig();
  const keystore = await loadKeystore();
  const clients = config.clients ? [...config.clients, ...await getClients()] : await getClients();
  const oidc = new Provider(url.oidcUrl, config);

  /**
   * Config object for initialize contains the following properties:
   * adapter, clients = [], keystore
   */
  await oidc.initialize({
    adapter: Adapter,
    clients,
    keystore,
  });

  return oidc.app;
}
