import bluebird from 'bluebird';
import debug from 'debug';
import mongoose from 'mongoose';

const error = debug('error');
const info = debug('info');

export const configuration = {
  reconnectTries: 20,
  pass: process.env.MONGO_PASSWORD,
  promiseLibrary: bluebird,
  user: process.env.MONGO_USER,
};

export async function initMongo(host, port, config) {
  const db = process.env.MONGO_DB || config.dbName || '';
  const hostname = host || process.env.MONGO_HOST || '127.0.0.1';
  const portNo = port || process.env.MONGO_PORT || 27017;
  const conf = config || configuration;

  try {
    const connection = await mongoose.connect(`mongodb://${hostname}:${portNo}/${db || ''}`, conf);
    info(`Connected to MongoDB ${hostname}:${portNo}`);
    return connection;
  } catch (e) {
    error(e.message || e);
    return mongoose.connect('127.0.0.1:27017');
  }
}

export { initMongo as default };
