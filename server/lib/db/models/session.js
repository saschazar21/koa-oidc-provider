import { initMongo } from '../mongo';
import { safeIdFactory } from '../../tools/id';

export default async function sessionModel(customClient) {
  const mongoose = customClient || await initMongo();

  const sessionSchema = new mongoose.Schema({
    _id: {
      default() { return safeIdFactory(128); },
      type: String,
    },
    account: {
      ref: 'User',
      type: String,
    },
    authorizations: mongoose.Schema.Types.Mixed,
    loginTs: Number,
    exp: Date,
    accountId: {
      ref: 'User',
      type: String,
    },
    returnTo: String,
    interaction: mongoose.Schema.Types.Mixed,
    uuid: String,
    params: mongoose.Schema.Types.Mixed,
    signed: [],
    result: mongoose.Schema.Types.Mixed,
  });

  return mongoose.model('Session', sessionSchema);
}
