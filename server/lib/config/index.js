import * as debug from 'debug';
import { ensureDir, pathExists, readJson, writeJson } from 'fs-extra';
import { resolve } from 'path';

import { configDir } from '../tools/directory';

const info = debug('info');

const config = resolve(configDir, './openid-configuration');

export async function loadConfig() {
  try {
    const exists = await ensureDir(configDir).then(() => pathExists(config));
    if (!exists) {
      throw new Error('OpenID Configuration does not exist!');
    }
    info(`${config} exists. Attempting to use that file.`);
    return readJson(config);
  } catch (e) {
    return {};
  }
}

export default async function getConfig() {
  const fileContents = await loadConfig();
  const updated = {
    ...fileContents,
  };
  await writeJson(config, updated);
  return updated;
}
