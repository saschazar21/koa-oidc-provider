import Promise from 'bluebird';
import { BasicStrategy } from 'passport-http';
import debug from 'debug';
import passport from 'koa-passport';
import bootstrapProvider from '../../../provider';

const error = debug('error:auth');
const info = debug('info');

export default class BasicPassport {
  constructor(pass) {
    this.passport = pass || passport;
  }

  async init() {
    try {
      const provider = await bootstrapProvider();

      this.passport.use('basic', new BasicStrategy(async (user, password, done) => {
        try {
          const client = await provider.Client.find(user);
          info(`Found client: ${client.clientId}`);
          if (password !== client.clientSecret) {
            throw new Error('Client secret mismatch!');
          }
          return done(null, client);
        } catch (e) {
          error(e.message || e);
          return done(null, false);
        }
      }));

      return this.passport;
    } catch (err) {
      error(err.message || err);
      return Promise.reject(err);
    }
  }
}
