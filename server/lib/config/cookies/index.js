import keyFactory from '../../tools/cookie';

export const cookies = {
  keys: keyFactory(),
  long: {
    secure: true,
    signed: true,
    httpOnly: true,
    maxAge: 1209600000,
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
