import debug from 'debug';

import userModel from '../db/models/user';

const error = debug('error:setup');

let User;

export default async function registrationEnabled() {
  if (process.env.REGISTRATION) {
    return true;
  }

  User = User || await userModel();
  try {
    const users = await User.estimatedDocumentCount();
    return users === 0;
  } catch (e) {
    error(e.message || e);
    return false;
  }
}
