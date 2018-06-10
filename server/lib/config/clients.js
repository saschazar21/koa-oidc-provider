import debug from 'debug';
import { pathExists, readJson } from 'fs-extra';
import { resolve } from 'path';

import { privateDir } from '../tools/directory';

const error = debug('error');
const info = debug('info');
const clients = resolve(privateDir, './clients.js');

let available;

export default async function getClients() {
  if (!available) {
    try {
      if (!await pathExists(clients)) {
        throw new Error(`No ${clients} file present. Returning empty object`);
      }
      const predefined = await readJson(clients);
      info(`${clients} file found. Will include clients from there`);
      available = Array.isArray(predefined) ? predefined : [predefined];
    } catch (e) {
      error(e.message || e);
      available = [];
    }
  }
  return available;
}
