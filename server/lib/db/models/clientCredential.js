import { initMongo } from '../mongo';
import abstractTokenModel from './abstractToken';

export default async function clientCredentialModel(customClient) {
  const mongoose = customClient || await initMongo();

  const Token = await abstractTokenModel(mongoose);
  return Token.discriminator('ClientCredentials', new mongoose.Schema({}));
}
