/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
const DotEnv = require('dotenv-webpack');
const { resolve } = require('path');

module.exports = {
  webpack: (config) => {
    const conf = config;
    conf.entry.main = './server/index.js';
    const env = new DotEnv({
      path: resolve(process.cwd(), './.env'),
      systemvars: true,
    });
    const idx = conf.plugins.findIndex(el => Object.prototype.hasOwnProperty.call(el, 'definitions'));
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
