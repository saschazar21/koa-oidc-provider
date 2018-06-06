import Provider from 'oidc-provider';

import { Configuration, loadKeystore, url } from '../lib';

export default async function bootstrapProvider() {
  const config = new Configuration();
  const keystore = await loadKeystore();
  const oidc = new Provider(url.oidcUrl, await config.getConfig());

  /**
   * Config object for initialize contains the following properties:
   * adapter, clients = [], keystore
   */
  await oidc.initialize({
    keystore,
  });

  return oidc.app;
}
