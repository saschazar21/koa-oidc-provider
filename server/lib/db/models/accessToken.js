import Configuration from '../../config';
import { initMongo } from '../mongo';
import abstractTokenModel from './abstractToken';

const configuration = new Configuration();

export default async function accessTokenModel(customClient) {
  const config = await configuration.getConfig();
  const mongoose = customClient || await initMongo();
  const Token = await abstractTokenModel(mongoose);

  return Token.discriminator('AccessToken', new mongoose.Schema({
    expiresAt: {
      default() {
        return this.exp;
      },
      expires: config.ttl && config.ttl.AccessToken ? config.ttl.AccessToken : 3600,
      type: Date,
    },
  }));
}
