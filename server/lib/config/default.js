import keyFactory from '../tools/cookie';

export default {
  acrValues: [
    'urn:mace:incommon:iap:silver',
    'urn:mace:incommon:iap:bronze',
  ],
  clientCacheDuration: 600,
  cookies: {
    keys: keyFactory(),
  },
  subjectTypes: ['public'],
};
