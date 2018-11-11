import bluebird from 'bluebird';
import debug from 'debug';
import mongoose from 'mongoose';

const info = debug('info');

function checkDbName(possibilities) {
  const compare = Array.isArray(possibilities) ? possibilities : [possibilities];
  const result = compare
    .filter(name => typeof name === 'string' && /\S+/.test(name))
    .map(name => name.trim());
  return result.length > 0 ? result[0] : 'admin';
}

export const configuration = {
  reconnectTries: 20,
  pass: process.env.MONGO_PASSWORD,
  promiseLibrary: bluebird,
  user: process.env.MONGO_USER,
};

export async function initMongo(host, port, dbName, config) {
  const db = checkDbName([dbName, process.env.MONGO_DB, 'admin']);
  const hostname = host || process.env.MONGO_HOST || '127.0.0.1';
  const portNo = port || process.env.MONGO_PORT || 27017;
  let conf = config || configuration;
  conf = {
    ...conf,
    pass: conf.pass || process.env.MONGO_PASSWORD || null,
    useNewUrlParser: true,
    user: conf.user || process.env.MONGO_USER || null,
  };

  const mongoUrl = process.env.MONGO_URL;
  const mongoString = `mongodb://${mongoUrl && mongoUrl.length > 0 ? mongoUrl : `${hostname}:${portNo}/${db}`}`;
  const connection = await mongoose.connect(mongoString, conf);
  info(`Connected to MongoDB ${hostname}:${portNo}`);
  return connection;
}

export { initMongo as default };
