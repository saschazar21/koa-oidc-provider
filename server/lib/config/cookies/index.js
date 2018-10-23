import keyFactory from '../../tools/cookie';
import { ttl } from '../ttl';

export const cookies = {
  keys: keyFactory(),
  long: {
    secure: true,
    signed: true,
    httpOnly: true,
    maxAge: ttl.AccessToken * 1000,
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
    maxAge: 600000,
  },
};

export { cookies as default };
