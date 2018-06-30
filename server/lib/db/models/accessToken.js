import { initMongo } from '../mongo';
import abstractTokenModel from './abstractToken';

export default async function accessTokenModel(customClient) {
  const mongoose = customClient || await initMongo();
  const Token = await abstractTokenModel(mongoose);

  return Token.discriminator('AccessToken', new mongoose.Schema({}));
}
