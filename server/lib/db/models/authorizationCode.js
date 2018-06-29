import { initMongo } from '../mongo';
import abstractTokenModel from './abstractToken';

export default async function authorizationCodeModel(customClient) {
  const mongoose = customClient || await initMongo();

  const Token = await abstractTokenModel(mongoose);
  return Token.discriminator('AuthorizationCode', new mongoose.Schema({}));
}
