import debug from 'debug';
import { ensureDir, pathExists, readJson, writeJson } from 'fs-extra';
import { JWK } from 'node-jose';
import { resolve } from 'path';

import { configDir } from '../tools/directory';

const info = debug('info');

const jwks = resolve(configDir, './jwks.json');

async function generate() {
  const keystore = JWK.createKeyStore();
  return Promise.all([
    keystore.generate('RSA', 2048, {
      kid: 'sig-rs-0',
      use: 'sig',
    }),
    keystore.generate('RSA', 2048, {
      kid: 'enc-rs-0',
      use: 'enc',
    }),
    keystore.generate('EC', 'P-256', {
      kid: 'sig-ec2-0',
      use: 'sig',
    }),
    keystore.generate('EC', 'P-256', {
      kid: 'enc-ec2-0',
      use: 'enc',
    }),
    keystore.generate('EC', 'P-384', {
      kid: 'sig-ec3-0',
      use: 'sig',
    }),
    keystore.generate('EC', 'P-384', {
      kid: 'enc-ec3-0',
      use: 'enc',
    }),
    keystore.generate('EC', 'P-521', {
      kid: 'sig-ec5-0',
      use: 'sig',
    }),
    keystore.generate('EC', 'P-521', {
      kid: 'enc-ec5-0',
      use: 'enc',
    }),
  ])
    .then(() => keystore);
}

export default async function loadKeystore() {
  try {
    const exists = await ensureDir(configDir).then(() => pathExists(jwks));
    if (!exists) {
      throw new Error('JWK file does not exist! Attempting to create new file.');
    }
    const keystore = await readJson(jwks);
    info('JWK file exists, attempting to use that one.');
    return JWK.asKeyStore(keystore);
  } catch (e) {
    info(e.message || e);
    const keystore = await generate();
    await writeJson(jwks, keystore.toJSON());
    info(`New JWK file created. Saved under ${jwks}`);
    return keystore;
  }
}
