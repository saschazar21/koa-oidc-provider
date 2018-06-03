import loadKeystore from '../keys';

export const validSignAlg = [
  'HS256',
  'HS384',
  'HS512',
  'RS256',
  'RS384',
  'RS512',
  'ES256',
  'ES384',
  'PS384',
  'PS512',
  'none',
];

export async function supportedSignAlg() {
  const keystore = await loadKeystore();
  return [
    ...validSignAlg
      .filter(alg => keystore.all({
        alg,
        use: 'sig',
      }).length > 0),
    'none',
  ];
}

export const validEncAlg = [];
