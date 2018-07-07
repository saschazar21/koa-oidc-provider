import Promise from 'bluebird';
import debug from 'debug';
import { Issuer } from 'openid-client';

import Configuration from '../config';
import { oidcUrl } from '../tools/url';
import { getBaseClient } from '../config/clients';

const error = debug('error');

export async function googleClient() {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error('No google credentials found. Check your GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET environment variables.');
  }
  try {
    const googleIssuer = await Issuer.discover('https://accounts.google.com');
    const client = new googleIssuer.Client({
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
    });
    return client;
  } catch (e) {
    return Promise.reject(e);
  }
}

export async function openidClient() {
  const configuration = new Configuration();
  const config = await configuration.getConfig();
  const baseClient = await getBaseClient();
  const discovery = config.features.discovery ? `${oidcUrl}` : null;

  let openidIssuer;

  if (discovery) {
    openidIssuer = await Issuer.discover(discovery);
  } else {
    openidIssuer = new Issuer({
      issuer: oidcUrl,
      authorization_endpoint: `${oidcUrl}${config.routes.authorization}`,
      token_endpoint: `${oidcUrl}${config.routes.token}`,
      userinfo_endpoint: `${oidcUrl}${config.routes.userinfo}`,
      jwks_uri: `${oidcUrl}${config.routes.certificates}`,
    });
  }

  try {
    const client = new openidIssuer.Client({
      // eslint-disable-next-line no-underscore-dangle
      client_id: baseClient._id,
      client_secret: baseClient.client_secret,
    });
    return client;
  } catch (e) {
    error(e);
    throw new Error(`Setting up local OpenID Client failed! Reason: ${e.message}`);
  }
}
