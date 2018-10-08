import debug from 'debug';

import userModel from '../db/models/user';
import { scopes } from '../config/scopes';

const error = debug('error:auth');
const info = debug('info');

export const isGoogleEnabled = process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET;

export const isMicrosoftEnabled = process.env.MICROSOFT_CLIENT_ID
  && process.env.MICROSOFT_CLIENT_SECRET;

export const isYahooEnabled = process.env.YAHOO_CLIENT_ID && process.env.YAHOO_CLIENT_SECRET;

export async function registeredUsers() {
  const User = await userModel();

  try {
    const users = User.find({}, '-password');
    return users.length;
  } catch (e) {
    error(e.message || e);
    return 0;
  }
}

export async function requireScopes(ctx, next, scope) {
  try {
    if (ctx.state.user && ctx.state.user.clientSecret) {
      info('Token scope check: found client secret; basic auth method chosen.');
      return next();
    }
    if (!ctx.state.user || !ctx.state.user.token || !ctx.state.user.token.scope) {
      throw new Error('User is not logged in or no token information found!');
    }
    if (!scope || !scope.length) {
      throw new Error('Middleware called, but no scope value given!');
    }
    const array = Array.isArray(scope) ? scope : scope.split(' ');
    const valid = array.filter(s => scopes.indexOf(s) >= 0);

    if (valid.length !== array.length) {
      throw new Error(`Unsupported scope values given, please check: ${array.join(' ')}`);
    }
    ctx.state.scope = array;

    const available = ctx.state.user.token.scope.split(' ').map(s => s.trim());
    const required = valid.filter(s => available.indexOf(s) >= 0);

    if (required.length !== valid.length) {
      throw new Error(`Insufficient scopes present! Necessary scopes are ${valid.join(', ')}`);
    }
    return next();
  } catch (e) {
    error(e.message || e);
    ctx.status = e.statusCode || 403;
    ctx.body = { error: e.message || e };
    return ctx;
  }
}
