export const applicationType = ['native', 'web'];
export const grantTypes = [
  'authorization_code',
  'implicit',
  'refresh_token',
];
export const tokenEndpointAuthMethod = [
  'client_secret_post',
  'client_secret_basic',
  'client_secret_jwt',
  'private_key_jwt',
  'none',
];
export const responseTypes = [
  'code',
  'id_token',
  'token id_token',
  'code id_token',
  'code token',
  'code token id_token',
];
export const signatureAlg = [
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
export const encryptionAlg = [
  'RSA1_5',
  'RSA-OAEP',
  'RSA-OAEP-256',
  'A128KW',
  'A192KW',
  'A256KW',
  'dir',
  'ECDH-ES',
  'ECDH-ES+A128KW',
  'ECDH-ES+A192KW',
  'ECDH-ES+A256KW',
  'A128GCMKW',
  'A192GCMKW',
  'A256GCMKW',
  'PBES2-HS256+A128KW',
  'PBES2-HS384+A192KW',
  'PBES2-HS512+A256KW',
];
export const encryptionEnc = [
  'A128CBC-HS256',
  'A192CBC-HS384',
  'A256CBC-HS512',
  'A128GCM',
  'A192GCM',
  'A256GCM',
];
