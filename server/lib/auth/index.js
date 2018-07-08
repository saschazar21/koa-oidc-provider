import Promise from 'bluebird';
import debug from 'debug';
import passport from 'koa-passport';
import { Strategy } from 'openid-client';

import { openidClient } from './client';
import userModel from '../db/models/user';

const error = debug('error');
const info = debug('info');

export async function bootstrapOidc() {
  const result = await Promise.all([userModel(), openidClient()]);
  const User = result[0];
  const client = result[1];

  const params = {
    scope: 'openid profile',
  };

  passport.use('oidc', new Strategy(
    {
      client,
      params,
      passReqToCallback: true,
    },
    async (req, tokenset, userinfo, done) => {
      if (!tokenset.id_token) {
        throw new Error('No ID Token present.');
      }
      try {
        await User.findById(tokenset.claims.sub, '_id email family_name given_name picture');
        info(`${userinfo.name} successfully retrieved from DB.`);
        return done(null, userinfo);
      } catch (e) {
        error(e.message || e);
        return done(e);
      }
    },
  ));

  passport.deserializeUser(async (profile, done) => {
    try {
      await User.findById(profile.sub, '_id email family_name given_name picture');
      return done(null, profile);
    } catch (e) {
      error(e.message || e);
      return done(e);
    }
  });

  passport.serializeUser((profile, done) => done(null, profile));

  return passport;
}

export async function bootstrapPassport() {
  return bootstrapOidc();
}

export { bootstrapPassport as default };
