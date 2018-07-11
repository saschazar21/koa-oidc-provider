import Promise from 'bluebird';
import debug from 'debug';
import passport from 'koa-passport';
import { Strategy } from 'openid-client';

import userModel from '../../db/models/user';

const error = debug('error');
const info = debug('info');

export default class AbstractPassport {
  constructor(Provider, pass) {
    this.Provider = Provider;
    this.passport = pass || passport;

    this.params = {
      scope: 'openid profile',
    };
  }

  async init(name) {
    try {
      const result = await Promise.all([userModel(), this.provider()]);
      const User = result[0];
      const provider = result[1];
      const sanitized = name ? name.toLowerCase() : 'oidc';

      this.passport.use(sanitized, new Strategy(
        {
          client: await provider.client(sanitized),
          params: this.params,
          passReqToCallback: true,
        },
        async (req, tokenset, userinfo, done) => {
          if (!tokenset.id_token) {
            throw new Error('No ID Token present.');
          }
          try {
            // TODO: Also support upsert, when using external Provider
            await User.findById(tokenset.claims.sub, '_id email family_name given_name picture');
            info(`${userinfo.name} successfully retrieved from DB.`);
            return done(null, userinfo);
          } catch (e) {
            error(e.message || e);
            return done(e);
          }
        },
      ));

      return this.passport;
    } catch (e) {
      error(e.message || e);
      return Promise.reject(e);
    }
  }

  async provider() {
    try {
      const config = await this.Provider.init();
      this.provider = new this.Provider(config);
      return this.provider;
    } catch (e) {
      error(e.message || e);
      return Promise.reject(e);
    }
  }
}
