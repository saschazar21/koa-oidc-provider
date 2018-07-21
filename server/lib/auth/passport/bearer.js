import Promise from 'bluebird';
import debug from 'debug';
import passport from 'koa-passport';
import BearerStrategy from 'passport-http-bearer';

import accessTokenModel from '../../db/models/accessToken';

const error = debug('error:router');

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
              select: '-client_secret __v',
            })
            .populate({
              path: 'accountId',
              select: '-password -__v',
            });
          if (!tokenResult) {
            throw new Error(`No access token found: ${token}`);
          }
          const obj = tokenResult.toJSON();
          return done(null, obj, { scope: obj.scope });
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
