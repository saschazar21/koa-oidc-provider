import Configuration from '../../config';
import { oidcUrl } from '../../tools/url';
import { getBaseClient } from '../../config/clients';
import AbstractProvider from './abstract';

let conf;

export default class LocalProvider extends AbstractProvider {
  constructor(config) {
    super(config || conf);
  }

  async client() {
    return super.client('local');
  }

  static async init() {
    const configuration = new Configuration();
    const result = await Promise.all([configuration.getConfig(), getBaseClient()]);
    const config = result[0];
    const baseClient = result[1];

    conf = {
      local: {
        client: {
          ...baseClient,
          // eslint-disable-next-line no-underscore-dangle
          client_id: baseClient._id,
        },
        config: {
          issuer: oidcUrl,
          authorization_endpoint: `${oidcUrl}${config.routes.authorization}`,
          token_endpoint: `${oidcUrl}${config.routes.token}`,
          userinfo_endpoint: `${oidcUrl}${config.routes.userinfo}`,
          jwks_uri: `${oidcUrl}${config.routes.certificates}`,
        },
      },
    };
    return conf;
  }
}
