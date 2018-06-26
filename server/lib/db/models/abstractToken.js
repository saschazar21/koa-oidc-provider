import { initMongo } from '../mongo';

/**
  * when `opaque`
  * - jti {string} unique identifier of the token
  * - kind {string} token class name
  * - exp {number} - timestamp of the token's expiration
  * - iat {number} - timestamp of the token's creation
  * - iss {string} - issuer identifier, useful in multi-provider instance apps
  * - accountId {string} - account identifier the token belongs to
  * - clientId {string} client identifier the token belongs to
  * - aud {array of strings} array of audiences the token is intended for
  * - authTime {number} timestamp of the end-user's authentication
  * - claims {object} requested claims (see claims parameter in OIDC Core 1.0)
  * - codeChallenge {string} - client provided PKCE code_challenge value
  * - codeChallengeMethod {string} - client provided PKCE code_challenge_method value
  * - grantId {string} - grant identifier, tokens with the same value belong together
  * - nonce {string} - random nonce from an authorization request
  * - redirectUri {string} - redirect_uri value from an authorization request
  * - scope {string} - scope value from on authorization request
  * - sid {string} - session identifier the token comes from
 */

export default async function abstractTokenModel(customClient) {
  const mongoose = customClient || await initMongo();

  const abstractOptions = {
    collection: 'tokens',
    discriminatorKey: 'kind',
  };

  const tokenSchema = new mongoose.Schema({
    accountId: {
      required: true,
      type: String,
      ref: 'User',
    },
    authTime: Date,
    claims: mongoose.SchemaTypes.Mixed,
    clientId: {
      required: true,
      type: String,
      ref: 'Client',
    },
    aud: {
      required: true,
      type: [String],
    },
    codeChallenge: String,
    codeChallengeMethod: String,
    exp: {
      required: true,
      type: Number,
    },
    grantId: {
      required: true,
      type: String,
    },
    iat: {
      required: true,
      type: Number,
    },
    iss: {
      required: true,
      type: String,
    },
    jti: {
      required: true,
      type: String,
    },
    nonce: String,
    redirectUri: String,
    scope: {
      required: true,
      type: String,
    },
    sid: String,
    sub: {
      default: this.accountId,
      type: String,
    },
    consumed: Date,
    expiresAt: {
      default: this.exp,
      type: Date,
    },
  });

  return mongoose.model('Token', tokenSchema, abstractOptions);
}
