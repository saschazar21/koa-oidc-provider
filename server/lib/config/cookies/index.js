import keyFactory from '../../tools/cookie';
import { ttl } from '../ttl';

export const cookies = {
  keys: keyFactory(),
  long: {
    secure: true,
    signed: true,
    httpOnly: true,
    maxAge: ttl.RefreshToken,
  },
  names: {
    session: '_session',
    interaction: '_grant',
    resume: '_grant',
    state: '_state',
  },
  short: {
    secure: true,
    signed: true,
    httpOnly: true,
    maxAge: ttl.AccessToken,
  },
};

export { cookies as default };
