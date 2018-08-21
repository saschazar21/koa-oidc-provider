import { initMongo } from '../mongo';
import abstractTokenModel from './abstractToken';
import Configuration from '../../config';
import { ttl } from '../../config/ttl';

const configuration = new Configuration();

export default async function authorizationCodeModel(customClient) {
  const config = await configuration.getConfig();
  const mongoose = customClient || await initMongo();
  const Token = await abstractTokenModel(mongoose);

  if (Token.discriminators && Token.discriminators.AuthorizationCode) {
    return Token;
  }

  return Token.discriminator('AuthorizationCode', new mongoose.Schema({
    expiresAt: {
      default() {
        return this.exp;
      },
      expires: config.ttl && config.ttl.AuthorizationCode
        ? config.ttl.AuthorizationCode
        : ttl.AuthorizationCode,
      type: Date,
    },
  }));
}
