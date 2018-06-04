import Provider from 'oidc-provider';
import { Configuration, url } from '../lib';

export default async function bootstrapProvider() {
  const config = new Configuration();
  const oidc = new Provider(url.baseUrl, await config.getConfig());

  await oidc.initialize();
  return oidc;
}
