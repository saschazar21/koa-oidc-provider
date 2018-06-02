const DotEnv = require('dotenv-webpack');
const { resolve } = require('path');

module.exports = {
  webpack: (config, options, webpack) => {
    const conf = config;
    conf.entry.main = './server/index.js';

    const env = new DotEnv({
      path: resolve(process.cwd(), './.env'),
      safe: resolve(process.cwd(), './.env.sample'),
      systemvars: true,
    });

    const idx = conf.plugins.findIndex(el => el.hasOwnProperty('definitions'));

    if (idx < 0) {
      conf.plugins = [
        ...conf.plugins,
        env,
      ];
    } else {
      conf.plugins[idx].definitions = {
        ...conf.plugins[idx].definitions,
        ...env.definitions,
      };
    }

    return conf;
  },
};
