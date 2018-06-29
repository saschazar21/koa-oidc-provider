import { initMongo } from '../mongo';
import abstractTokenModel from './abstractToken';

export default async function refreshTokenModel(customClient) {
  const mongoose = customClient || await initMongo();

  const Token = await abstractTokenModel(mongoose);
  return Token.discriminator('RefreshToken', new mongoose.Schema({}));
}
