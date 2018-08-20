import debug from 'debug';
import passport from 'koa-passport';
import userModel from '../db/models/user';
import BearerPassport from './passport/bearer';
import LocalPassport from './passport/local';
import ExternalPassport from './passport/external';
import { isGoogleEnabled, isMicrosoftEnabled, isYahooEnabled } from '../tools/auth';
import BasicPassport from './passport/basic';

const error = debug('error:auth');
const info = debug('info');

let pass;

export async function bootstrapPassport() {
  if (pass) {
    return pass;
  }

  const basic = new BasicPassport(passport);
  try {
    pass = await basic.init();
  } catch (e) {
    error(e.message || e);
    throw e;
  }

  const bearer = new BearerPassport(passport);
  try {
    pass = await bearer.init();
  } catch (e) {
    error(e.message || e);
    throw e;
  }

  const local = new LocalPassport(passport);
  try {
    pass = await local.init();
  } catch (e) {
    error(e.message || e);
    throw e;
  }

  const external = new ExternalPassport(pass);
  try {
    const enabled = [];
    const providers = [];
    if (isGoogleEnabled) {
      enabled.push('google');
      providers.push(external.init('google'));
    }
    if (isMicrosoftEnabled) {
      enabled.push('microsoft');
      providers.push(external.init('microsoft'));
    }
    if (isYahooEnabled) {
      enabled.push('yahoo');
      providers.push(external.init('yahoo'));
    }
    await Promise.all(providers);
    info(`Registered external providers: ${enabled.join(', ')}`);
  } catch (e) {
    error(e.message || e);
    throw e;
  }

  const User = await userModel();
  pass.deserializeUser(async (profile, done) => {
    try {
      await User.findById(profile.sub, '_id email family_name given_name picture');
      return done(null, profile);
    } catch (e) {
      error(e.message || e);
      return done(e);
    }
  });

  pass.serializeUser((profile, done) => done(null, profile));

  return pass;
}

export { bootstrapPassport as default };
