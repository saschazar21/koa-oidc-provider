import debug from 'debug';

import userModel from '../db/models/user';

const error = debug('error:router');

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
