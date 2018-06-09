import Provider from 'oidc-provider';

import { Configuration, getClients, loadKeystore, url } from '../lib';

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
    clients,
    keystore,
  });

  return oidc.app;
}
