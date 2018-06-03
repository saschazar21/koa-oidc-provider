import debug from 'debug';
import { pathExists, readJson, writeJson } from 'fs-extra';
import { JWK } from 'node-jose';
import { resolve } from 'path';

import { privateDir, publicDir } from '../tools/directory';

const info = debug('info');

const keysFile = resolve(privateDir, './jwks.json');
const jwksFile = resolve(publicDir, './jwks.json');
let jwks;

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
  if (!jwks) {
    try {
      if (!await pathExists(keysFile)) {
        throw new Error('JWK file does not exist! Attempting to create new file.');
      }

      info(`${keysFile} file exists, attempting to use that one.`);
      jwks = JWK.asKeyStore(await readJson(keysFile));

      if (!await pathExists(jwksFile)) {
        await writeJson(jwksFile, jwks.toJSON());
      }
    } catch (e) {
      info(e.message || e);
      const keystore = await generate();
      await Promise.all([
        writeJson(jwksFile, keystore.toJSON()),
        writeJson(keysFile, keystore.toJSON(true)),
      ]);
      info(`New JWK files created. Saved under 
        - Public: ${jwksFile},
        - Private: ${keysFile}`);
      jwks = keystore;
    }
  }
  return jwks;
}
