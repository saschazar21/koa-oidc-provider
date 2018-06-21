import bluebird from 'bluebird';
import debug from 'debug';
import redis from 'redis';

bluebird.promisifyAll(redis);

const info = debug('info');
export const configuration = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  path: process.env.REDIS_PATH,
  db: process.env.REDIS_DB,
  password: process.env.REDIS_PASSWORD,
  user: process.env.REDIS_USER,
};

export function initRedis(externalConfig) {
  let client;
  const parsed = {};
  const config = externalConfig || configuration;
  if ((config.path && config.user) || (config.path && config.host)) {
    throw new Error('Redis configuration error! Path cannot be used in conjunction with user or host!');
  }
  Object.keys(config).forEach((k) => {
    if (config[k]) {
      parsed[k] = config[k];
    }
  });
  if (parsed.user && parsed.password) {
    const url = `redis://${parsed.user}:${parsed.password}@${parsed.host}:${parsed.port || '6379'}`;
    client = redis.createClient(`${url}${parsed.db ? `/${parsed.db}` : ''}`, parsed);
  }
  client = client || redis.createClient(parsed);
  client.on('ready', () => info(`Redis client ready, connected to ${parsed.path || parsed.host || 'localhost'}`));
  client.on('connect', () => info('Redis client finished connecting'));

  return client;
}

export { initRedis as default };
