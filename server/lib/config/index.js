import * as debug from 'debug';
import { ensureDir, pathExists, readJson, writeJson } from 'fs-extra';
import { resolve } from 'path';

import { configDir } from '../tools/directory';
import generatedConfig from './config';

const info = debug('info');

const configFile = resolve(configDir, './openid-configuration');
let config;

export async function loadConfig() {
  try {
    const exists = await ensureDir(configDir).then(() => pathExists(configFile));
    if (!exists) {
      throw new Error('OpenID Configuration does not exist!');
    }
    info(`${configFile} exists. Attempting to use that file.`);
    return readJson(configFile);
  } catch (e) {
    return generatedConfig;
  }
}

export default async function getConfig() {
  if (!config) {
    const fileContents = await loadConfig();
    config = {
      ...fileContents,
    };
    await writeJson(configFile, config);
  }
  return config;
}
