import bluebird from 'bluebird';
import debug from 'debug';
import mongoose from 'mongoose';

const info = debug('info');

export const configuration = {
  reconnectTries: 20,
  pass: process.env.MONGO_PASSWORD,
  promiseLibrary: bluebird,
  user: process.env.MONGO_USER,
};

export async function initMongo(host, port, config) {
  const db = process.env.MONGO_DB || '';
  const hostname = host || process.env.MONGO_HOST || '127.0.0.1';
  const portNo = port || process.env.MONGO_PORT || 27017;
  const conf = config || configuration;

  const connection = await mongoose.connect(`mongodb://${hostname}:${portNo}/${db}`, conf);
  info(`Connected to MongoDB ${hostname}:${portNo}`);
  return connection;
}

export { initMongo as default };
