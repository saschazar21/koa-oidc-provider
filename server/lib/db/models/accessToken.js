import { initMongo } from '../mongo';
import abstractTokenModel from './abstractToken';

export default async function accessTokenModel(customClient) {
  const mongoose = customClient || await initMongo();
  const Token = await abstractTokenModel(mongoose);

  const accessTokenSchema = new mongoose.Schema({
    createdAt: {
      default: Date.now,
      expires: 60 * 60 * 24,
      type: Date,
    },
  });

  return Token.discriminator('AccessToken', accessTokenSchema);
}
