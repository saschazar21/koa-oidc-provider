import { Issuer } from 'openid-client';

import Configuration from '../config';
import { baseUrl, oidcPrefix } from '../tools/url';

export default async function getIssuer() {
  const configuration = new Configuration();
  const config = await configuration.getConfig();
  const discovery = config.features.discovery ? `${baseUrl}${oidcPrefix}/.well-known/openid-configuration` : null;

  if (discovery) {
    return Issuer.discover(discovery);
  }
  return new Issuer({
    // TODO: Enhance issuer generation.
    // issuer: 'https://accounts.google.com',
    // authorization_endpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    // token_endpoint: 'https://www.googleapis.com/oauth2/v4/token',
    // userinfo_endpoint: 'https://www.googleapis.com/oauth2/v3/userinfo',
    // jwks_uri: 'https://www.googleapis.com/oauth2/v3/certs',
  });
}
