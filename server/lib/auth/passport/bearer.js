import Promise from 'bluebird';
import debug from 'debug';
import passport from 'koa-passport';
import BearerStrategy from 'passport-http-bearer';

import accessTokenModel from '../../db/models/accessToken';

const error = debug('error:auth');

export default class BearerPassport {
  constructor(pass) {
    this.passport = pass || passport;
  }

  async init() {
    try {
      const Token = await accessTokenModel();

      this.passport.use('bearer', new BearerStrategy(async (token, done) => {
        try {
          // TODO: Check for token format
          if (token.split('.').length > 1) {
            // It's a JWT, baby
          }
          const tokenResult = await Token
            .findById(token)
            .populate({
              path: 'clientId',
              select: '-client_secret -__v',
            })
            .populate({
              path: 'accountId',
              select: '-password -__v',
            });
          if (!tokenResult) {
            throw new Error(`No access token found: ${token}`);
          }
          const result = tokenResult.toJSON();
          const user = {
            ...result.accountId,
            client: result.clientId,
            token: {
              /* eslint-disable-next-line no-underscore-dangle */
              access_token: result._id,
              iat: result.iat,
              iss: result.iss,
              exp: result.exp,
              scope: result.scope,
            },
          };
          return done(null, user, { scope: result.scope });
        } catch (e) {
          error(e.message || e);
          return done(e);
        }
      }));

      return this.passport;
    } catch (e) {
      error(e.message || e);
      return Promise.reject(e);
    }
  }
}
