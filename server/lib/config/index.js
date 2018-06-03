import * as debug from 'debug';
import { pathExists, readJson, writeJson } from 'fs-extra';
import { resolve } from 'path';

import { privateDir, publicDir } from '../tools/directory';
import generatedConfig from './config';

const info = debug('info');

const configFile = resolve(privateDir, './openid-configuration');
const publicFile = resolve(publicDir, './openid-configuration');
let config;

export async function loadConfig() {
  try {
    if (!await pathExists(configFile)) {
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
    await Promise.all([
      writeJson(configFile, config),
      writeJson(publicFile, config),
    ]);
  }
  return config;
}
