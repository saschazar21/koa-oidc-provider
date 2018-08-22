import debug from 'debug';

import userModel from '../db/models/user';
import { scopes } from '../config/scopes';

const error = debug('error:auth');

export const isGoogleEnabled = process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET;

export const isMicrosoftEnabled = process.env.MICROSOFT_CLIENT_ID
  && process.env.MICROSOFT_CLIENT_SECRET;

export const isYahooEnabled = process.env.YAHOO_CLIENT_ID && process.env.YAHOO_CLIENT_SECRET;

export async function checkScopes(ctx, next) {
  try {
    if (!ctx.state.scope || ctx.state.scope.length === 0) {
      return next();
    }
    if (ctx.state.scope && (!ctx.state.user || !ctx.state.user.scope)) {
      throw new Error('Scope required, but none available in token! Request new token w/ necessary scope.');
    }
    const availableScopes = Array.isArray(ctx.state.user.scope) ? ctx.state.user.scope : ctx.state.user.scope.split(' ');
    const requiredScopes = Array.isArray(ctx.state.scope) ? ctx.state.scope : ctx.state.scope.split(' ');
    const validScopes = requiredScopes.filter(scope => availableScopes.indexOf(scope) >= 0);

    if (validScopes.length !== requiredScopes) {
      throw new Error('Required scope mismatch! Request new token w/ necessary scope.');
    }
    return next();
  } catch (e) {
    error(e.message || e);
    ctx.status = 403;
    ctx.body = {
      error: e.message,
    };
    return e;
  }
}

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
  if (!scope || !scope.length) {
    throw new Error('Middleware called, but no scope value given!');
  }
  const array = Array.isArray(scope) ? scope : scope.split(' ');
  const valid = array.filter(s => scopes.indexOf(s) >= 0);
  if (valid.length !== array.length) {
    throw new Error(`Unsupported scope values given, please check: ${array.join(' ')}`);
  }
  ctx.state.scope = array;
  return next();
}
