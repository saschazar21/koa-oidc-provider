import { initMongo } from '../mongo';
import abstractTokenModel from './abstractToken';

export default async function initialAccessTokenModel(customClient) {
  const mongoose = customClient || await initMongo();

  const Token = await abstractTokenModel(mongoose);
  return Token.discriminator('InitialAccessToken', new mongoose.Schema({}));
}
