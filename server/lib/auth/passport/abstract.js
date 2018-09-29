import Promise from 'bluebird';
import debug from 'debug';
import passport from 'koa-passport';
import { Strategy } from 'openid-client';

import userModel from '../../db/models/user';

const error = debug('error:auth');
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
      const client = await provider.client(sanitized);

      this.passport.use(sanitized, new Strategy(
        {
          client,
          params: this.params,
          passReqToCallback: true,
        },
        async (req, tokenset, userinfo, done) => {
          let token;
          let user;
          if (!tokenset.id_token && !tokenset.access_token) {
            throw new Error('No ID Token or Access Token present.');
          }
          if (tokenset.id_token && !tokenset.access_token) {
            const body = tokenset.id_token.split('.')[1];
            const parsed = JSON.parse(Buffer.from(body, 'base64').toString('utf8'));
            token = {
              ...token,
              ...tokenset,
              expires_in: new Date(parsed.exp * 1000).toISOString(),
            };
            // TODO: Also support upsert, when using external Provider
            const userResult = await User.findById(tokenset.claims.sub, '_id email family_name given_name name picture');
            user = userResult.toJSON();
          }
          try {
            user = userinfo || user;
            info(`${user.name} successfully retrieved from DB.`);
            return done(null, {
              ...user,
              token,
            });
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
