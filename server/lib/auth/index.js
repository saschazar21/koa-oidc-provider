import debug from 'debug';
import passport from 'koa-passport';
import userModel from '../db/models/user';
import LocalPassport from './passport/local';
import ExternalPassport from './passport/external';
import { isGoogleEnabled, isMicrosoftEnabled, isYahooEnabled } from '../tools/auth';

const error = debug('error');
const info = debug('info');

let pass;

export async function bootstrapPassport() {
  if (pass) {
    return pass;
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