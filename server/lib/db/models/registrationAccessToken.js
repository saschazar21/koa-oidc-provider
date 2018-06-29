import { initMongo } from '../mongo';
import abstractTokenModel from './abstractToken';

export default async function registrationAccessToken(customClient) {
  const mongoose = customClient || await initMongo();

  const Token = await abstractTokenModel(mongoose);
  return Token.discriminator('RegistrationAccessToken', new mongoose.Schema({}));
}
