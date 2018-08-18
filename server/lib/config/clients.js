import Promise from 'bluebird';
import debug from 'debug';
import { pathExists, readJson } from 'fs-extra';
import { resolve } from 'path';

import pkg from '../../../package.json';
import { privateDir } from '../tools/directory';
import clientModel from '../db/models/client';
import { oidcUrl, port } from '../tools/url';

const error = debug('error:setup');
const info = debug('info');
const clients = resolve(privateDir, './clients.js');

let available;
let baseClient;

export async function getBaseClient() {
  if (baseClient) {
    return baseClient;
  }

  const Client = await clientModel();
  const client = new Client({
    client_name: process.env.APP_NAME || pkg.name,
    owner: process.env.APP_NAME || pkg.name,
    grant_types: ['implicit'],
    redirect_uris: `${process.env.NODE_ENV === 'test' ? `https://127.0.0.1:${port}` : oidcUrl}/login/finish`,
    response_types: ['id_token'],
  });

  try {
    baseClient = client.toJSON();
    info('Base Client created, it uses the following configuration:');
    info(baseClient);
    process.env.CLIENT_ID = baseClient.client_id;
    process.env.CLIENT_SECRET = baseClient.client_secret;
    return baseClient;
  } catch (e) {
    error(e.message || e);
    return Promise.reject(e);
  }
}

export async function getClients() {
  if (available) {
    return available;
  }

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
  return available;
}

export { getClients as default };
