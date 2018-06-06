import debug from 'debug';
import { pathExists, readJson, writeJson } from 'fs-extra';
import { asKeyStore, createKeyStore } from 'oidc-provider';
import { resolve } from 'path';

import { privateDir } from '../tools/directory';

const info = debug('info');

const keysFile = resolve(privateDir, './jwks.json');
let jwks;

async function generate() {
  const keystore = createKeyStore();
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
  if (!jwks) {
    try {
      if (!await pathExists(keysFile)) {
        throw new Error('JWK file does not exist! Attempting to create new file.');
      }

      info(`${keysFile} file exists, attempting to use that one.`);
      jwks = await asKeyStore(await readJson(keysFile));
    } catch (e) {
      info(e.message || e);
      const keystore = await generate();
      await Promise.all([
        writeJson(keysFile, keystore.toJSON(true), {
          spaces: 2,
        }),
      ]);
      info(`New JWK files created. Saved under 
        - Private: ${keysFile}`);
      jwks = keystore;
    }
  }
  return jwks;
}
